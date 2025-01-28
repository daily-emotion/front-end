import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar2 from '../components/calendar/Calendar2.tsx';

const MainPage = () => {

  useEffect(() => {
    const tokenHash = window.location.hash.substring(1);
    const params = new URLSearchParams(tokenHash);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem("Authorization", `Bearer ${accessToken}`);
      localStorage.setItem("Refresh Token", refreshToken);
    } else {
      console.error("No Tokens Received");
    }
  });

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');

  const handleSelectDate = () => {
    // setSelectedDate()
  };

  const handleGoToCreateDiary = () => {
    navigate(`/diary/create/${selectedDate}`, { state: { selectedDate } });
  };

  const handleViewDiary = () => {
    navigate(`/diary/view/${selectedDate}`, { state: { selectedDate } });
  };

  return (
    // <Header />
    <div>
      <Calendar2
        onViewDiary={handleViewDiary}
        onGoToCreateDiary={handleGoToCreateDiary}
      />
      {/* 중간 세로 실선 */}
      <div className="chart-container">{/* 차트 라이브러리 적용 */}</div>
    </div>
  );
};

export default MainPage;
