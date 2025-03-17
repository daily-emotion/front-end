import { useEffect, useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';

import '../../styles/components/calendar/Calendar2.css';
import EmotionIcon from './EmotionIcon';
import CreateDiaryButton from './CreateDiaryButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarApi } from '@fullcalendar/core/index.js';
import API, { BASE_URL } from '../../configs/apiConfig';

interface CalendarProps {
  onViewDiary: () => void;
  onGoToCreateDiary: () => void;
  accessToken: string | null;
}

type DiaryData = { [key: string]: string }[]; // 배열 안에 여러 객체를 담을 수 있는 형태

// React.FC<CalendarProps>는 이 컴포넌트는 함수형, CalendarProps라는 형태의 props를 사용한다는 뜻
const Calendar: React.FC<CalendarProps> = ({ accessToken }) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [calendarApi, setCalendarApi] = useState<CalendarApi | null>(null);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  console.log(`currentDate: ${currentDate}`);
  const [currentYear, setCurrentYear] = useState<number>(
    currentDate ? currentDate.getFullYear() : 0
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    currentDate ? currentDate.getMonth() + 1 : 0
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [diaryData, setDiaryData] = useState<DiaryData>([{}]);

  useEffect(() => {
    if (calendarRef.current) {
      setCalendarApi(calendarRef.current.getApi());
    }
  });

  useEffect(() => {
    if (!calendarApi) return;

    const currentDate: Date = calendarApi?.getDate();
    setCurrentDate(currentDate);
    console.log(`currentDate: ${currentDate}`);

    const currentYear: number = currentDate ? currentDate.getFullYear() : 0;
    const currentMonth: number = currentDate ? currentDate.getMonth() + 1 : 0;
    setCurrentYear(currentYear);
    setCurrentMonth(currentMonth);
  }, [calendarApi]);

  // 일기 더미 데이터 (라이프사이클 콜백 함수 이용하지 않으면 렌더링 무한루프 발생)
  useEffect(() => {
    if (!currentDate) return;

    // 해당 월 일기 데이터 받아오기 (useEffect()로 변경 필요)

    const requestYearMonth = `${currentYear}${String(currentMonth).padStart(2, '0')}`;
    console.log('월 일기 데이터 요청 연도, 월: ', requestYearMonth);
    const fetchDiaryData = async () => {
      try {
        const res = await API.get<DiaryData>(
          `/diaries/monthly/${currentYear}${String(currentMonth).padStart(2, '0')}`,
          // `https://dailyemotion.site/api/diaries/monthly/${currentYear}${String(currentMonth).padStart(2, '0')}`,
          {
            headers: { Authorization: accessToken },
          }
        );
        const newDiaryData: DiaryData = res.data;
        console.log(
          `${currentYear}년 ${currentMonth}월의 일기 데이터: ${newDiaryData}`
        );
        setDiaryData(newDiaryData);
      } catch (error) {
        console.error(
          '해당 월의 일기 데이터를 불러오는데 실패하였습니다:',
          error
        );
      }
    };

    fetchDiaryData();

    // setDiaryData([
    //   { emotion: 'ANGER', date: '2025-01-02' },
    //   { emotion: 'HAPPINESS', date: '2025-01-03' },
    //   { emotion: 'SAD', date: '2025-01-04' },
    // ]);
  }, [currentDate]);

  const handleGoToCreateDiary = (date: string) => {
    console.log(`받아온 날짜: ${date}`);
    setSelectedDate(date);
    console.log(`선택된 날짜: ${selectedDate}`);
    navigate(`/diaries/new/${date}`);
  };

  const handleViewDiary = (date: string) => {
    console.log(`받아온 날짜: ${date}`);
    setSelectedDate(date);
    console.log(`선택된 날짜: ${selectedDate}`);
    navigate(`/diaries/view/${date}`);
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
        datesSet={() => {
          if (calendarRef.current) {
            setCalendarApi(calendarRef.current.getApi() as CalendarApi);
          }
        }} // 캘린더가 로드될 때 실행
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
                  info.date.getDate() /* {info.dayNumberText.replace('일', '')} */
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
                <EmotionIcon
                  date={date}
                  emotion={emotion}
                  onViewDiary={handleViewDiary}
                />
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
