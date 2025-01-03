import { useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';

import '../../styles/components/calendar/Calendar.css';
import EmotionIcon from './EmotionIcon';
import CreateDiaryButton from './CreateDiaryButton';
import { createRoot } from 'react-dom/client';

interface CalendarProps {
  onViewDiary: () => void;
  onGoToCreateDiary: () => void;
}

interface DiaryEntry {
  date: string;
  emotion: string;
}

type DiaryData = DiaryEntry[];

// React.FC<CalendarProps>는 이 컴포넌트는 함수형, CalendarProps라는 형태의 props를 사용한다는 뜻
const Calendar: React.FC<CalendarProps> = ({ onViewDiary, onGoToCreateDiary}) => {
  const [hasDiaryOnTheDate, setHasDiaryOnTheDate] = useState(false);
  // const [dailyEmotion, setDailyEmotion] = useState('');
  const calendarRef = useRef<FullCalendar>(null);
  
  // 현재 렌더링된 연도와 월 (문자열 타입 필요 시 타입 바꿔야 함)
  const [presentYear, setPresentYear] = useState<number>(new Date().getFullYear());
  const [presentMonth, setPresentMonth] = useState<number>(new Date().getMonth() + 1);
  // const [diaryData, setDiaryData] = useState<DiaryData>([]);
  const monthDates = getMonthDates(presentYear, presentMonth);

  // 일기 더미 데이터
  const diaryData = [
    { date: '2025-01-02', emotion: '😡' },
    { date: '2025-01-03', emotion: '😁' },
    { date: '2025-01-04', emotion: '😢' },
  ];

  // 해당 연, 월 Full-Calendar로부터 받아오기
  function getPresentYearAndMonth () {
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
  };

  // 해당 월 일기 데이터 받아오기
  const fetchDiaryData = async (presentYear: number, presentMonth: number) => {
    try {
      const res = await axios.get<DiaryData>(
        `${presentYear}, ${presentMonth}로 해당 월 일기 불러오는 API`
      );
      const newDiaryData: DiaryData = res.data;
      // setDiaryData(newDiaryData);
    } catch (error) {
      console.error('해당 월의 일기 데이터를 불러오는데 실패하였습니다:', error);
    }
  };

  // 해당 월 날짜 생성
  function getMonthDates (presentYear: number, presentMonth: number) {
    // 해당 연도, 월의 마지막 날짜를 계산
    let daysInMonth = new Date(presentYear, presentMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      `${presentYear}-${String(presentMonth).padStart(0)}-${String(i + 1).padStart(0)}`;
    });
  };

  // 감정 매핑
  // const mapEmotionsOnDates = () => {
  //   let hasDiaryOnDate = find(date) => diaryData.date
  // };

  // 달력 렌더링

  // 한 달 내 일기가 작성된 날짜를 이모티콘으로 표시하는 함수
  const getAllDiariesInMonth = async () => {
    // 날짜와 감정을 받아온다
    // 받아온 날짜와 동일한 날짜를 찾는다
    // 일치하는 날짜의 일기에 반영된 감정을 표시한다
  };

  // 날짜별로 일기 작성 여부 판별 및 감정 불러오는 함수
  const getHasDiary = (diaryData: DiaryData, dateOfMonth: string) => {
    const hasDiary = diaryData.find((data) => data.date === dateOfMonth);
    if (hasDiary) {
      // setHasDiaryOnTheDate(true);
    } else {
      // setHasDiaryOnTheDate(false);
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef} // ref 속성으로 연결
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
