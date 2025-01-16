import { INTERVAL_TYPE } from "../../constants/interval.js";
import {
	createLocationPacket,
	createShotPacket,
	gameStartNotification,
} from "../../utils/notification/gameNotification.js";
import IntervalManager from "../managers/intervalManager.js";
import Bullet from "./bulletClass.js";
import BulletQueue from "./bulltQueue.js";

export const MAX_PLAYERS = 2;

class Game {
	constructor(id) {
		this.id = id;
		this.users = [];
		this.monster = [];
		this.bullets = new BulletQueue();
		this.useBullets = new Map();
		this.intervalManager = new IntervalManager();
		this.state = "waiting"; // "waiting" : 기다리는중 "inProgress" : 진행중 상태 설명
		this.bulletPool();
	}
	// 유저 배열에 추가!
	addUser(user) {
		if (this.users.length >= MAX_PLAYERS) {
			throw new Error("Game session is full");
		}
		this.users.push(user);

		this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
		if (this.users.length === MAX_PLAYERS * 2) {
			setTimeout(() => {
				this.startGame();
			}, 3000);
		}
	}

	//총알 관련 풀
	bulletPool() {
		for (let i = 0; i < 100; i++) {
			let bullet = new Bullet(i);
			this.bullets.enqueue(bullet);
		}
	}
	getBullet() {
		const bullet = this.bullets.dequeue();
		this.useBullets.set(bullet.id, bullet);
		return bullet;
	}
	setBullet(bullet) {
		this.useBullets.delete(bullet.id);
		this.bullets.enqueue(bullet);
		console.log(this.useBullets);
	}

	// 유저 클래스 받아오기!
	getUser(userId) {
		return this.users.find((user) => user.id === userId);
	}

	// 유저 클래스 있는 배열 삭제!
	removeUser(userId) {
		this.users = this.users.filter((user) => user.id !== userId);
		this.intervalManager.removePlayer(userId);

		if (this.users.length < MAX_PLAYERS) {
			this.state = "waiting";
		}
	}

	// 유저들중 최고 높은 핑 찾기!
	getMaxLatency() {
		let maxLatency = 1;
		this.users.forEach((user) => {
			maxLatency = Math.max(maxLatency, user.latency);
		});
		if (isNaN(maxLatency)) {
			maxLatency = 1;
		}
		return maxLatency;
	}

	// 게임 시작 ! 현재 조건은 2명 모이면 몇초후 시작
	startGame() {
		this.state = "inProgress";
		const startPacket = gameStartNotification(this.id, Date.now());
		console.log(this.getMaxLatency());

		this.users.forEach((user) => {
			user.socket.write(startPacket);
		});
	}

	// 호출시 모두에게 보내주기
	setAllLocation(userId, timestamp = 0) {
		const maxLatency = this.getMaxLatency();
		const user = this.getUser(userId);
		const { x, y } = user.calculatePosition(maxLatency, timestamp); // 다음 움직임 위치
		const locationData = { id: user.id, x, y, lockX: user.lockX, lockY: user.lockY };
		const locationPacket = createLocationPacket(locationData);
		this.users.forEach((data) => {
			data.socket.write(locationPacket);
		});
	}

	// 모두한테 현재 총알들 위치 알려주기
	setAllBullet() {
		if (this.useBullets.size === 0) {
			this.intervalManager.removeInterval(this.id, INTERVAL_TYPE.BULLET_POSITION);
			console.log(this.useBullets.size, "없어요 ㅠ", this.id);
			return;
		}

		const maxLatency = this.getMaxLatency();
		const dataArray = [];

		this.useBullets.forEach((value, key) => {
			const { x, y } = value.calculateMove(maxLatency, this);

			dataArray.push({
				userId: value.userId,
				bulletId: value.id,
				x,
				y,
				z: value.z,
				status: value.thisStatuse,
			});

			if (value.thisStatuse == 2) {
				this.useBullets.delete(value.id);
			}
		});
		const shotPacket = createShotPacket(dataArray);
		this.users.forEach((data) => {
			data.socket.write(shotPacket);
		});
	}
}

export default Game;
