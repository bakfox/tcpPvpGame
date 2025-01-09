import { createResponse } from "../response/createResponse.js";
import { erroCode } from "./errorCodes.js";

export const handlerError = (socket, error) => {
	let responseCode;
	let message;
	console.error(error);

	if (error.code) {
		responseCode = error.code;
		message = error.message;
	} else {
		responseCode = erroCode.SOCKET_ERROR;
		message = error.message;
	}

	const errorResponse = createResponse(-1, responseCode, { message }, null);
	socket.write(errorResponse);
};
