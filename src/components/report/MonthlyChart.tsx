import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendarStore } from '../../stores/useCalendarStore';
import API, { BASE_URL } from '../../configs/apiConfig';

import * as Recharts from 'recharts';
const { PieChart, Pie, Cell, ResponsiveContainer } = Recharts;

import stylesMonthlyChart from '../../styles/pages/MonthlyChart.module.css';

import EmotionStatsHeaderIconImage from '../../assets/images/ReportPage/ReportPage_EmotionStats_Header_Icon.png';

import HAPPNESSEMOJI from '../../assets/images/emotions/HAPPYNESS.png';
import ANGEREMOJI from '../../assets/images/emotions/ANGER.png';
import DISGUSTEMOJI from '../../assets/images/emotions/DISGUST.png';
import FEAREMOJI from '../../assets/images/emotions/FEAR.png';
import INTERESTEMOJI from '../../assets/images/emotions/INTEREST.png';
import SADNESSEMOJI from '../../assets/images/emotions/SADNESS.png';
import SHAMEEMOJI from '../../assets/images/emotions/SHAME.png';
import SURPRISEEMOJI from '../../assets/images/emotions/SURPRISE.png';

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

const emotionColors: Record<string, string> = {
  HAPPINESS: '#FD1F9B', // 핑크 (행복한)
  SADNESS: '#4c4c6d', // 회색 (슬픈)
  ANGER: '#ff1a1a', // 빨강 (분노)
  FEAR: '#6600cc', // 보라 (무서운)
  SURPRISE: '#ff9900', // 주황 (놀란)
  INTEREST: '#ffcc00', // 노랑 (궁금한)
  DISGUST: '#00b300', // 초록 (혐오스러운)
  SHAME: '#0080ff', // 파랑 (수치스러운)
};

const emotionIcons: Record<string, string> = {
  HAPPINESS: HAPPNESSEMOJI,
  SADNESS: SADNESSEMOJI,
  ANGER: ANGEREMOJI,
  DISGUST: DISGUSTEMOJI,
  FEAR: FEAREMOJI,
  SURPRISE: SURPRISEEMOJI,
  INTEREST: INTERESTEMOJI,
  SHAME: SHAMEEMOJI,
};

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
  const [isReady, setIsReady] = useState(false);
  const accessToken = localStorage.getItem('Authorization');

  const pieData =
    Object.entries(emotionCounts).map(([key, value]) => ({
      name: key,
      value, // value: value → value (단축 속성 사용)
    })) || [];

  const lightenRGBA = (hex: string, alpha: number) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const maxValue = Math.max(...(pieData.map((d) => d.value) || [])); // 최대 value 찾기
  console.log(`maxValue: ${maxValue}`);

  useEffect(() => {
    if (emotionCounts && emotionPercentages) {
      setTimeout(() => setIsReady(true), 0);
      console.log(`차트에 데이터 전달 완료`);
    }
  }, [emotionCounts, emotionPercentages]);

  useEffect(() => {
    if (calendarApi) {
      console.log('캘린더 API 변경 감지: ', calendarApi.getDate());
      setYear(calendarApi?.getDate().getFullYear());
      setMonth(calendarApi?.getDate().getMonth() + 1);
    }
  }, [calendarApi]);

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
        // const res = await axios.get<{
        //   yearMonth: string;
        //   emotionCounts: Record<string, number>;
        // }>(
        //   `${BASE_URL}/reports/emotions/${year}/${month}`,
        //   // `https://dailyemotion.site/api/reports/emotions/${year}/${month}`,
        //   {
        //     headers: { Authorization: accessToken },
        //   }
        // );

        const res = await API.get<{
          yearMonth: string;
          emotionCounts: Record<string, number>;
        }>(`/reports/emotions/${year}/${month}`);

        console.log('이번 달 작성된 일기 감정 빈도: ', res.data);
        setYearMonth(res.data.yearMonth);
        setEmotionCounts(res.data.emotionCounts);
        console.log('이번 달 작성된 일기 감정 빈도: ', res.data.emotionCounts);
        const emotionPercentages = calculateEmotionPercentages(
          res.data.emotionCounts
        );
        console.log('이번 달 작성된 일기 감정의 백분율: ', emotionPercentages);
        setEmotionPercentages(emotionPercentages);
      } catch (err) {
        console.log(`월별 감정 통계 조회 실패: ${err}`);
      }
    };

    fetchEmotionCountsData();
  }, [year, month]);

  const sortedEmotions = Object.entries(emotionPercentages).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <>
      <div className={stylesMonthlyChart.emotionChartContainer}>
        <div className={stylesMonthlyChart.emotionChartHeader}>
          <div className={stylesMonthlyChart.headerIcon}>
            <span className={stylesMonthlyChart.iconBackground}></span>{' '}
            {/* 배경을 나타내는 span */}
            <img
              className={stylesMonthlyChart.iconImage}
              src={EmotionStatsHeaderIconImage}
              alt="감정 통계 페이지 헤더 아이콘 그림"
            />
          </div>
          <span>{userName}님의 이번 달은?</span>
        </div>
        <div className={stylesMonthlyChart.chartSection}>
          <div className={stylesMonthlyChart.chartLeft}>
            <div className={stylesMonthlyChart.chartHeader}>
              <p
                style={{
                  margin: '0px',
                  color: '#1c1f3793',
                  fontSize: '12px',
                }}
              >
                {year}.{String(month).padStart(2, '0')}
              </p>
              <h3 style={{ margin: '0px' }}>가장 많이 느꼈던 감정</h3>
            </div>
            <div className={stylesMonthlyChart.emotionPercentages}>
              <div className={stylesMonthlyChart.emotionPercentagesLeft}>
                {Object.keys(emotionTranslations)
                  .slice(0, 4)
                  .map((key) => (
                    <div
                      className={stylesMonthlyChart.emotionPercentage}
                      key={key}
                    >
                      <span
                        className={stylesMonthlyChart.emotionDot}
                        style={{
                          backgroundColor: emotionColors[key],
                        }}
                      ></span>
                      <span>
                        {`${emotionTranslations[key]} `} (
                        {emotionPercentages[key] || 0}%)
                      </span>
                    </div>
                  ))}
              </div>
              <div className={stylesMonthlyChart.emotionPercentagesRight}>
                {Object.keys(emotionTranslations)
                  .slice(4, 8)
                  .map((key) => (
                    <div
                      className={stylesMonthlyChart.emotionPercentage}
                      key={key}
                    >
                      <span
                        className={stylesMonthlyChart.emotionDot}
                        style={{
                          backgroundColor: emotionColors[key],
                        }}
                      ></span>
                      <span>
                        {`${emotionTranslations[key]} `} (
                        {emotionPercentages[key] || 0}%)
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div
            className={[
              stylesMonthlyChart.chartRight,
              stylesMonthlyChart.progressContainer,
            ].join(' ')}
          >
            {isReady ? (
              <>
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={pieData} // 차트에 들어갈 데이터
                      cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
                      cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
                      innerRadius={50} // 도넛 차트로 만들기 위한 내부 반지름
                      outerRadius={70} // 외부 반지름 설정
                      // dataKey="value" // 데이터에서 'value' 값을 기준으로 크기 설정
                      dataKey={(entry) => entry.value} // 🚀 함수형 dataKey 사용
                      stroke="none"

                      // paddingAngle={5} // 각 섹션 사이의 간격 추가
                    >
                      {Object.entries(emotionCounts).map(
                        ([emotion, count], index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={emotionColors[emotion]}
                          />
                        )
                      )}
                    </Pie>

                    {/* 바깥쪽 원 */}
                    <Pie
                      data={pieData} // 차트에 들어갈 데이터
                      cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
                      cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
                      innerRadius={70} // 도넛 차트로 만들기 위한 내부 반지름
                      outerRadius={75} // 외부 반지름 설정
                      dataKey={(entry) => entry.value} // 🚀 함수형 dataKey 사용
                      stroke="none"
                      // paddingAngle={5} // 각 섹션 사이의 간격 추가
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.value === maxValue
                              ? lightenRGBA(emotionColors[entry.name], 0.2)
                              : 'rgba(0, 0, 0, 0)'
                          }
                        />
                      ))}
                    </Pie>

                    {/* 안쪽 원 */}
                    <Pie
                      data={pieData} // 차트에 들어갈 데이터
                      cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
                      cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
                      innerRadius={45} // 도넛 차트로 만들기 위한 내부 반지름
                      outerRadius={50} // 외부 반지름 설정
                      dataKey={(entry) => entry.value} // 🚀 함수형 dataKey 사용
                      stroke="none"
                      // paddingAngle={5} // 각 섹션 사이의 간격 추가
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.value === maxValue
                              ? lightenRGBA(emotionColors[entry.name], 0.2)
                              : 'rgba(0, 0, 0, 0)'
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div>로딩 중...</div>
            )}
          </div>
        </div>
        <div className={stylesMonthlyChart.barCharts}>
          {Object.keys(emotionTranslations).map((key) => (
            <div className={stylesMonthlyChart.barChart} key={key}>
              <img
                className={stylesMonthlyChart.barChartImg}
                src={emotionIcons[key]}
                alt="막대 차트 항목 별 이미지"
              />
              <span>{emotionTranslations[key]}</span>
              {/* <BarChart> */}
              <div>
                <strong>{emotionCounts[key] || 0}일</strong>
              </div>
              <div
                className={stylesMonthlyChart.barChartPercentage}
                style={{
                  backgroundColor: emotionColors[key],
                }}
              >
                <strong>{emotionPercentages[key] || 0}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MonthlyChart;
