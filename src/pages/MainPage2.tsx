import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar2 from '../components/calendar/Calendar2.tsx';
import Header from '../components/common/Header.tsx';
import MonthlyChart from '../components/report/MonthlyChart.tsx';

const MainPage2 = () => {
  const accessToken = localStorage.getItem('Authorization');
  const refreshToken = localStorage.getItem('Refresh Token');
  console.log(`Authorization: ${accessToken}`);
  console.log(`Refresh Token: ${refreshToken}`);

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
    <>
      <Header />
      <div style={{ display: 'flex', gap: '16px' }}>
        <Calendar2
          onViewDiary={handleViewDiary}
          onGoToCreateDiary={handleGoToCreateDiary}
        />
        {/* 중간 세로 실선 */}
        <MonthlyChart />
      </div>
    </>
  );
};

export default MainPage2;
