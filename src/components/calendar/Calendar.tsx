import { useEffect, useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';

import '../../styles/components/calendar/Calendar.css';
import EmotionIcon from './EmotionIcon';
import CreateDiaryButton from './CreateDiaryButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarApi } from '@fullcalendar/core/index.js';
import { useCalendarStore } from '../../stores/useCalendarStore';
import { BASE_URL } from '../../configs/apiConfig';

interface CalendarProps {
  onViewDiary: () => void;
  onGoToCreateDiary: () => void;
  accessToken: string | null;
}

type DiaryData = { [key: string]: string }[]; // 배열 안에 여러 객체를 담을 수 있는 형태

// React.FC<CalendarProps>는 이 컴포넌트는 함수형, CalendarProps라는 형태의 props를 사용한다는 뜻
const Calendar: React.FC<CalendarProps> = ({ accessToken }) => {
  const { setCalendarRef, setCalendarApi } = useCalendarStore();
  const calendarRef = useRef<FullCalendar>(null);
  const [calendarApi, setCalendarApiLocal] = useState<CalendarApi | null>(null);
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
      const ref = calendarRef;
      const api = calendarRef.current.getApi();
      console.log('api 설정값: ', api);
      setCalendarRef(ref); // 전역 상태 저장
      setCalendarApi(api); // 전역 상태 저장
      setCalendarApiLocal(api); // 로컬 상태 저장 (필요할 경우)
    }
  }, [calendarRef.current]);

  useEffect(() => {
    if (!calendarApi) return;

    const date = calendarApi.getDate();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const fetchDiaryData = async () => {
      try {
        const res = await axios.get<DiaryData>(
          `${BASE_URL}/diaries/monthly/${year}${String(month).padStart(2, '0')}`,
          { headers: { Authorization: accessToken } }
        );
        // const res = await API.get<DiaryData>(
        //   `/diaries/monthly/${year}${String(month).padStart(2, '0')}`
        // );
        setDiaryData(res.data); // 데이터를 가져오자마자 diaryData 업데이트
      } catch (error) {
        console.error(
          '해당 월의 일기 데이터를 불러오는데 실패하였습니다:',
          error
        ); //
      }
    };

    fetchDiaryData();
  }, [calendarApi]); // calendarApi가 변경될 때마다 실행

  // 일기 더미 데이터 (라이프사이클 콜백 함수 이용하지 않으면 렌더링 무한루프 발생)
  useEffect(() => {
    if (!currentYear || !currentMonth) return;

    // 해당 월 일기 데이터 받아오기 (useEffect()로 변경 필요)

    const requestYearMonth = `${currentYear}${String(currentMonth).padStart(2, '0')}`;
    console.log('월 일기 데이터 요청 연도, 월: ', requestYearMonth);
    const fetchDiaryData = async () => {
      try {
        const res = await axios.get<DiaryData>(
          `https://dailyemotion.site/api/diaries/monthly/${requestYearMonth}`,
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
  }, [currentYear, currentMonth]);

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
          const color = day === 0 ? 'red' : day === 6 ? 'blue' : 'black';
          return <span style={{ color }}>{daysInKorean[day]}</span>;
        }}
        dayCellContent={(info) => {
          // 날짜 글씨 색깔 변경
          const day = info.date.getDay();
          const color = day === 0 ? 'red' : day === 6 ? 'blue' : 'black';

          return (
            <div>
              <span style={{ color }}>{info.date.getDate()}</span>
            </div>
          );
        }}
        events={(fetchInfo, successCallback) => {
          const startDate = new Date(fetchInfo.start);
          const endDate = new Date(fetchInfo.end);
          const events = [];

          // 캘린더에 표시될 모든 날짜를 반복하며 이벤트 생성
          for (
            let date = new Date(startDate);
            date <= endDate;
            date.setDate(date.getDate() + 1)
          ) {
            const formattedDate = date.toISOString().split('T')[0];

            const matchingEntry = diaryData.find(
              (entry) => entry.date === formattedDate
            );

            events.push({
              title: '',
              start: formattedDate,
              extendedProps: {
                emotion: matchingEntry ? matchingEntry.emotion : null,
              },
            });
          }

          successCallback(events);
        }}
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
