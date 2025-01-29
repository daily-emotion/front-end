import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const redirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenHash = window.location.hash.substring(1);
    const params = new URLSearchParams(tokenHash);
    console.log(params);

    const accessToken = params.get('token');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('Authorization', `Bearer ${accessToken}`);
      localStorage.setItem('Refresh Token', refreshToken);
      alert('로그인 성공');
      navigate('/main');
    } else {
      console.error('No Tokens Received');
      alert('로그인에 실패하였습니다');
    }
  });

  return <div>Login Processing...</div>;
};

export default redirectHandler;
