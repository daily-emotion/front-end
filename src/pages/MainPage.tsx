import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/calendar/Calendar.tsx';

const MainPage = () => {
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
      <Calendar
        selectedDate={selectedDate}
        onViewDiary={handleViewDiary}
        onGoToCreateDiary={handleGoToCreateDiary}
      />
      {/* 중간 세로 실선 */}
      <div className="chart-container">{/* 차트 라이브러리 적용 */}</div>
    </div>
  );
};

export default MainPage;
