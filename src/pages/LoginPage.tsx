import Logo from '../../src/assets/images/logo/mainLogo.png';
import { BASE_URL } from '../configs/apiConfig';
import '../styles/pages/LoginPage.css';
import NaverLoginLogo from '../../src/assets/images/LoginPage/LoginButton_NaverLogo.png';
import KakaoLoginLogo from '../../src/assets/images/LoginPage/LoginButton_KakaoLogo.png';
import GoogleLoginLogo from '../../src/assets/images/LoginPage/LoginButton_GoogleLogo.png';
import SubContainerBackground from '../../src/assets/images/LoginPage/LoginPage_SubContainer.png';

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
        className="sub_container"
        style={{
          backgroundImage: `url(${SubContainerBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '500px',
          height: '550px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', // 가로 방향으로 자식 요소들을 중앙에 배치
          textAlign: 'center',
        }}
      >
        <div
          className="logo_container"
          style={{
            backgroundColor: '#F6CA8D',
            borderRadius: '50%',
            width: '150px',
            height: '150px',
            display: 'flex', // flexbox 레이아웃을 사용하여 자식 요소(이미지)를 배치
            justifyContent: 'center', // 가로 방향으로 자식 요소를 중앙에 배치
            alignItems: 'center', // 세로 방향으로 자식 요소를 중앙에 배치
          }}
        >
          <img src={Logo} width="auto" height="120px" />
        </div>
        <h1>Login</h1>
        <h3>
          Daily-Emotion과 함께 <br />
          나만의 감정을 기록해보세요!
        </h3>
        <div className="button-group">
          <button className="login-button" onClick={handleLoginNaver}>
            <img
              src={NaverLoginLogo}
              style={{
                width: '55px',
                height: 'auto',
                border: 'none', // 버튼 테두리 제거
                cursor: 'pointer',
              }}
            />
          </button>
          <button className="login-button" onClick={handleLoginKakao}>
            <img
              src={KakaoLoginLogo}
              style={{
                width: '55px',
                height: 'auto',
                border: 'none', // 버튼 테두리 제거
                cursor: 'pointer',
              }}
            />
          </button>
          <button className="login-button" onClick={handleLoginGoogle}>
            <img
              src={GoogleLoginLogo}
              style={{
                width: '65px',
                height: 'auto',
                border: 'none', // 버튼 테두리 제거
                cursor: 'pointer',
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
