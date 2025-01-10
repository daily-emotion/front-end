import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateCalendar = () => {
  // 단일 날짜 상태
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 요일 변환 함수
  const changeDay = (date: Date): string => {
    const days = ["일", "월", "화", "수", "목", "금", "토"]; // 요일 배열
    return days[date.getDay()]; // 선택된 날짜의 요일 반환
  };

  // onChange 함수: 선택된 날짜를 처리
  const onChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date); // null이 아닌 경우에만 상태를 업데이트
    } else {
      console.warn('Invalid date selection: null');
    }
  };

  return (
    <>
      <div>
        <h2>
          {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 {changeDay(selectedDate)}요일
        </h2>
      </div>
      <div>
        <p>날짜 선택</p>
        <DatePicker
            selected={selectedDate} // 선택된 날짜
            onChange={onChange} // 날짜 선택 이벤트 핸들러
            selectsStart // 시작 날짜로만 동작
            inline // 달력을 인라인으로 표시
        />
      </div>
    </>
  );
};

export default CreateCalendar;
