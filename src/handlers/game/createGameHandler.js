import { v4 as uuidv4 } from "uuid";
import { addGameSession } from "../../session/gameSession.js";
import { getUserById } from "../../session/userSession.js";
import customError from "../../utils/error/customError.js";
import { erroCode } from "../../utils/error/errorCodes.js";
import { createResponse } from "../../utils/response/createResponse.js";
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from "../../constants/handlerId.js";
import { handlerError } from "../../utils/error/errorHandler.js";
import { MAX_PLAYERS } from "../../classes/models/gameClass.js";

// 게임 새션 만들기 입니다! 다른 유저는 gameId를 통해서 입장 가능!
const createGameHandler = ({ socket, userId, payload }) => {
	try {
		const gameId = uuidv4();
		const gameSession = addGameSession(gameId);

		const user = getUserById(userId);
		if (!user) {
			throw new customError(erroCode.USER_NOT_FOUND, "유저를 찾을 수 없습니다.");
		}

		gameSession.addUser(user);

		const userData = {
			id: user.id,
			level: user.level,
			exp: user.exp,
			expMax: user.expMax,
			x: user.x,
			y: user.y,
			defaultBullet: user.defaultBullets,
			defaultSpead: user.defaultAtck,
			defaultAtck: user.defaultAtck,
			defaultHp: user.defaultHp,
			upgradeAtck: user.upgradeAtck,
			upgradeHp: user.upgradeHp,
		};

		const createGameResponse = createResponse(
			HANDLER_IDS.CREATE_GAME,
			RESPONSE_SUCCESS_CODE,
			{ gameId, maxPlayer: MAX_PLAYERS, users: [userData] },
			userId
		);

		socket.write(createGameResponse);
	} catch (error) {
		handlerError(socket, error);
	}
};

export default createGameHandler;
