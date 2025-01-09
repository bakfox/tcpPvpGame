import { removeUser } from "../session/userSession.js";
import { handlerError } from "../utils/error/errorHandler.js";

export const onError = (socket) => (err) => {
	handlerError(socket, new customElements(500, `소켓 오류 발생! ${err}`));

	removeUser(socket);
};
