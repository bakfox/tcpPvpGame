import { createPingPacket } from "../../utils/notification/gameNotification.js";

class User {
	constructor(id, socket) {
		this.id = id;
		this.socket = socket;
		this.x = 0;
		this.y = 0;
		this.sequence = 0;
		this.lastUpdateTime = Date.now();
		this.latency;
	}
	// 위치 동기화!
	updatePosition(x, y) {
		this.x = x;
		this.y = y;
		this.lastUpdateTime = Date.now();
	}
	// 서로 주고 받을때 증가해서 확인하는 역할!
	getNextSequence() {
		return ++this.sequence;
	}

	//거리 계산 x만
	calculatePosition(latency) {
		const timeDiff = latency / 1000;
		const spead = 1;
		const distance = spead * timeDiff;

		return {
			x: this.x + distance,
			y: this.y,
		};
	}

	// 핑 보내기
	ping() {
		const now = Date.now();

		console.log(`${this.id}: ping`);
		this.socket.write(createPingPacket(now));
	}
	// 핑 받기
	handlePong(data) {
		const now = Date.now();
		this.latency = (now - data.timestamp) / 2; //나누기 2 하는 이유는 왕복이라 그렇다!
		console.log(this.latency, "ms");
	}
}

export default User;
