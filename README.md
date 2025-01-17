# 🏰 TowerDefense Project

<h3>Project - WebSocket을 활용한 타워 디펜스 게임 서버 구축 </h3>

</br>

이 프로젝트는 Plants vs. Zombies와 같은 타워 디펜스 게임으로, 플레이어가 다양한 타워를 게임 맵에 배치해 몰려오는 적들을 전략적으로 방어하는 게임입니다.<br><br>
서버는 게임 상태와 사용자 데이터를 실시간으로 관리하며, API와 WebSocket을 통해 타워 공격, 쿨다운 계산, 적의 이동 등 주요 게임 메커니즘을 처리하며
클라이언트는 직관적인 인터페이스와 개선된 비주얼로 사용자 경험을 향상시키며, 오브젝트의 이미지를 새롭게 디자인해 몰입감 있는 환경을 제공합니다.<br>

</br>

### TowerDefense Game v1.0

> **TeamName: 불4조, 사**<br> > **1.0v : 2024.12.23 ~ 2025.01.02**</br>

<br>

|                                                   조상우                                                    |
| :---------------------------------------------------------------------------------------------------------: |
| <image width="150px" src="https://github.com/user-attachments/assets/3b1aab86-19e0-4543-a753-dea39b233ca6"> |
|                                     [bakfox](https://github.com/bakfox)                                     |

<br/>

## 📕 시작 가이드

###

<h3>Requirements</h3>
For building and running the application you need:
 
 - Node.js 18.x
 - Npm 9.2.0
 - untiy 2022.3.22f1
 
<h3>Installation</h3>

```
$ git clone https://github.com/bakfox/towerDefense.git
$ cd towerDefense
```

#### Run Method

```
$ npm install
$ node src/app.js
```

---

<br>

## 📖 Stacks

### Environment

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)

### Config

![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

### Development

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=HTML&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white)
![AmazonRDS](https://img.shields.io/badge/AmazonRDS-527FFF?style=for-the-badge&logo=AmazonRDS&logoColor=white)
![AmazonEC2](https://img.shields.io/badge/AmazonEC2-FF9900?style=for-the-badge&logo=AmazonEC2&logoColor=white)

### Communication

![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)

---

</br>

## 📙 담당 파트 및 전반적인 기획

### 담당 파트

- 조상우 - 제작!

## 🕹️ 게임 영상

(https://youtu.be/JwiP7sfFq28)

---

### 클라이언트 코드

[bakfox](https://github.com/bakfox/node7_unity_client)
<br>

<h3>좀비 슈팅 게임</h3>
<details>
## 인 게임

### 서버 기능

1. 이동

   - 클라에서 보내주는 방향에 맞게 서버에서 반복을 돌며 서버에서 위치를 변경해 줌 ( 추측항법 적용! )
   - 게임에 참여한 사용자 중 최대 레이턴시 값을 받아서 계산했다.
   - 변경한 위치를 클라에게 보내준다.

   ```jsx
   	calculatePosition(latency, timestamp) {
   	const distance = this.defaultSpeed * latency;

   	if (this.nextX !== undefined) {
   		this.x = this.nextX;
   	}
   	if (this.nextY !== undefined) {
   		this.y = this.nextY;
   	}

   	this.nextX = this.x + distance * this.lookX;
   	this.nextY = this.y + distance * this.lookY;

   	this.lastUpdateTime = Date.now();

   	return {
   		x: this.nextX,
   		y: this.nextY,
   	};
   }//이동 로직 코드입니다!
   ```

2. 공격

   - 공격 로직은 클라에서 마우스를 클릭하면 실행됩니다!
   - 아래는 총알 풀을 만들 자료 구조형인 큐를 구현한 코드입니다.

   ```jsx
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
   ```

   - 아래는 실질적인 gameClass에서 사용하는 방식 입니다.

   ```jsx
   const shotUpdateHandler = ({ socket, userId, payload }) => {
   	try {
   		const { gameId, z } = payload;
   		const gameSession = getGameSession(gameId);
   		if (!gameSession) {
   			throw new customError(
   				ErrorCodes.GAME_NOT_FOUND,
   				"게임 세션을 찾을 수 없습니다!"
   			);
   		}
   		const user = gameSession.getUser(userId);
   		if (!user) {
   			throw new customError(ErrorCodes.USER_NOT_FOUND, "유저를 찾을 수 없습니다.");
   		}
   		const radians = (z * Math.PI) / 180;

   		const latency = gameSession.getMaxLatency();

   		const distance = latency * user.defaultBullets * 10;

   		const directionX = Math.cos(radians);
   		const directionY = Math.sin(radians);

   		let targetX = user.x + directionX * distance;
   		let targetY = user.y + directionY * distance;

   		const lastVec = { x: targetX, y: targetY };

   		const bullet = gameSession.getBullet();
   		bullet.initialize(
   			user.defaultAtck,
   			z,
   			user.defaultBullets,
   			user.defaultBullets * 10,
   			lastVec,
   			{ x: user.x, y: user.y },
   			user.id
   		);
   		bullet.thisStatuse = 1;

   		gameSession.intervalManager.addBulletUpdate(
   			gameId,
   			gameSession.setAllBullet.bind(gameSession),
   			100
   		);
   	} catch (error) {
   		handlerError(socket, error);
   	}
   };

   export default shotUpdateHandler;
   ```

   - 반복문이 중복으로 들어가는건 intervalManager쪽에서 검증을 해서 막고 있습니다!
   - 실질적인 총알의 이동은 플레이어의 이동과 같은 원리로 이동합니다! ( 추측항법 적용! )

3. 이모티콘
   - 요청 받은 이모티콘의 id와 유저 id를 다시 게임 새션 안에있는 모든 유저에게 보냅니다.

### 클라이언트 기능

1. 이동
   - 서버에서 보내주는 데이터의 위치로 이동한다! ( 보간 적용! )
2. 공격
   - 클릭 시 서버에 요청을 보내서 총알의 위치를 받아온다 ( 보간 적용! )
3. 이모티콘
   - T를 누르고 원하는 이모티콘 쪽으로 가서 클릭하면 그 이모티콘을 사용하고 모두에게 보여줄 수 있다!

### 가장 힘들었던 부분.

- 가장 높은 지연시간 찾아주는 코드입니다!

```jsx
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
```

- 이게 0이 되어 버리면 NaN이 발생해서 모든 이동 로직이 마비가 됩니다!
- 그래서 최소 1 ms 을 기본으로 잡았습니다!
- 이거 찾는데 이틀 정도 걸린거 같습니다!

- 총알의 현재 위치들을 보내주는 packet 입니다!

```jsx
// 유저들중 최고 높은 핑 찾기!
export const createShotPacket = (data) => {
	const protoMessages = getProtoMessages();
	const Emoticon = protoMessages.gameNotification.ShotUpdate;
	const payload = data ? Buffer.from(JSON.stringify({ data })) : null;

	const message = Emoticon.create({ data: payload });
	const bulletPacket = Emoticon.encode(message).finish();
	return makeNotification(bulletPacket, PACKET_TYPE.BULLET_MOVE);
};
```

- 이게 클라에서 받을 때 아직 버퍼 타입이라 디코드를 한번 해줘야 했습니다!
- 그걸 몰라서 한참을 고민하다가 겨우 도움을 받아서 해결했습니다!
- 그리고 클라에서 데이터를 받을 때 data를 그냥 data로 받는 게 아니라 data를 감싸고 있는 객체를 받아서 사용하는지라 저기 data에도 { data }객체로 감싸 쥐어야 했습니다!

- 나머지는 코드를 만든 의도 대로 실행되어서 행복했습니다!
- 이번에 코드를 하면서 이렇게 하면 이렇게 실행할 거라는 확신이 좀 더 생긴 거 같습니다!
- 대부분 문제는 packet이나 payload를 제대로 못 받으면서 생기는 일이 많았습니다!

</br>

<br>
