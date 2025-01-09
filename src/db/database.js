import mysql from "mysql2/promise";
import { config } from "../config/config.js";
import { formatDate } from "../utils/dateFomatter.js";

const { databases } = config;

// 커넥션 풀링 기술을 통해서 미리 커넥션을 생성해둔다!
const createPool = (dbConfig) => {
	const pool = mysql.createPool({
		host: dbConfig.host,
		port: dbConfig.port,
		user: dbConfig.user,
		password: dbConfig.password,
		database: dbConfig.name,
		waitForConnections: true, //모자르면 기다린다!
		connectionLimit: 10,
		queueLimit: 10, //얼마나 대기시켜줄지
	});

	const originalQuery = pool.query;

	pool.query = (sql, params) => {
		const date = new Date();
		// 쿼리 실행시 로그
		console.log(
			`[${formatDate(date)}] Executing query: ${sql} ${params ? `, ${JSON.stringify(params)}` : ``}`
		);
		return originalQuery.call(pool, sql, params);
	};

	return pool;
};

const pools = {
	GAME_DB: createPool(databases.GAME_DB),
	USER_DB: createPool(databases.USER_DB),
};

export default pools;
