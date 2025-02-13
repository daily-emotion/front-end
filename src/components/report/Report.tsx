import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../configs/apiConfig';

interface ReportProps {
  year: number;
  month: number;
}

interface StatData {
  monthlyStats: {
    yearMonth: string;
    stats: {
      yearMonth: string;
      topEmotions: Record<string, number>[];
      topTags: Record<string, number>[];
    };
  }[];
}

const accessToken = localStorage.getItem('Authorization');

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

const Report = ({ year, month }: ReportProps) => {
  // 현재 시간 (한국 기준)
  const now = new Date();
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9 적용

  // 사용자 이름 데이터 fetch
  const [userName, setUserName] = useState<string | null>(null);

  // 현재 연도, 월 적용 (추후 전역 상태관리로 변경)
  const [statDetails, setStatDetails] = useState<{
    yearMonth: string;
    topEmotions: Record<string, number>[];
    topTags: Record<string, number>[];
  } | null>(null);
  const [sortedStatDetails, setSortedStatDetails] = useState<{
    sortedTopEmotions: Record<string, number>[];
    sortedTopTags: Record<string, number>[];
  } | null>(null);
  const [emotionPercentages, setEmotionPercentages] = useState<
    Record<string, number>
  >({});
  const today = String(koreanTime.getDate()).padStart(2, '0');
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  useEffect(() => {
    if (!year || !month) return;

    const fetchMonthlyStat = async () => {
      try {
        const res = await axios.get<StatData>(
          `${BASE_URL}/reports/summary/${year}/${month}`,
          {
            headers: { Authorization: accessToken },
          }
        );
        if (res.data) {
          const selectedStatData = res.data.monthlyStats.find(
            (stat) =>
              stat.yearMonth === `${year}-${String(month).padStart(2, '0')}`
          );
          if (selectedStatData) {
            const yearMonth = selectedStatData.stats.yearMonth ?? '';
            const topEmotions = selectedStatData.stats.topEmotions ?? [];
            const topTags = selectedStatData.stats.topTags ?? [];

            setStatDetails({ yearMonth, topEmotions, topTags });
          }
        } else {
          setStatDetails(null);
        }
      } catch (err) {
        console.log(`${year}년 ${month}월 통계 데이터 조회 실패: ${err}`);
        alert(`${year}년 ${month}월 통계 데이터 조회 실패: ${err}`);
      }
    };

    fetchMonthlyStat();
  }, [year, month]);

  useEffect(() => {
    if (!statDetails) return;

    const sortedTopEmotions = [...statDetails.topEmotions].sort((a, b) => {
      const valueA = Object.values(a)[0];
      const valueB = Object.values(b)[0];
      return valueB - valueA;
    });

    const sortedTopTags = [...statDetails.topTags].sort((a, b) => {
      const valueA = Object.values(a)[0];
      const valueB = Object.values(b)[0];
      return valueB - valueA;
    });

    console.table(sortedTopEmotions);
    console.table(sortedTopTags);

    setSortedStatDetails({
      sortedTopEmotions,
      sortedTopTags,
    });
  }, [statDetails]);

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
        // setYearMonth(res.data.yearMonth);
        const emotionCounts = res.data.emotionCounts;
        // const emotionCounts = emotionCountsMockData.emotionCounts;
        // setEmotionCounts(emotionCounts);

        const emotionPcts = calculateEmotionPercentages(emotionCounts);
        setEmotionPercentages(emotionPcts);
        console.log('이번 달 작성된 일기 감정의 백분율: ', emotionPercentages);
      } catch (err) {
        console.log(`월별 감정 통계 조회 실패: ${err}`);
        alert(`월별 일기 감정 통계를 조회하는 데 실패했습니다: ${err}`);
      }
    };

    fetchEmotionCountsData();
  }, [month]);

  return (
    <div>
      <div>
        <div>
          <div>
            <div>감정 통계</div>
            <div>
              {year}.{String(month).padStart(2, '0')}.01 ~{' '}
              {String(month).padStart(2, '0')}.
              {new Date(year, month, 0).getDate()}
            </div>
          </div>
          {sortedStatDetails ? (
            <div>
              {sortedStatDetails &&
              sortedStatDetails.sortedTopEmotions.length > 0
                ? Object.keys(sortedStatDetails.sortedTopEmotions[0])[0]
                : null}{' '}
              감정을 가장 많이 느끼셨네요!
            </div>
          ) : (
            <div> 해당 월에 등록된 일기가 없습니다. </div>
          )}
          <div>
            {sortedStatDetails?.sortedTopEmotions
              .slice(0, 3)
              .map((emotion, index) => (
                <div key={index}>
                  {emotionTranslations[Object.keys(emotion)[0]]}
                  {emotionPercentages[Object.keys(emotion)[0]] || 0}%
                </div>
              ))}
          </div>
          <div>
            {sortedStatDetails?.sortedTopEmotions
              .slice(0, 3)
              .map((emotion, index) => (
                <>
                  <div key={index}>{Object.values(emotion)[0]}일</div>
                  <div key={index}>
                    {Object.keys(emotion)[0] || 0} 감정 기록됨
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
      <div>
        <div>
          {sortedStatDetails?.sortedTopTags
            .slice(0, 6)
            .map((tag, index) => <div key={index}>{Object.keys(tag)[0]}</div>)}
        </div>
      </div>
    </div>
  );
};

export default Report;
