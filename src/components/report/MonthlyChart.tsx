import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MonthlyChart = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [yearMonth, setYearMonth] = useState<string>('');
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>(
    {}
  );
  const [emotionPercentages, setEmotionPercentages] = useState<
    Record<string, number>
  >({});

  const accessToken = localStorage.getItem('Authorization');

  // API 호출 시 요청 목 데이터
  const year = '2024';
  const month = '2';

  // API 응답 더미 데이터
  const emotionCountsMockData = {
    yearMonth: yearMonth,
    emotionCounts: {
      ANGER: 1,
      FEAR: 2,
      HAPPINESS: 3,
      SADNESS: 3,
      INTEREST: 4,
      SURPRISE: 5,
      DISGUST: 6,
      SHAME: 7,
    },
  };

  useEffect(() => {
    if (!accessToken) {
      alert('로그인 상태가 아닙니다. 로그인 후 이용해주세요.');
      navigate('/');
    } else {
      axios
        .get<{ name: string }>('http://localhost:8080/api/user/profile', {
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
        const response = await axios.get<{
          yearMonth: string;
          emotionCounts: Record<string, number>;
        }>(`http://localhost:8080/api/reports/emotions/${year}/${month}`, {
          headers: { Authorization: accessToken },
        });

        console.log('이번 달 작성된 일기 감정 빈도: ', response.data);
        setYearMonth(response.data.yearMonth);
        // const emotionCounts = response.data.emotionCounts;
        const emotionCounts = emotionCountsMockData.emotionCounts;
        setEmotionCounts(emotionCounts);

        const emotionPercentages = calculateEmotionPercentages(emotionCounts);
        console.log('이번 달 작성된 일기 감정의 백분율: ', emotionPercentages);
        setEmotionPercentages(emotionPercentages);
      } catch (err) {
        console.log(`월별 감정 통계 조회 실패: ${err}`);
        alert(`월별 일기 감정 통계를 조회하는 데 실패했습니다: ${err}`);
      }
    };

    fetchEmotionCountsData();
  }, [yearMonth]);

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
  );
};

export default MonthlyChart;
