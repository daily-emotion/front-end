import Logo from '../../src/assets/images/logo/Daily-Emotion-Logo.png';
import { BASE_URL } from '../configs/apiConfig';
import '../styles/pages/LoginPage.css';

const LoginPage = () => {
  const handleLoginNaver = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/naver`;
    // window.location.href = `https://dailyemotion.site/api/oauth2/authorization/naver`;
  };

  const handleLoginKakao = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/kakao`;
    // window.location.href = `https://dailyemotion.site/api/oauth2/authorization/kakao`;
  };

  const handleLoginGoogle = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
    // window.location.href = `https://dailyemotion.site/api/oauth2/authorization/google`;
  };

  return (
    <div className="container">
      <div
        className="background"
        style={{
          backgroundImage: `url(${Logo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <h3>Login</h3>
      <div className="button-group">
        <button onClick={handleLoginNaver}>N</button>
        <button onClick={handleLoginKakao}>K</button>
        <button onClick={handleLoginGoogle}>G</button>
      </div>
    </div>
  );
};

export default LoginPage;
