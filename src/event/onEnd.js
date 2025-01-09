import { gameSessions, userSessions } from "../session/sessions.js";
import { removeUser } from "../session/userSession.js";

export const onEnd = (socket) => () => {
	removeUser(socket);
};
