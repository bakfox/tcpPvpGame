import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from "../../constants/handlerId.js";
import { crateUser, findUserByDeviceID, updateUserLogin } from "../../db/user/userDb.js";
import { addUser } from "../../session/userSession.js";
import { handlerError } from "../../utils/error/errorHandler.js";
import { createResponse } from "../../utils/response/createResponse.js";

// 접속했을때 처음인지 아닌지를 판단해서 db에 저장하거나 새로 저장해주고 user클래스를 생성해줍니다!
const initalHandler = async ({ socket, userID, payload }) => {
	try {
		const { deviceId } = payload;
		let user = await findUserByDeviceID(deviceId);

		if (!user) {
			user = await crateUser(deviceId);
		} else {
			await updateUserLogin(user.id);
		}

		addUser(socket, user.id);

		const initialResponse = createResponse(
			HANDLER_IDS.INITIAL,
			RESPONSE_SUCCESS_CODE,
			{ userId: user.id },
			deviceId
		);

		socket.write(initialResponse);
	} catch (error) {
		handlerError(socket, error);
	}
};
export default initalHandler;
