import axios from 'axios';
import { BASE_URL } from '../../configs/apiConfig';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}
// Refresh Token 요청 함수
export const refreshAccessToken = async () => {
  try {
    const refreshTokenNoBearer = localStorage
      .getItem('Refresh Token')
      ?.split(' ')[1];
    console.log(refreshTokenNoBearer);
    const response = await axios.post(
      `${BASE_URL}/user/token/refresh`,
      {},
      {
        headers: {
          RefreshToken: refreshTokenNoBearer,
        },
      }
    );

    const newAccessToken = response.headers['authorization']; // 서버에서 반환한 새로운 Access Token 반환
    console.log(`refreshAccessToken() 성공: ${newAccessToken}`);
    alert(`refreshAccessToken() 성공: ${newAccessToken}`);

    // 액세스 토큰에 만료시간 전 5분일 때 갱신하는 API 호출하도록
    handleAccessTokenExpTimeout(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error(`refreshAccessToken() 실패: ${error}`);
    alert(`refreshAccessToken() 실패: ${error}`);
    handleAccessTokenExpTimeout(localStorage.getItem('Authorization')!);
    throw error;
  }
};

// 토큰 갱신 시 timeout 재설정
export const handleAccessTokenExpTimeout = (accessToken: string) => {
  const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
  scheduleAccessTokenRefresh(decoded.exp);
};

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleAccessTokenRefresh = (exp: number): void => {
  try {
    if (refreshTimer) clearTimeout(refreshTimer);

    const now = Date.now();
    const expTime = exp * 1000;
    console.log(`현재 시간: ${now} (${new Date(now).toLocaleString()})`);
    console.log(
      `토큰 만료 시간: ${expTime} (${new Date(expTime).toLocaleString()})`
    );
    const delay = expTime - now - 5 * 60 * 1000;

    // if (delay <= 0) {
    //   refreshAccessToken();
    //   return;
    // }

    // refreshTimer = setTimeout(() => {
    //   refreshAccessToken();
    // }, delay);

    console.log(`토큰 갱신 타이머가 설정되었습니다: ${delay / (60 * 1000)} 후`);
    // alert(`토큰 갱신 타이머가 설정되었습니다: ${delay / (60 * 1000)}분 후`);
  } catch (error) {
    console.error(`토큰 갱신 타이머가 설정되지 않았습니다: ${error}`);
    // alert(`토큰 갱신 타이머가 설정되지 않았습니다: ${error}`);
  }
};
