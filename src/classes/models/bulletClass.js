class Bullet {
	constructor(id) {
		this.id = id;
		this.atckDmg = 0;
		this.z = 0;
		this.speed = 5;
		this.range = 0;
		this.nowVec = { x: 0, y: 0 };
		this.lastVec = { x: 0, y: 0 };
		this.userId;
		this.thisStatuse = 2; // 0출발 1 가는중 2 도착
	}
	initialize(
		dmg = 0,
		rotationZ = 0,
		Speed = 0,
		range = 0,
		lastVec = { x: 0, y: 0 },
		ShotVec = { x: 0, y: 0 },
		id
	) {
		this.userId = id;
		this.atckDmg = dmg;
		this.z = rotationZ;
		this.speed = Speed;
		this.range = range;
		this.nowVec = ShotVec;
		this.lastVec = lastVec;
	}

	calculateMove(latency, gameSession) {
		if (this.thisStatuse == 2) {
			return;
		}
		let radian = (this.z * Math.PI) / 180;
		console.log(radian);

		const distance = this.speed * latency;

		let nextX = this.nowVec.x + distance * Math.cos(radian);
		let nextY = this.nowVec.y + distance * Math.sin(radian);

		const distanceTraveled = Math.sqrt(
			Math.pow(nextX - this.lastVec.x, 2) + Math.pow(nextY - this.lastVec.y, 2)
		);
		if (distanceTraveled > this.range) {
			const scale = this.range / distanceTraveled;
			nextX = this.lastVec.x + (nextX - this.lastVec.x) * scale;
			nextY = this.lastVec.y + (nextY - this.lastVec.y) * scale;
			this.thisStatuse = 2;
			gameSession.setBullet(this);
		}

		this.nowVec.x = nextX;
		this.nowVec.y = nextY;

		return { x: nextX, y: nextY };
	}

	hit(x, y) {
		if (x > -1 && x < 1) {
			return true;
		}
		return false;
	}
}
export default Bullet;
