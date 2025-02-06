import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        axios
          .get<{ name: string }>('http://localhost:8080/api/user/profile', {
            headers: { Authorization: accessToken },
          })
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

  return (
    <>
      <div>LOGO</div>
      <div>{userName}</div>
    </>
  );
};

export default Header;
