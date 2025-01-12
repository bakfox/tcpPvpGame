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
		this.isMove = false;

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
		++this.sequence;
		console.log(this.sequence);
		return this.sequence;
	}

	// 다음 도착 목표 위치 계산
	calculatePosition(latency, timestamp) {
		const timeDiff = latency / 1000;
		const spead = 1;
		const distance = spead * timeDiff;
		console.log("움직임 호출중", this.lookX, timestamp);
		if (timestamp !== 0) {
			console.log(timestamp);
		}
		if (this.nextX !== 0) {
			this.x = this.nextX;
		}
		if (this.nextY !== 0) {
			this.y = this.nextY;
		}

		this.nextX = this.x + distance * this.lookX;
		this.nextY = this.y + distance * this.lookY;

		this.lastUpdateTime = Date.now();

		return {
			x: this.nextX,
			y: this.nextY,
		};
	}

	// 핑 보내기
	ping() {
		const now = Date.now();
		this.socket.write(createPingPacket(now));
	}

	// 핑 받기
	handlePong(data) {
		const now = Date.now() / 1000;
		const pongTime = data.timestamp.high * Math.pow(2, 32) + data.timestamp.low;
		this.latency = (now - pongTime) / 2;
	}
}

export default User;
