import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from "../../constants/handlerId.js";
import { getGameSession } from "../../session/gameSession.js";
import { getUserById } from "../../session/userSession.js";
import customError from "../../utils/error/customError.js";
import { erroCode } from "../../utils/error/errorCodes.js";
import { handlerError } from "../../utils/error/errorHandler.js";
import { createResponse } from "../../utils/response/createResponse.js";

// gameId를 통해서 미라 생성된 게임 새션에 입장이 가능합니다!
const joinGameHandler = ({ socket, userId, payload }) => {
	try {
		const { gameId } = payload;
		const gameSession = getGameSession(gameId);

		if (!gameSession) {
			throw new customError(erroCode.GAME_NOT_FOUND, "게임 세션을 찾을 수 없습니다.");
		}

		const user = getUserById(userId);

		if (!user) {
			throw new CustomError(erroCode.USER_NOT_FOUND, "유저를 찾을 수 없습니다.");
		}

		const existUser = gameSession.getUser(userId);
		if (!existUser) {
			gameSession.addUser(user);
		}

		const joinGameResponse = createResponse(
			HANDLER_IDS.JOIN_GAME,
			RESPONSE_SUCCESS_CODE,
			{ gameId, message: "게임에 참가했습니다!" },
			user.id
		);
		socket.write(joinGameResponse);
	} catch (error) {
		handlerError(socket, error);
	}
};

export default joinGameHandler;
