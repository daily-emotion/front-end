import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendarStore } from '../../stores/useCalendarStore';
import { BASE_URL } from '../../configs/apiConfig';

import EmotionStatsHeaderIconImage from '../../assets/images/ReportPage/ReportPage_EmotionStats_Header_Icon.png';

const MonthlyChart = () => {
  const navigate = useNavigate();

  // 현재 시간 (한국 기준 - 전역 상태관리 적용 안될 경우)
  const now = new Date();
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9 적용

  // 현재 시간 (FullCalendar 일시 적용)
  const { calendarApi } = useCalendarStore();

  // 사용자 이름 데이터 fetch
  const [userName, setUserName] = useState<string | null>(null);

  // 현재 연도, 월 적용 (추후 전역 상태관리로 변경)
  const [year, setYear] = useState<number>(
    calendarApi?.getDate().getFullYear() ?? koreanTime.getFullYear()
  );
  const [month, setMonth] = useState<number>(
    (calendarApi?.getDate().getMonth() ?? koreanTime.getMonth()) + 1
  );
  const [yearMonth, setYearMonth] = useState<string>('');
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>(
    {}
  );
  const [emotionPercentages, setEmotionPercentages] = useState<
    Record<string, number>
  >({});

  const accessToken = localStorage.getItem('Authorization');

  useEffect(() => {
    if (calendarApi) {
      console.log('캘린더 API 변경 감지: ', calendarApi.getDate());
      setYear(calendarApi?.getDate().getFullYear());
      setMonth(calendarApi?.getDate().getMonth() + 1);
    }
  }, [calendarApi]);

  useEffect(() => {
    if (!accessToken) {
      alert('로그인 상태가 아닙니다. 로그인 후 이용해주세요.');
      navigate('/');
    } else {
      axios
        .get<{ name: string }>(`${BASE_URL}/user/profile`, {
          headers: { Authorization: accessToken },
        })
        .then((res) => {
          console.log('사용자 정보 (MonthlyChart): ', res);
          setUserName(res.data.name);
        })
        .catch((err) => {
          setUserName('Unknown');
          console.log(`사용자 정보 조회 실패: ${err}`);
          alert(`사용자 정보를 불러오지 못했습니다: ${err}`);
        });
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    const calculateEmotionPercentages = (
      emotionCounts: Record<string, number>
    ) => {
      const total = Object.values(emotionCounts).reduce(
        (acc, count) => acc + count,
        0
      );

      if (total === 0) return {};

      return Object.fromEntries(
        // Object.fromEntries() : 배열 => 객체
        Object.entries(emotionCounts).map(([Key, count]) => [
          // Object.entries() : 객체 => 배열
          Key,
          parseFloat(((count / total) * 100).toFixed(0)), // parseFloat() : 소수점 숫자 문자열 => 숫자
        ])
      );
    };

    const fetchEmotionCountsData = async () => {
      try {
        const res = await axios.get<{
          yearMonth: string;
          emotionCounts: Record<string, number>;
        }>(
          `${BASE_URL}/reports/emotions/${year}/${month}`,
          // `https://dailyemotion.site/api/reports/emotions/${year}/${month}`,
          {
            headers: { Authorization: accessToken },
          }
        );

        console.log('이번 달 작성된 일기 감정 빈도: ', res.data);
        setYearMonth(res.data.yearMonth);
        const emotionCounts = res.data.emotionCounts;
        // const emotionCounts = emotionCountsMockData.emotionCounts;
        setEmotionCounts(emotionCounts);

        const emotionPercentages = calculateEmotionPercentages(emotionCounts);
        console.log('이번 달 작성된 일기 감정의 백분율: ', emotionPercentages);
        setEmotionPercentages(emotionPercentages);
      } catch (err) {
        console.log(`월별 감정 통계 조회 실패: ${err}`);
      }
    };

    fetchEmotionCountsData();
  }, [month]);

  const emotionTranslations: Record<string, string> = {
    HAPPINESS: '행복한',
    SADNESS: '슬픈',
    ANGER: '화난',
    DISGUST: '혐오스러운',
    FEAR: '무서운',
    SURPRISE: '놀라운',
    INTEREST: '궁금한',
    SHAME: '수치스러운',
  };

  const emotions = Object.keys(emotionTranslations);
  console.log('감정 한글화: ', emotions);

  const sortedEmotions = Object.entries(emotionPercentages).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <>
      <div className="chart-container">
        <div className="userName-container">
          <h2>{userName}님의 이번달은?</h2>
        </div>
        <div>
          <div>{yearMonth}</div>
          <h3>가장 많이 느꼈던 감정</h3>
          {sortedEmotions.map(([key, value]) => (
            <div key={key}>
              {emotionTranslations[key] || key} ({value || 0}%)
            </div>
          ))}
        </div>
        <div>
          {emotions.map((key) => (
            <div key={key}>
              {emotionTranslations[key]} {emotionCounts[key] || 0}일{' '}
              {emotionPercentages[key] || 0}%
            </div>
          ))}
        </div>
      </div>

      <div className="emotion-chart-container">
        <div className="emotion-chart-header">
          <div className="header-icon">
            <span className="icon-background"></span>{' '}
            {/* 배경을 나타내는 span */}
            <img
              className="icon-image"
              src={EmotionStatsHeaderIconImage}
              alt="감정 통계 페이지 헤더 아이콘 그림"
            />
          </div>
          <span>{userName}의 이번 달은?</span>
        </div>
        <div className="chart-section">
          <div className="chart-main">
            <div className="chart-top">
              <div className="chart-header">
                <h3 style={{ margin: '0px' }}>감정 통계</h3>
                <p
                  style={{
                    margin: '0px',
                    color: '#1c1f3793',
                    fontSize: '12px',
                  }}
                >
                  {year}.{String(month).padStart(2, '0')}.01 ~{' '}
                  {String(month).padStart(2, '0')}.
                  {new Date(year, month, 0).getDate()}
                </p>
              </div>
              <button className="view-report-btn">View Report</button>
            </div>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <div className="userName-container">
          <h2>{userName}님의 이번달은?</h2>
        </div>
        <div>
          <div>{yearMonth}</div>
          <h3>가장 많이 느꼈던 감정</h3>
          {sortedEmotions.map(([key, value]) => (
            <div key={key}>
              {emotionTranslations[key] || key} ({value || 0}%)
            </div>
          ))}
        </div>
        <div>
          {emotions.map((key) => (
            <div key={key}>
              {emotionTranslations[key]} {emotionCounts[key] || 0}일{' '}
              {emotionPercentages[key] || 0}%
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MonthlyChart;
