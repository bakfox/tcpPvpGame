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

export const createLocationPacket = (data) => {
	const protoMessages = getProtoMessages();
	const Location = protoMessages.gameNotification.LocationUpdate;

	const payload = { id: data.id, x: data.x, y: data.y };
	const message = Location.create(payload);
	const locationPacket = Location.encode(message).finish();
	return makeNotification(locationPacket, PACKET_TYPE.LOCATION);
};

export const createEmoticonPacket = (data) => {
	const protoMessages = getProtoMessages();
	const Emoticon = protoMessages.gameNotification.EmoticonUpdate;

	const payload = { userId: data.userId, emoticonId: data.emoticonId };
	const message = Emoticon.create(payload);
	const locationPacket = Emoticon.encode(message).finish();
	return makeNotification(locationPacket, PACKET_TYPE.EMOTICON);
};

export const createShotPacket = (data) => {
	const protoMessages = getProtoMessages();
	const Emoticon = protoMessages.gameNotification.ShotUpdate;
	const payload = data ? Buffer.from(JSON.stringify({ data })) : null;

	const message = Emoticon.create({ data: payload });
	const bulletPacket = Emoticon.encode(message).finish();
	return makeNotification(bulletPacket, PACKET_TYPE.BULLET_MOVE);
};
