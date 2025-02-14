import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../configs/apiConfig';
import '../../styles/common/header.css'
// 로고 이미지
import mainLogo from '../../assets/images/logo/mainLogo.png'

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  const accessToken = localStorage.getItem('Authorization');

  useEffect(() => {
    const fetchUserInfo = () => {
      if (!accessToken) {
        alert('로그인 상태가 아닙니다. 로그인 후 이용해주세요.');
        navigate('/');
      } else {
        axios.get<{ name: string }>(
          `${BASE_URL}/user/profile`,
          // 'https://dailyemotion.site/api/user/profile',
          {
            headers: { Authorization: accessToken },
          }
        )
        // API.get<{ name: string }>(`/user/profile`)
          .then((res) => {
            console.log('사용자 정보 (Header): ', res);
            setUserName(res.data.name);
          })
          .catch((err) => {
            setUserName('Unknown');
            console.log(`사용자 정보 조회 실패: ${err}`);
            alert(`사용자 정보를 불러오지 못했습니다: ${err}`);
            navigate('/');
          });
      }
    };

    fetchUserInfo();
  }, [accessToken, navigate]);

  const NavigateMain = () => {
    navigate('/main');
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleGoToReport = () => {
    navigate('/report');
  };

  return (
    <>
      <div className='commonHeader'>
        <div className='header-logo'>
          <img src={mainLogo} style={{width:"50px"}} onClick={NavigateMain}/>
          <h4 onClick={NavigateMain} style={{cursor:"pointer"}}>Daily-Emotion</h4>
        </div>
        <div>
          <h3>{userName} 님</h3>
        </div>
        <div className='mainMenu'>
          <button onClick={handleLogout} style={{width:"100px", marginRight:"15px"}}>LOGOUT</button>
          <button onClick={handleGoToReport}>REPORT</button>
        </div>
      </div>
    </>
  );
};

export default Header;
