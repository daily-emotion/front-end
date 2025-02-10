import axios from 'axios';

// Refresh Token 요청 함수
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/user/token/refresh',
      // 'https://dailyemotion.site/api/user/token/refresh',
      {},
      {
        headers: {
          RefreshToken: localStorage.getItem('Refresh Token'),
          Authorization: localStorage.getItem('Authorization'),
        },
      }
    );

    const newAccessToken = response.headers['Authorization']; // 서버에서 반환한 새로운 Access Token 반환
    console.log(`refreshAccessToken() 성공: ${newAccessToken}`);
    return newAccessToken;
  } catch (error) {
    console.error(`refreshAccessToken() 실패: ${error}`);
    throw error;
  }
};
