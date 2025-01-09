import { config } from "../../config/config.js";
import { PACKET_TYPE } from "../../constants/header.js";
import { getProtoMessages } from "../../init/loadProtos.js";
import { getNextSequence } from "../../session/userSession.js";

export const createResponse = (handerId, responseCode, data = null, userId) => {
	const protoMessages = getProtoMessages();
	const Response = protoMessages.response.Response;

	const responsePayload = {
		handerId,
		responseCode,
		timestamp: Date.now(),
		data: data ? Buffer.from(JSON.stringify(data)) : null,
		sequence: userId ? getNextSequence(userId) : 0,
	};

	const buffer = Response.encode(responsePayload).finish();

	const packetLength = Buffer.alloc(config.packet.totalLength);
	packetLength.writeInt32BE(buffer.length + config.packet.totalLength + config.packet.typeLength);

	const packeType = Buffer.alloc(config.packet.typeLength);
	packeType.writeUint8(PACKET_TYPE.NORMAL);

	return Buffer.concat([packetLength, packeType, buffer]);
};
