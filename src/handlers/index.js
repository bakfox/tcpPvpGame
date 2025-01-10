import { HANDLER_IDS } from "../constants/handlerId.js";
import customError from "../utils/error/customError.js";
import { erroCode } from "../utils/error/errorCodes.js";
import createGameHandler from "./game/createGameHandler.js";
import joinGameHandler from "./game/joinGameHandler.js";
import locationUpdateHandler from "./game/locationUpdateHandler.js";
import initalHandler from "./user/initialHandler.js";

// 핸들러 아이디 맵핑입니다!
const handlers = {
	[HANDLER_IDS.INITIAL]: {
		handler: initalHandler,
		protoType: "initial.InitialPacket",
	},
	[HANDLER_IDS.CREATE_GAME]: {
		handler: createGameHandler,
		protoType: "game.CreateGamePayload",
	},
	[HANDLER_IDS.JOIN_GAME]: {
		handler: joinGameHandler,
		protoType: "game.JoinGamePayload",
	},
	[HANDLER_IDS.LOCATION_UPDATE]: {
		handler: locationUpdateHandler,
		protoType: "game.LocationUpdatePayload",
	},
};

// 위의 핸들러를 맵핑해서 함수를 찾아옵니다!
export const getHandlerById = (handlerId) => {
	if (!handlers[handlerId]) {
		throw new customError(erroCode.UNKNOWN_HANDLER_ID, "핸들러를 찾을 수 없습니다!");
	}
	return handlers[handlerId].handler;
};

// 위의 핸들러를 맵핑해서 프로토타입을 찾아옵니다!
export const getProtoTypeNameByHandlerID = (handlerId) => {
	if (!handlers[handlerId]) {
		throw new customError(erroCode.UNKNOWN_HANDLER_ID, "프로토타입을 찾을 수 없습니다!");
	}
	return handlers[handlerId].protoType;
};
