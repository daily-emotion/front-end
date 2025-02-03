import { useEffect, useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';

import '../../styles/components/calendar/Calendar2.css';
import EmotionIcon from './EmotionIcon';
import CreateDiaryButton from './CreateDiaryButton';
import { useNavigate } from 'react-router-dom';

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
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [diaryData, setDiaryData] = useState<DiaryData>([]);
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

  // 현재 렌더링된 연도와 월 (문자열 타입 필요 시 타입 바꿔야 함)
  const [presentYear, setPresentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [presentMonth, setPresentMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  // 일기 더미 데이터 (라이프사이클 콜백 함수 이용하지 않으면 렌더링 무한루프 발생)
  useEffect(() => {
    setDiaryData([
      { date: '2025-01-02', emotion: '😡' },
      { date: '2025-01-03', emotion: '😁' },
      { date: '2025-01-04', emotion: '😢' },
    ]);
  }, []); // 빈 배열: 최초 렌더링 시 한 번만 실행

  // 해당 월 일기 데이터 받아오기
  const fetchDiaryData = async (year: number, month: number) => {
    try {
      const res = await axios.get<DiaryData>(
        `${currentYear}, ${currentMonth}로 해당 월 일기 불러오는 API`
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

  const handleGoToCreateDiary = (date: string) => {
    console.log(date);
    setSelectedDate(date);
    navigate(`/diary/create/${selectedDate}`);
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
          const date = eventInfo.event.startStr; // 이벤트의 시작 날짜
          return (
            <div className="custom-event">
              {emotion ? (
                <EmotionIcon emotion={emotion} onViewDiary={onViewDiary} />
              ) : (
                <CreateDiaryButton
                  date={date}
                  onGoToCreateDiary={handleGoToCreateDiary}
                />
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default Calendar;
