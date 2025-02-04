import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/calendar/Calendar.tsx';
import Header from '../components/common/Header.tsx';
import MonthlyChart from '../components/report/MonthlyChart.tsx';

const MainPage = () => {
  const accessToken: string | null = localStorage.getItem('Authorization');
  const refreshToken = localStorage.getItem('Refresh Token');
  console.log(`Authorization: ${accessToken}`);
  console.log(`Refresh Token: ${refreshToken}`);

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');

  const handleSelectDate = () => {
    // setSelectedDate()
  };

  const handleGoToCreateDiary = () => {
    navigate(`/diaries/new/${selectedDate}`, { state: { selectedDate } });
  };

  const handleViewDiary = () => {
    navigate(`/diaries/view/${selectedDate}`, { state: { selectedDate } });
  };

  return (
    <>
      <Header />
      <div style={{ display: 'flex', gap: '16px' }}>
        <Calendar
          onViewDiary={handleViewDiary}
          onGoToCreateDiary={handleGoToCreateDiary}
          accessToken={accessToken}
        />
        <MonthlyChart />
      </div>
    </>
  );
};

export default MainPage;
