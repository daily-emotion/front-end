import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/calendar/Calendar.tsx";

const MainPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");

  const handleGoToCreateDiary = () => {
    navigate(`/diary/create/${selectedDate}`);
  };

  const handleViewDiary = async () => {
    navigate(`/diary/view/${selectedDate}`, { state: { selectedDate } });
  };

  return (
    // <Header />
    <div>
      <Calendar />
      {/* 중간 세로 실선 */}
      <div className="chart-container">{/* 차트 라이브러리 적용 */}</div>
    </div>
  );
};

export default MainPage;
