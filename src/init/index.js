import pools from "../db/database.js";
import { testAllConnections } from "../utils/db/testConnection.js";
import { loadProtos } from "./loadProtos.js";

// 처음 데이터 받아오기 용도.
const initSerever = async () => {
	try {
		await loadProtos();
		//await testAllConnections(pools); 테스트 용도임
	} catch (error) {
		console.error(e);
	}
};

export default initSerever;
