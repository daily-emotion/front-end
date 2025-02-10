import { useEffect, useState } from 'react';

interface ReportProps {
  isThisMonth: boolean;
}

interface MonthlyStat {
  yearMonth: string;
  stats: {
    yearMonth: string;
    topEmotions: { value: number; key: string }[];
    topTags: { value: number; key: string }[];
  };
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

const Report = ({ isThisMonth }: ReportProps) => {
  // 사용자 이름 데이터 fetch
  const [userName, setUserName] = useState<string | null>(null);

  // 현재 연도, 월 적용 (추후 전역 상태관리로 변경)
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [statDetails, setStatDetails] = useState<{
    yearMonth: string;
    topEmotions: { value: number; key: string }[];
    topTags: { value: number; key: string }[];
  } | null>(null);
  const [sortedStatDetails, setSortedStatDetails] = useState<{
    sortedTopEmotions: { value: number; key: string }[];
    sortedTopTags: { value: number; key: string }[];
  } | null>(null);
  const today = String(new Date().getDate()).padStart(2, '0');
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  useEffect(() => {
    if (isThisMonth) {
      setYear(new Date().getFullYear());
      setMonth(new Date().getMonth() + 1);
    } else {
      setYear(
        new Date().getMonth() === 0
          ? new Date().getFullYear() - 1
          : new Date().getFullYear()
      );
      setMonth(new Date().getMonth() === 0 ? 12 : new Date().getMonth());
    }
  });

  //
  useEffect(() => {
    if (!year || !month) return; // 유효한 값이 설정된 이후에 실행

    const fetchMonthlyStat = async () => {
      const getStatDetails = (monthlyStat: MonthlyStat) => {
        const yearMonth = monthlyStat.stats.yearMonth;
        const topEmotions = monthlyStat.stats.topEmotions;
        const topTags = monthlyStat.stats.topTags;
        return { yearMonth, topEmotions, topTags };
      };

      try {
        const res = await axios.get<MonthlyStat>( // GET 요청 제네릭은 호출 결과물인 response.data 타입 지정
          `http://localhost:8080/reports/summary/${year}/${month}`,
          {
            headers: { Authorization: accessToken },
          }
        );
        if (res.data) {
          const details = getStatDetails(res.data);
          console.log(details);
          setStatDetails(details);
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

    const translatedTopEmotions = [...statDetails.topEmotions].map(
      (emotion) => ({
        value: emotion.value,
        key: emotionTranslations[emotion.key] || emotion.key,
      })
    );

    const sortedTopEmotions = translatedTopEmotions.sort(
      (a, b) => b.value - a.value
    );
    const sortedTopTags = [...statDetails.topTags].sort(
      (a, b) => b.value - a.value
    );

    setSortedStatDetails({
      sortedTopEmotions,
      sortedTopTags,
    });
  }, [statDetails]);

  return (
    <div>
      <div>
        <div>
          {userName}님의 {isThisMonth ? '이번 달' : '저번 달'} 감정기록
        </div>
        <div>
          <div>
            <div>감정 통계</div>
            <div>
              {year}.{String(month).padStart(2, '0')}.01 ~{' '}
              {String(month).padStart(2, '0')}.
              {isThisMonth ? today : lastDayOfMonth}
            </div>
          </div>
          <div>
            {sortedStatDetails?.sortedTopEmotions[0].key} 감정을 가장 많이
            느끼셨네요!
          </div>
          <div>
            {sortedStatDetails?.sortedTopEmotions
              .slice(0, 3)
              .map((emotion, index) => (
                <div key={index}>
                  {emotion.key}({emotion.value}%)
                </div>
              ))}
          </div>
        </div>
      </div>
      <div>
        <div>
          {userName}님의 {isThisMonth ? '이번 달' : '저번 달'} 태그
        </div>
        <div>
          {sortedStatDetails?.sortedTopTags
            .slice(0, 6)
            .map((tag) => <div key={tag.key}>{tag.key}</div>)}
        </div>
      </div>
    </div>
  );
};

export default Report;
