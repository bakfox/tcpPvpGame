import { config } from "../config/config.js";
import { PACKET_TYPE } from "../constants/header.js";
import { getHandlerById } from "../handlers/index.js";
import { getProtoMessages } from "../init/loadProtos.js";
import { getUserById, getUserBySocket } from "../session/userSession.js";
import customError from "../utils/error/customError.js";
import { erroCode } from "../utils/error/errorCodes.js";
import { handlerError } from "../utils/error/errorHandler.js";
import { packetParser } from "../utils/parser/packetParser.js";

export const onData = (socket) => async (data) => {
	socket.buffer = Buffer.concat([socket.buffer, data]);
	const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

	while (socket.buffer.length >= totalHeaderLength) {
		const length = socket.buffer.readUInt32BE(0);
		const packetTpye = socket.buffer.readUInt8(config.packet.totalLength);
		if (socket.buffer.length >= length) {
			// totalHeaderLength 이 길이는 헤더 길이입니다. 아래 처럼하면 헤더 길이 부터 나머지를 새롭게 문자열로 가져와요!
			const packet = socket.buffer.slice(totalHeaderLength, length);

			socket.buffer = socket.buffer.slice(length);
			try {
				switch (packetTpye) {
					case PACKET_TYPE.PING:
						{
							const protoMessages = getProtoMessages();
							const Ping = protoMessages.common.Ping;
							const pingMessage = Ping.decode(packet);
							const user = getUserBySocket(socket);
							if (!user) {
								throw new CustomError(
									ErrorCodes.USER_NOT_FOUND,
									"유저를 찾을 수 없습니다!"
								);
							}
							user.handlePong(pingMessage);
						}
						break;
					case PACKET_TYPE.NORMAL:
						const { handlerId, sequence, payload, userId } = packetParser(packet);

						const user = getUserById(userId);
						if (user && user.sequence !== sequence) {
							throw new customError(
								erroCode.INVALID_SEQUENCE,
								"잘못된 호출값입니다!",
								sequence
							);
						}

						const handler = getHandlerById(handlerId);

						await handler({ socket, userId, payload });
				}
			} catch (error) {
				handlerError(socket, error);
			}
		} else {
			//아직 패킷 덜 도착!
			break;
		}
	}
};
