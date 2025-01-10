import { userSessions } from "./sessions.js";
import User from "../classes/models/userClass.js";

// 유저 관련입니다!
export const addUser = (socket, id) => {
	const user = new User(id, socket);
	userSessions.push(user);
	return user;
};

export const getNextSequence = (id) => {
	const user = getUserById(id);
	if (user) {
		return user.getNextSequence();
	}
	return null;
};

export const removeUser = (socket) => {
	const index = userSessions.findIndex((user) => user.socket === socket);
	if (index !== -1) {
		return userSessions.splice(index, 1)[0];
	}
};

export const getUserById = (id) => {
	return userSessions.find((user) => user.id === id);
};
export const getUserBySocket = (socket) => {
	return userSessions.find((user) => user.socket === socket);
};
