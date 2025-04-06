import fetch from 'node-fetch';

// 유니코드 및 기타 상수

// API 호출 함수
interface ApiResponse {
    CHDOMAIN: string;
    CHATNO: string;
    FTK: string;
    TITLE: string;
    BJID: string;
    CHPT: string;
}

async function getPlayerLive(bno: string, bid: string) {
    try {
        // 사용자 정보 획득
        const response = await fetch(`https://api.example.com/player/${bid}/${bno}`);

        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
        }

        const data = (await response.json()) as ApiResponse;

        // API 응답 구조에 맞게 수정 필요
        return [data.CHDOMAIN, data.CHATNO, data.FTK, data.TITLE, data.BJID, data.CHPT];
    } catch (error) {
        console.error(`API 호출 실패: ${error}`);
        throw error;
    }
}
