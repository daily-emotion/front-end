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

// 현재 시간 (한국 기준 - 전역 상태관리 적용 안될 경우)
const now = new Date();
const koreanDate = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9 적용

// React.FC<CalendarProps>는 이 컴포넌트는 함수형, CalendarProps라는 형태의 props를 사용한다는 뜻
const Calendar: React.FC<CalendarProps> = ({ accessToken }) => {
  const { setCalendarRef, setCalendarApi } = useCalendarStore();
  const calendarRef = useRef<FullCalendar>(null);
  const [calendarApi, setCalendarApiLocal] = useState<CalendarApi | null>(null);
  const navigate = useNavigate();

  // 현재 실시간 Date
  const [currentDate, setCurrentDate] = useState<Date>(koreanDate);
  console.log(`currentDate: ${currentDate}`);
  const [currentYear, setCurrentYear] = useState<number>(
    currentDate ? currentDate.getFullYear() : 0
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    currentDate ? currentDate.getMonth() + 1 : 0
  );

  // 현재 달력에서 보여주고 있는 Date
  const [displayDate, setDisplayDate] = useState<Date>(koreanDate);
  console.log(`displayDate: ${displayDate}`);

  const [displayYear, setDisplayYear] = useState<number>(
    displayDate ? displayDate.getFullYear() : currentDate.getFullYear()
  );
  const [displayMonth, setDisplayMonth] = useState<number>(
    displayDate ? displayDate.getMonth() + 1 : 0
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
  }, []);

  useEffect(() => {
    if (!calendarApi) return;

    const year = displayYear;
    const month = displayMonth;

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
  }, [calendarApi, displayYear, displayMonth]); // calendarApi가 변경될 때마다 실행

  useEffect(() => {
    if (!calendarApi) return;

    const nextMonthButton =
      // document.querySelector<Element>('.fc-next-button');
      document.querySelector<HTMLButtonElement>('.fc-next-button');

    if (!nextMonthButton) return;

    if (currentYear === displayYear && currentMonth === displayMonth) {
      // nextMonthButton.setAttribute('disabled', 'true'); // => nextMonthButton의 타입이 Element일 때
      nextMonthButton.disabled = true; // => nextMonthButton의 타입이 HTMLButtonElement일 때
      nextMonthButton.classList.add('nextMonthButtonDisabled');
    } else {
      // nextMonthButton.setAttribute('disabled', 'false'); // => nextMonthButton의 타입이 Element일 때
      nextMonthButton.disabled = false; // => nextMonthButton의 타입이 HTMLButtonElement일 때
      nextMonthButton.classList.remove('nextMonthButtonDisabled');
    }
  }, [calendarApi, currentYear, currentMonth, displayYear, displayMonth]);

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

  useEffect(() => {
    const handleDeleteLastRow = () => {
      const calendarRows = document.querySelectorAll('tBody > tr');
      const lastCalendarRow = calendarRows[calendarRows.length - 1];

      if (!lastCalendarRow) return;

      for (let i = 0; i < lastCalendarRow.children.length; i++) {
        const eventCell = lastCalendarRow.children[i].children[0].children[1];
        if (!eventCell.classList.contains('fc-day-other')) return;
        else {
          lastCalendarRow.remove();
        }
      }
    };

    handleDeleteLastRow();
  }, [displayYear, displayMonth]);

  useEffect(() => {
    const handleDeleteEvents = () => {
      const otherDates = document.querySelectorAll('.fc-day-other');

      for (let i = 0; i < otherDates.length; i++) {
        const parent = otherDates[i];
        parent?.children[1].remove();
      }
    };

    handleDeleteEvents();
  }, [displayYear, displayMonth]);

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
            const api = calendarRef.current.getApi();
            setCalendarApi(api);
            setDisplayDate(api.getDate());
            setDisplayYear(api.getDate().getFullYear());
            setDisplayMonth(api.getDate().getMonth() + 1);
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
