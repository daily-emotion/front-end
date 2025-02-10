import { useEffect, useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';

import '../../styles/components/calendar/Calendar.css';
import EmotionIcon from './EmotionIcon';
import CreateDiaryButton from './CreateDiaryButton';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

interface CalendarProps {
  onViewDiary: () => void;
  onGoToCreateDiary: () => void;
  accessToken: string | null;
}

type DiaryData = { [key: string]: string }[]; // 배열 안에 여러 객체를 담을 수 있는 형태

// React.FC<CalendarProps>는 이 컴포넌트는 함수형, CalendarProps라는 형태의 props를 사용한다는 뜻
const Calendar: React.FC<CalendarProps> = ({ accessToken }) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [diaryData, setDiaryData] = useState<DiaryData>([{}]);
  const calendarRef = useRef<FullCalendar>(null);
  const calendarApi = calendarRef.current?.getApi();
  const navigate = useNavigate();

  useEffect(() => {
    const currentDate: Date | null = calendarApi?.getDate() ?? null;
    console.log(`currentDate: ${currentDate}`);
    const currentYear: number = currentDate ? currentDate.getFullYear() : 0;
    const currentMonth: number = currentDate ? currentDate.getMonth() + 1 : 0;
    setCurrentDate(currentDate);
    setCurrentYear(currentYear);
    setCurrentMonth(currentMonth);
  }, []);

  const handleGoToCreateDiary = (date: string) => {
    console.log(`받아온 날짜: ${date}`);
    setSelectedDate(date);
    console.log(selectedDate);
    navigate(`/diaries/new/${date}`);
  };

  const handleViewDiary = (date: string) => {
    console.log(`받아온 날짜: ${date}`);
    setSelectedDate(date);
    console.log(`상태 변경된 날짜: ${selectedDate}`);
    navigate(`/diaries/view/${date}`);
  };

  // 일기 더미 데이터 (라이프사이클 콜백 함수 이용하지 않으면 렌더링 무한루프 발생)
  useEffect(() => {
    setDiaryData([
      { emotion: 'ANGER', date: '2025-01-02' },
      { emotion: 'HAPPINESS', date: '2025-01-03' },
      { emotion: 'SAD', date: '2025-01-04' },
    ]);
  }, []); // 빈 배열: 최초 렌더링 시 한 번만 실행

  // 해당 월 일기 데이터 받아오기 (useEffect()로 변경 필요)
  const fetchDiaryData = async (year: number, month: number) => {
    try {
      const res = await axios.get<DiaryData>(
        `http://localhost:5173/diaries/monthly/${currentYear}${String(currentMonth).padStart(2, '0')}`,
        {
          headers: { Authorization: accessToken },
        }
      );
      const newDiaryData: DiaryData = res.data;
      // setDiaryData(newDiaryData);
    } catch (error) {
      console.error(
        '해당 월의 일기 데이터를 불러오는데 실패하였습니다:',
        error
      );
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef} // ref 속성으로 연결
        timeZone="Asia/Seoul"
        plugins={[interactionPlugin, dayGridPlugin]}
        initialView="dayGridMonth"
        selectable={false}
        locale="ko" // 한글 번역 적용
        dayHeaderContent={(info) => {
          // 요일 번역, 글씨 색깔 변경
          const daysInKorean = ['일', '월', '화', '수', '목', '금', '토'];
          const day = info.date.getDay();
          const isSunday = day === 0; // if (day === 0) { isSunday = true; } else { isSunday = false; }
          const isSaturday = day === 6; // if (day === 6) { isSaturday = true; } else { isSaturday = false; }
          const color = isSunday ? 'red' : isSaturday ? 'blue' : 'black';

          return <span style={{ color }}>{daysInKorean[day]}</span>;
        }}
        dayCellContent={(info) => {
          // 날짜 글씨 색깔 변경
          const day = info.date.getDay();
          const isSunday = day === 0;
          const isSaturday = day === 6;
          const color = isSunday ? 'red' : isSaturday ? 'blue' : 'black';

          return (
            <div>
              <span style={{ color }}>
                {
                  info.date.getDate() /* {info.dayNumberText.replace("일", "")} */
                }
              </span>
            </div>
          );
        }}
        dayCellDidMount={(info) => {
          // 셀 안에 있는 날짜 추출
          const date = info.date.toISOString().split('T')[0];
          const matchingEntry = diaryData.find((entry) => entry.date === date);
          console.log('일기 작성된 날짜: ', matchingEntry);
          // info: 특정 dayCell 하나에 대한 정보 전체. info.el은 그 셀 전체를 나타내는 DOM 요소
          const eventContainer = info.el.querySelector(
            '.fc-daygrid-day-events'
          );
          if (eventContainer) {
            const element = document.createElement('div'); // 새로운 컨테이너 생성
            eventContainer.appendChild(element);

            const root = createRoot(element); // createRoot를 사용하여 React 컴포넌트 렌더링
            root.render(
              matchingEntry ? (
                <EmotionIcon
                  date={date}
                  emotion={matchingEntry.emotion}
                  onViewDiary={handleViewDiary}
                />
              ) : (
                <CreateDiaryButton
                  date={date}
                  onGoToCreateDiary={handleGoToCreateDiary}
                />
              )
            );
          }
        }}
      />
    </div>
  );
};

export default Calendar;
