import { gameStartNotification } from "../../utils/notification/gameNotification.js";
import IntervalManager from "../managers/intervalManager.js";

const MAX_PLAYERS = 2;

class Game {
	constructor(id) {
		this.id = id;
		this.users = [];
		this.intervalManager = new IntervalManager();
		this.state = "waiting"; // "waiting" : 기다리는중 "inProgress" : 진행중 상태 설명
	}
	// 유저 배열에 추가!
	addUser(user) {
		if (this.users.length >= MAX_PLAYERS) {
			throw new Error("Game session is full");
		}
		this.users.push(user);

		this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
		if (this.users.length === MAX_PLAYERS) {
			setTimeout(() => {
				this.startGame();
			}, 3000);
		}
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
		let maxLatency = 0;
		this.users.forEach((user) => {
			maxLatency = Math.max(maxLatency, user.latency);
		});
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

	getAllLocation() {
		const maxLatency = this.getMaxLatency();
		const locationData = this.user.map((user) => {
			const { x, y } = user.calculatePosition(maxLatency);
			return { id: user.id, x, y };
		});
		return createLocationPacket(locationData);
	}
}

export default Game;
