import { config } from "../../config/config.js";
import { getProtoTypeNameByHandlerID } from "../../handlers/index.js";
import { getProtoMessages } from "../../init/loadProtos.js";
import customError from "../error/customError.js";
import { erroCode } from "../error/errorCodes.js";

export const packetParser = (data) => {
	const protoMessages = getProtoMessages();
	// 공통 패킷 구조를 디코딩
	const Packet = protoMessages.common.Packet;
	let packet;
	try {
		packet = Packet.decode(data);
	} catch (error) {
		throw new customError(erroCode.PACKET_DECODE_ERROR, "패킷 디코딩중 오류 발생!");
	}

	const handlerId = packet.handlerId;
	const userId = packet.userId;
	const clientVersion = packet.clientVersion;
	const sequence = packet.sequence;

	if (clientVersion !== config.client.version) {
		throw new customError(
			erroCode.CLIENT_VERSION_MISMATCH,
			"클라이언트 버전이 일치하지 않습니다."
		);
	}

	const protoTypeName = getProtoTypeNameByHandlerID(handlerId);
	if (!protoTypeName) {
		throw new customError(
			erroCode.UNKNOWN_HANDLER_ID,
			"알 수 없는 핸들러 아이디 입니다!"
		);
	}

	const [namespace, typeName] = protoTypeName.split(".");
	const payloadType = protoMessages[namespace][typeName];

	let payload;

	try {
		payload = payloadType.decode(packet.payload);
	} catch (error) {
		throw new customError(erroCode.PACKET_DECODE_ERROR, "패킷 디코딩중 오류 발생!");
	}

	const errorMesage = payloadType.verify(payload);
	if (errorMesage) {
		throw new customError(erroCode.INVALID_PACKET, "패킷 구조 오류 발생!");
	}

	// 필드가 없음! (필수 필드 누락!)
	const expectedFields = Object.keys(payloadType.fields);
	const actualFields = Object.keys(payload);
	const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

	if (missingFields.length > 0) {
		throw new customError(erroCode.MISSING_FIELDS, "필수 필드가 누락 되었습니다!");
	}
	return { handlerId, userId, payload, sequence };
};
