import axios from 'axios';
import { refreshAccessToken } from '../services/auth/tokenService';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'https://dailyemotion.site/api',
  withCredentials: true, // 쿠키 전송을 위해 필요 (옵션)
});

// Axios 요청 인터셉터 설정 (모든 요청에 Access Token 자동 추가)
api.interceptors.request.use(
  // use()는 인터셉터를 추가하는 메서드
  (config) => {
    // 요청이 서버로 전송되기 전에 실행되는 함수
    const accessToken = localStorage.getItem('Authorization');
    if (accessToken) {
      config.headers = config.headers || {}; // 초기화를 통해 config.headers가 빈 값일 때 발생하는 오류를 미리 예방
      config.headers.Authorization = accessToken;
    }
    return config; // 수정된 요청 설정을 반환하여 요청 진행
  },
  (error) => Promise.reject(error) // 요청을 보내기 전에 에러가 발생하면 그대로 상위 호출자에 반환, 비동기 코드에서 필요
);

// Axios 응답 인터셉터
api.interceptors.response.use(
  (response) => response, // 정상 응답일 경우 그대로 반환
  async (error) => {
    // 에러가 발생한 경우 실행됨
    const originalRequest = error.config; // 실패한 요청 정보를 저장

    // Access Token이 만료되어 401 에러가 발생한 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry // 응답 인터셉터에서 새로 추가한 속성으로, 재시도 여부를 저장하는 플래그
    ) {
      originalRequest._retry = true; // 중복 요청 방지

      try {
        const newAccessToken = await refreshAccessToken();
        localStorage.setItem('Authorization', newAccessToken);
        originalRequest.headers.Authorization = newAccessToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error(`Access Token 갱신 실패: ${refreshError}`); // Refresh Token 만료 시
        localStorage.clear(); // 로그아웃 처리 기능 (기존 토큰 모두 제거)
        window.location.href = '/'; // 로그인 페이지로 이동
        return Promise.reject(refreshError); // 요청을 보내기 전에 에러가 발생하면 그대로 상위 호출자에 반환, 비동기 코드에서 필요
      }
    }

    // Access Token이 만료에 의한 401 에러를 제외한 다른 에러 반환
    return Promise.reject(error);
  }
);

export default api;
