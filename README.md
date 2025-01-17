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

<br>

<h3>좀비 슈팅 게임</h3>
<details>
## 인 게임

### 서버 기능

1. 클라에 요청에 따라

### 클라이언트 기능

1. 이동
   - 서버에서 보내주는 데이터의 위치로 이동한다! ( 보간 적용! )
2. 공격
   - 클릭시 서버에 요청을 보내서 총알의 위치를 받아온다 ( 보간 적용! )
3. 이모티콘
   - T를 누르고 원하는 이모티콘 쪽으로 가서 클릭하면 그 이모티콘을 사용하고 모두에게 보여줄 수 있다!

### 가장 힘들었던 부분.

```jsx
const FPS = 60;
const interval = 1000 / FPS;

//이거 호출해서 루프 시작
function logicLoop() {
	const start = Date.now();
	if (!isRunning) {
		console.log("Logic loop stopped.");
		return; // 루프를 종료
	}
	console.log("Logic executed at:", start);
	// 여기에 실행할 로직 작성

	const elapsed = Date.now() - start;
	setTimeout(() => process.nextTick(logicLoop), Math.max(0, interval - elapsed));
}

logicLoop(); // 루프 시작

// 실행시 루프 종료
const endLoop = () => {
	console.log("Stopping loop...");
	isRunning = false; // 루프 종료 신호
};
```

</br>

<br>

## 🖥️ 와이어 프레임

| 게임 구조 |
| :-------: |

![image](https://github.com/user-attachments/assets/f94fc582-7797-4a48-81af-fc4fbaf80e79)
![image](https://github.com/user-attachments/assets/ac3d3f5e-3241-43ad-9edb-d8f3ee73accd)

## 🕹️ 게임 화면

| 시작 화면 |
| :-------: |

![image](https://github.com/user-attachments/assets/1efa337c-3b08-4b6f-b0eb-afb1cbf19651)

---
