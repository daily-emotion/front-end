import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAccessTokenExpTimeout } from '../services/auth/tokenService';

const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenHash = window.location.hash.substring(1);
    const params = new URLSearchParams(tokenHash);
    console.log(params);

    const accessToken = params.get('token');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('Authorization', `Bearer ${accessToken}`);
      localStorage.setItem('Refresh Token', `Bearer ${refreshToken}`);
      console.log('로그인 성공');

      // 액세스 토큰에 만료시간 전 1분 이내일 때 갱신하는 API 호출하도록
      handleAccessTokenExpTimeout(accessToken);

      navigate('/main');
    } else {
      console.error('No Tokens Received');
    }
  });

  return <div>Login Processing...</div>;
};

export default RedirectHandler;
