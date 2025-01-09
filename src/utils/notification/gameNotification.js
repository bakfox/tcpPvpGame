import { config } from "../../config/config.js";
import { PACKET_TYPE } from "../../constants/header.js";
import { getProtoMessages } from "../../init/loadProtos.js";

// message 받은걸 Buffer로 변환해줌!
const makeNotification = (message, type) => {
	const packetLength = Buffer.alloc(config.packet.totalLength);
	packetLength.writeInt32BE(
		message.length + config.packet.totalLength + config.packet.typeLength,
		0
	);

	const packetType = Buffer.alloc(config.packet.typeLength);
	packetType.writeUInt8(type, 0);

	return Buffer.concat([packetLength, packetType, message]);
};

// 여기 아래에 패킷으로 만들것 작성!

export const createPingPacket = (timestamp) => {
	const protoMessages = getProtoMessages();
	const ping = protoMessages.common.Ping;

	const payload = { timestamp };
	const message = ping.create(payload);
	const pingPacket = ping.encode(message).finish();
	return makeNotification(pingPacket, PACKET_TYPE.PING);
};

export const gameStartNotification = (gameId, Start) => {
	const protoMessages = getProtoMessages();
	const Location = protoMessages.gameNotification.ga;

	const payload = { gameId, timestamp };
	const message = Location.create(payload);
	const locationPacket = Location.encode(message).finish();
	return makeNotification(locationPacket, PACKET_TYPE.GAME_START);
};

export const createLocationPacket = (users) => {
	const protoMessages = getProtoMessages();
	const Location = protoMessages.gameNotification.LocationUpdate;

	const payload = { users };
	const message = Location.create(payload);
	const locationPacket = Location.encode(message).finish();
	return makeNotification(locationPacket, PACKET_TYPE.LOCATION);
};
