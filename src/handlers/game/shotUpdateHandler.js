import { INTERVAL_TYPE } from "../../constants/interval.js";
import { getGameSession } from "../../session/gameSession.js";
import customError from "../../utils/error/customError.js";
import { handlerError } from "../../utils/error/errorHandler.js";

const shotUpdateHandler = ({ socket, userId, payload }) => {
	try {
		const { gameId, z } = payload;
		const gameSession = getGameSession(gameId);
		if (!gameSession) {
			throw new customError(ErrorCodes.GAME_NOT_FOUND, "게임 세션을 찾을 수 없습니다!");
		}
		const user = gameSession.getUser(userId);
		if (!user) {
			throw new customError(ErrorCodes.USER_NOT_FOUND, "유저를 찾을 수 없습니다.");
		}
		const radians = (z * Math.PI) / 180;

		const latency = gameSession.getMaxLatency();

		const distance = latency * user.defaultBullets * 10;

		const directionX = Math.cos(radians);
		const directionY = Math.sin(radians);

		let targetX = user.x + directionX * distance;
		let targetY = user.y + directionY * distance;

		const lastVec = { x: targetX, y: targetY };

		const bullet = gameSession.getBullet();
		bullet.initialize(
			user.defaultAtck,
			z,
			user.defaultBullets,
			user.defaultBullets * 10,
			lastVec,
			{ x: user.x, y: user.y },
			user.id
		);
		bullet.thisStatuse = 1;

		gameSession.intervalManager.addBulletUpdate(
			gameId,
			gameSession.setAllBullet.bind(gameSession),
			100
		);
	} catch (error) {
		handlerError(socket, error);
	}
};

export default shotUpdateHandler;
