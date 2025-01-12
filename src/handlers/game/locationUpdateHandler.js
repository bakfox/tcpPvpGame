import { INTERVAL_TYPE } from "../../constants/interval.js";
import { getGameSession } from "../../session/gameSession.js";
import { handlerError } from "../../utils/error/errorHandler.js";

const locationUpdateHandler = ({ socket, userId, payload }) => {
	try {
		const { gameId, x, y, timestamp } = payload;
		const gameSession = getGameSession(gameId);
		if (!gameSession) {
			throw new CustomError(ErrorCodes.GAME_NOT_FOUND, "게임 세션을 찾을 수 없습니다!");
		}
		const user = gameSession.getUser(userId);
		if (!user) {
			throw new CustomError(ErrorCodes.USER_NOT_FOUND, "유저를 찾을 수 없습니다.");
		}
		console.log("요청!", timestamp, userId);
		user.updatePosition(x, y);
		if (x === 0 && y === 0) {
			user.isMove = false;
			gameSession.setAllLocation(userId, timestamp);
			gameSession.intervalManager.removeInterval(userId, INTERVAL_TYPE.UPDATE_POSITION);
		} else {
			if (!user.isMove) {
				user.isMove = true;
				gameSession.intervalManager.addUpdatePosition(
					user.id,
					gameSession.setAllLocation.bind(gameSession, userId),
					100
				);
			}
		}
	} catch (error) {
		handlerError(socket, error);
	}
};

export default locationUpdateHandler;
