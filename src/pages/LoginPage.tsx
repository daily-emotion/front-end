import Logo from "../assets/images/Daily-Emotion-Logo.png";
import "../styles/pages/LoginPage.css";

const LoginPage = () => {
  const handleLoginNaver = () => {};

  const handleLoginKakao = () => {};

  const handleLoginGoogle = () => {};

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
