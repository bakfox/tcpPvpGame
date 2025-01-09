import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import protobuf from "protobufjs";
import { packetNames } from "../protobuf/packetNames.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로토파일이 있는 디렉토리 경로 설정
const protoDir = path.join(__dirname, "../protobuf");

const getAllProtoFiles = (dir, fileLsit = []) => {
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			getAllProtoFiles(filePath, fileLsit);
		} else if (path.extname(file) === ".proto") {
			fileLsit.push(filePath);
		}
	});
	return fileLsit;
};
const protoFiles = getAllProtoFiles(protoDir);
// 실제 사용할 메시지들 객체
const protoMessages = {};

export const loadProtos = async () => {
	try {
		const root = new protobuf.Root();
		//비동기 병렬 처리로 프로토 파일 로드!
		await Promise.all(protoFiles.map((file) => root.load(file)));

		for (const [namespace, types] of Object.entries(packetNames)) {
			//초기화만 해줌.
			protoMessages[namespace] = {};
			for (const [type, typeName] of Object.entries(types)) {
				protoMessages[namespace][type] = root.lookupType(typeName);
			}
		}
		console.log("Protobuf 파일이 로드되었습니다.");
	} catch (error) {
		console.error("Protobuf 파일 로드 중 오류가 발생했습니다:", error);
	}
};

export const getProtoMessages = () => {
	return { ...protoMessages };
};
