import { gameSessions } from "./sessions.js";
import Game from "../classes/models/gameClass.js";

// 게임 새션 관련입니다!
export const addGameSession = (id) => {
	const session = new Game(id);
	gameSessions.push(session);
	return session;
};

export const removeGameSession = (id) => {
	const index = gameSessions.findIndex((session) => session.id === id);
	if (index !== -1) {
		return gameSessions.splice(index, 1)[0];
	}
};

export const getGameSession = (id) => {
	return gameSessions.find((session) => session.id === id);
};

export const getAllGameSessions = () => {
	return gameSessions;
};
