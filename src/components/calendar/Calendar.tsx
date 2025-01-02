import { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';

import '../../styles/components/calendar/Calendar.css';
import EmotionIcon from './EmotionIcon';
import CreateDiaryButton from './CreateDiaryButton';
import { createRoot } from 'react-dom/client';

const Calendar = () => {
  const isDiary = false;
  // const [isDiary, setIsDiary] = useState(false);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[interactionPlugin, dayGridPlugin]}
        initialView="dayGridMonth"
        selectable={true}
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
              <div
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '66%', // 셀 높이의 2/3 크기
                  cursor: 'pointer',
                }}
              ></div>
            </div>
          );
        }}
        dayCellDidMount={(info) => {
          const eventContainer = info.el.querySelector(
            '.fc-daygrid-day-events'
          );

          if (eventContainer) {
            const element = document.createElement('div'); // 새로운 컨테이너 생성
            eventContainer.appendChild(element);

            const root = createRoot(element); // createRoot를 사용하여 React 컴포넌트 렌더링
            root.render(isDiary ? <EmotionIcon /> : <CreateDiaryButton />);
          }
        }}
      />
    </div>
  );
};

export default Calendar;
