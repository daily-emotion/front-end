import API from '../../configs/apiConfig';

export const API_SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:8080/api';

const accessToken = localStorage.getItem('Authorization');

export const authService = () => {
  // 프로필 조회
  fetchUserInfo: async () => {
    try {
      // const res = await axios.get<{ name: string }>(
      //   `${API_SERVER_URL}/user/profile`,
      //   {
      //     headers: { Authorization: accessToken },
      //   }
      // );

      const res = await API.get<{ name: string }>(`/user/profile`);

      console.log('사용자 정보 (Header): ', res.data);
      return res.data.name;
    } catch (err) {
      alert(`사용자 정보를 불러오지 못했습니다: ${err}`);
    }
  };
};

// const fetchUserInfo = () => {
//   if (!accessToken) {
//     alert('로그인 상태가 아닙니다. 로그인 후 이용해주세요.');
//     navigate('/');
//   } else {
//     axios
//       .get<{ name: string }>('http://localhost:8080/api/user/profile', {
//         headers: { Authorization: accessToken },
//       })
//       .then((res) => {
//         console.log('사용자 정보 (Header): ', res);
//         setUserName(res.data.name);
//       })
//       .catch((err) => {
//         setUserName('Unknown');
//         console.log(`사용자 정보 조회 실패: ${err}`);
//         alert(`사용자 정보를 불러오지 못했습니다: ${err}`);
//         navigate('/');
//       });
//   }
// };
