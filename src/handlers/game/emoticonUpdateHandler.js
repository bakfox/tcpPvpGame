import { getGameSession } from "../../session/gameSession.js";
import customError from "../../utils/error/customError.js";
import { handlerError } from "../../utils/error/errorHandler.js";
import { createEmoticonPacket } from "../../utils/notification/gameNotification.js";
const emoticonUpdateHandler = ({ socket, userId, payload }) => {
	try {
		const { gameId, emoticonId } = payload;
		const gameSession = getGameSession(gameId);
		if (!gameSession) {
			throw new customError(ErrorCodes.GAME_NOT_FOUND, "게임 세션을 찾을 수 없습니다!");
		}
		const user = gameSession.getUser(userId);
		if (!user) {
			throw new customError(ErrorCodes.USER_NOT_FOUND, "유저를 찾을 수 없습니다.");
		}

		const emoticonData = { userId, emoticonId };
		const emoticonPacket = createEmoticonPacket(emoticonData);
		gameSession.users.forEach((user) => {
			if (user.id !== userId) {
				user.socket.write(emoticonPacket);
			}
		});
	} catch (error) {
		handlerError(socket, error);
	}
};

export default emoticonUpdateHandler;
