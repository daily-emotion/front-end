import Logo from "../assets/images/Daily-Emotion-Logo.png";
import "../styles/pages/LoginPage.css";

const LoginPage = () => {
  const handleLoginNaver = () => {
    window.location.href = `http://localhost:8080/api/oauth2/authorization/naver`;
  };

  const handleLoginKakao = () => {
    window.location.href = `http://localhost:8080/api/oauth2/authorization/kakao`;  
  };

  const handleLoginGoogle = () => {
    window.location.href = `http://localhost:8080/api/oauth2/authorization/google`;
  };

  return (
    <div className="container">
      <div
        className="background"
        style={{
          backgroundImage: `url(${Logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
