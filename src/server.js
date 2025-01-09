import net from "net";
import { config } from "./config/config.js";
import { onConnection } from "./event/onConnection.js";
import initSerever from "./init/index.js";
import { error } from "console";

const server = net.createServer(onConnection);

initSerever()
	.then(() => {
		server.listen(config.server.port, config.server.host, () => {
			console.log("서버 실행중입니다!");
		});
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
