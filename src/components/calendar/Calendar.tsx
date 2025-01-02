import { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';

import '../../styles/components/calendar/Calendar.css';
import EmotionIcon from './EmotionIcon';
import CreateDiaryButton from './CreateDiaryButton';
import { createRoot } from 'react-dom/client';

interface CalendarProps {
  selectedDate: string;
  onGoToCreateDiary: () => void;
  onViewDiary: () => void;
}

interface DiaryEntry {
  date: string;
  emotion: string;
}

type DiaryData = DiaryEntry[];

// React.FC<CalendarProps>는 이 컴포넌트는 함수형, CalendarProps라는 형태의 props를 사용한다는 뜻
const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onViewDiary,
  onGoToCreateDiary,
}) => {
  // const [hasDiaryOnTheDate, setHasDiaryOnTheDate] = useState(false);
  const [hasDiaryOnTheDate, setHasDiaryOnTheDate] = useState('');
  const [dailyEmotion, setDailyEmotion] = useState('');

  // 한 달 내 일기가 작성된 날짜를 이모티콘으로 표시하는 함수
  const getAllDiariesInMonth = async () => {
    const res = await axios.get(`한 달 내 일기 쓴 날짜 및 감정 조회하는 API`);
    // const diaryData = res.data;
    const diaryData = [
      { date: '2025-01-02', emotion: 'ANGER' },
      { date: '2025-01-03', emotion: 'JOY' },
      { date: '2025-01-04', emotion: 'SADNESS' },
    ];
    // 날짜와 감정을 받아온다
    // 받아온 날짜와 동일한 날짜를 찾는다
    // 일치하는 날짜의 일기에 반영된 감정을 표시한다
  };

  // 날짜별로 일기 작성 여부 판별 및 감정 불러오는 함수
  const getHasDiary = (diaryData: DiaryData, dateOfMonth: string) => {
    const hasDiary = diaryData.find((data) => data.date === dateOfMonth);
    if (hasDiary) {
      // setHasDiaryOnTheDate(true);
      setDailyEmotion(hasDiary.emotion);
    } else {
      // setHasDiaryOnTheDate(false);
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
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
          // info: 특정 dayCell 하나에 대한 정보 전체. info.el은 그 셀 전체를 나타내는 DOM 요소
          const eventContainer = info.el.querySelector(
            '.fc-daygrid-day-events'
          );

          if (eventContainer) {
            const element = document.createElement('div'); // 새로운 컨테이너 생성
            eventContainer.appendChild(element);

            const root = createRoot(element); // createRoot를 사용하여 React 컴포넌트 렌더링
            root.render(
              hasDiaryOnTheDate ? (
                <EmotionIcon onViewDiary={onViewDiary} />
              ) : (
                <CreateDiaryButton onGoToCreateDiary={onGoToCreateDiary} />
              )
            );
          }
        }}
      />
    </div>
  );
};

export default Calendar;
