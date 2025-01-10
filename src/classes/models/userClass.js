import { createPingPacket } from "../../utils/notification/gameNotification.js";

class User {
	constructor(id, socket) {
		this.id = id;
		this.socket = socket;

		this.level = 1;
		this.exp = 0;
		this.expMax = 10;
		this.defaultSpead = 1;
		this.defaultAtck = 1;
		this.defaultHp = 10;

		this.upgradeAtck = 0;
		this.upgradeHp = 0;

		this.x = 0;
		this.y = 0;
		this.nextX = 0;
		this.nextY = 0;
		this.lookX = 0;
		this.lookY = 0;

		this.sequence = 0;
		this.lastUpdateTime = Date.now();
		this.latency;
	}

	// 방향 동기화!
	updatePosition(x, y) {
		this.lookX = x;
		this.lookY = y;

		this.lastUpdateTime = Date.now();
	}

	// 서로 주고 받을때 증가해서 확인하는 역할!
	getNextSequence() {
		return ++this.sequence;
	}

	// 다음 도착 목표 위치 계산
	calculatePosition(latency) {
		const timeDiff = latency / 1000;
		const spead = 1;
		const distance = spead * timeDiff;

		if (this.nextX !== 0) {
			this.x = this.nextX;
		}
		if (this.nextY !== 0) {
			this.y = this.nextY;
		}

		this.nextX = this.x + distance * lookX;
		this.nextY = this.y + distance * lookY;

		this.lastUpdateTime = Date.now();

		return {
			x: this.nextX,
			y: this.nextY,
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
