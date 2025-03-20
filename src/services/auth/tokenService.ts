import axios from 'axios';
import { BASE_URL } from '../../configs/apiConfig';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

// Refresh Token 요청 함수
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/token/refresh`,
      // 'https://dailyemotion.site/api/user/token/refresh',
      {},
      {
        headers: {
          RefreshToken: localStorage.getItem('RefreshToken'),
          Authorization: localStorage.getItem('Authorization'),
        },
      }
    );

    const newAccessToken = response.headers['Authorization']; // 서버에서 반환한 새로운 Access Token 반환
    console.log(`refreshAccessToken() 성공: ${newAccessToken}`);
    alert(`refreshAccessToken() 성공: ${newAccessToken}`);
    return newAccessToken;
  } catch (error) {
    console.error(`refreshAccessToken() 실패: ${error}`);
    alert(`refreshAccessToken() 실패: ${error}`);
    throw error;
  }
};

// 로그인 시 refresh token 이용한 갱신 timeout 설정
export const onLoginSuccess = (accessToken: string): void => {
  localStorage.setItem('Authorization', accessToken);
  const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
  scheduleTokenRefresh(decoded.exp);
};

// 토큰 갱신 시 timeout 재설정
export const onAccessTokenRefreshed = (newAccessToken: string) => {
  localStorage.setItem('Authorization', newAccessToken);
  const decoded: JwtPayload = jwtDecode<JwtPayload>(newAccessToken);
  scheduleTokenRefresh(decoded.exp);
};

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleTokenRefresh = (exp: number): void => {
  if (refreshTimer) clearTimeout(refreshTimer);

  const now = Date.now();
  const expTime = exp * 1000;
  const delay = expTime - now - 60 * 1000;

  if (delay <= 0) {
    refreshAccessToken();
    return;
  }

  refreshTimer = setTimeout(() => {
    refreshAccessToken();
  }, delay);
};
