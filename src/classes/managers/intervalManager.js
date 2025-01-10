import { INTERVAL_TYPE } from "../../constants/interval.js";
import BaseManager from "./baseManager.js";

//각종 반복이 필요할때 추가 관리하는 메니저
class IntervalManager extends BaseManager {
	constructor() {
		super();
		this.intervals = new Map();
	}
	// 이 형식으로 반복을 추가해줌
	addPlayer(playerId, callback, interval, typ = INTERVAL_TYPE.USER) {
		if (!this.intervals.has(playerId)) {
			this.intervals.set(playerId, new Map());
		}
		this.intervals.get(playerId).set(typ, setInterval(callback, interval));
	}

	addGame(gameId, callback, interval) {
		this.addPlayer(gameId, callback, interval, INTERVAL_TYPE.GAME);
	}

	addUpdatePosition(playerId, callback, interval) {
		this.addPlayer(playerId, callback, interval, INTERVAL_TYPE.UPDATE_POSITION);
	}

	// 그 유저 반복 전체 삭제!
	removePlayer(playerId) {
		if (this.intervals.has(playerId)) {
			const userIntervals = this.intervals.get(playerId);
			userIntervals.forEach((id) => {
				clearInterval(id);
			});
			this.intervals.delete(playerId);
		}
	}

	// 특정 반복만 삭제!
	removeInterval(playerId, type) {
		if (this.intervals.has(playerId)) {
			const userIntervals = this.intervals.get(playerId);
			if (userIntervals.has(type)) {
				clearInterval(userIntervals.get(type));
				userIntervals.delete(type);
			}
		}
	}

	// 새션 전부 삭제!
	clearAll() {
		this.intervals.forEach((userIntervals) => {
			userIntervals.forEach((intervalId) => {
				clearInterval(intervalId);
			});
		});
		this.intervals.clear();
	}
}
export default IntervalManager;
