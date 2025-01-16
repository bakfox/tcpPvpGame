class BulletQueue {
	constructor() {
		this.queue = [];
	}

	enqueue(bullet) {
		this.queue.push(bullet);
	}

	dequeue() {
		if (this.isEmpty()) {
			return null;
		}
		return this.queue.shift();
	}

	isEmpty() {
		return this.queue.length === 0;
	}

	size() {
		return this.queue.length;
	}

	peek() {
		if (this.isEmpty()) {
			return null;
		}
		return this.queue[0];
	}
}
export default BulletQueue;
