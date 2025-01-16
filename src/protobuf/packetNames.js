export const packetNames = {
	common: {
		Packet: "common.Packet",
		Ping: "common.Ping",
	},
	initial: {
		InitialPacket: "initial.InitialPacket",
	},
	game: {
		CreateGamePayload: "game.CreateGamePayload",
		JoinGamePayload: "game.JoinGamePayload",
		LocationUpdatePayload: "game.LocationUpdatePayload",
		EmoticonPayload: "game.EmoticonPayload",
		RotationUpdatePayload: "game.RotationUpdatePayload",
	},
	response: {
		Response: "response.Response",
	},
	gameNotification: {
		Start: "gameNotification.Start",
		LocationUpdate: "gameNotification.LocationUpdate",
		EmoticonUpdate: "gameNotification.EmoticonUpdate",
		ShotUpdate: "gameNotification.ShotUpdate",
	},
};
