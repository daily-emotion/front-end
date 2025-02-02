import { useEffect, useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';

import '../../styles/components/calendar/Calendar2.css';
import EmotionIcon from './EmotionIcon';
import CreateDiaryButton from './CreateDiaryButton';

interface CalendarProps {
  onViewDiary: () => void;
  onGoToCreateDiary: () => void;
}

interface DiaryEntry {
  date: string;
  emotion: string;
  image?: string; // 새로운 속성 추가
}

type DiaryData = DiaryEntry[];

// React.FC<CalendarProps>는 이 컴포넌트는 함수형, CalendarProps라는 형태의 props를 사용한다는 뜻
const Calendar: React.FC<CalendarProps> = ({
  onViewDiary,
  onGoToCreateDiary,
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  // 현재 렌더링된 연도와 월 (문자열 타입 필요 시 타입 바꿔야 함)
  const [presentYear, setPresentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [presentMonth, setPresentMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [diaryData, setDiaryData] = useState<DiaryData>([]);

  // 일기 더미 데이터 (라이프사이클 콜백 함수 이용하지 않으면 렌더링 무한루프 발생)
  useEffect(() => {
    setDiaryData([
      { date: '2025-01-02', emotion: '😡' },
      { date: '2025-01-03', emotion: '😁' },
      { date: '2025-01-04', emotion: '😢' },
    ]);
  }, []); // 빈 배열: 최초 렌더링 시 한 번만 실행

  // 해당 연, 월 Full-Calendar로부터 받아오기 =>
  function getPresentYearAndMonth() {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      let presentYearAndMonth = calendarApi.getDate();
      // 추후 문자열로 변환이 필요하면 toString() 함수 이용, 타입 변경 필요
      let newPresentYear: number = presentYearAndMonth.getFullYear();
      // getMonth()는 0부터 값을 반환하기에 +1
      let newPresentMonth: number = presentYearAndMonth.getMonth() + 1;
      setPresentYear(newPresentYear);
      setPresentMonth(newPresentMonth);
    }
  }

  // 해당 월 일기 데이터 받아오기
  const fetchDiaryData = async (presentYear: number, presentMonth: number) => {
    try {
      const res = await axios.get<DiaryData>(
        `${presentYear}, ${presentMonth}로 해당 월 일기 불러오는 API`
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
        events={diaryData.map((entry) => ({
          title: '',
          start: entry.date,
          extendedProps: { emotion: entry.emotion },
        }))}
        eventContent={(eventInfo) => {
          const emotion = eventInfo.event.extendedProps.emotion;
          return (
            <div className="custom-event">
              {emotion ? (
                <EmotionIcon emotion={emotion} onViewDiary={onViewDiary} />
              ) : (
                <CreateDiaryButton onGoToCreateDiary={onGoToCreateDiary} />
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default Calendar;
