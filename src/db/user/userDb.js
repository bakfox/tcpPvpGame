import { v4 as uuidv4 } from "uuid";
import pools from "../database.js";
import { SQL_QUERIES } from "./userQueries.js";
import { toCamelCase } from "../../utils/transformCase.js";

// 미리 만들어둔 커넥션 풀을 통해서 db와 쿼리문으로 소통하는곳!

export const findUserByDeviceID = async (deviceId) => {
	console.log(`${deviceId} 디바이스 아이디입니다.`);
	const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
	return toCamelCase(rows[0]);
};

export const crateUser = async (deviceId) => {
	const id = uuidv4();
	console.log(`${deviceId} 디바이스 아이디입니다.`);
	await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
	return { id, deviceId };
};

export const updateUserLogin = async (id) => {
	console.log(`${id} 유저 아이디입니다.`);
	await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};
