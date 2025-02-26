import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../configs/apiConfig';

import * as Recharts from 'recharts';
const { PieChart, Pie, Cell, ResponsiveContainer } = Recharts;
import EmotionStatsHeaderIconImage from '../../assets/images/ReportPage/ReportPage_EmotionStats_Header_Icon.png';
import TagStatsRightHeaderIconImage from '../../assets/images/ReportPage/ReportPage_TagStats_Header_Right_Icon.png';

import HAPPNESSEMOJI from '../../assets/images/emotions/HAPPYNESS.png';
import ANGEREMOJI from '../../assets/images/emotions/ANGER.png';
import DISGUSTEMOJI from '../../assets/images/emotions/DISGUST.png';
import FEAREMOJI from '../../assets/images/emotions/FEAR.png';
import INTERESTEMOJI from '../../assets/images/emotions/INTEREST.png';
import SADNESSEMOJI from '../../assets/images/emotions/SADNESS.png';
import SHAMEEMOJI from '../../assets/images/emotions/SHAME.png';
import SURPRISEEMOJI from '../../assets/images/emotions/SURPRISE.png';

interface ReportProps {
  year: number;
  month: number;
  title: string;
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

const emotionColors: Record<string, string> = {
  HAPPINESS: '#ff66b2', // 핑크 (행복한)
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

const Report = ({ year, month, title }: ReportProps) => {
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
    yearMonth: string;
    sortedTopEmotions: Record<string, number>[];
    sortedTopTags: Record<string, number>[];
  } | null>(null);
  const [emotionPercentages, setEmotionPercentages] = useState<
    Record<string, number>
  >({});
  const today = String(koreanTime.getDate()).padStart(2, '0');
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (sortedStatDetails) {
      setTimeout(() => setIsReady(true), 0);
      console.log(
        '🚀 배포 환경 sortedTopEmotions:',
        sortedStatDetails.sortedTopEmotions
      );
    }
  }, [sortedStatDetails]);

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
      yearMonth: statDetails.yearMonth,
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
      }
    };

    fetchEmotionCountsData();
  }, [month]);

  const tags =
    sortedStatDetails?.sortedTopTags
      .slice(0, 6)
      .map((tag) => Object.keys(tag)[0]) || []; // 태그가 없으면 빈 배열 반환

  const pieData =
    sortedStatDetails?.sortedTopEmotions?.map((entry) => {
      const key = Object.keys(entry)[0]; // 감정 키 가져오기 (예: "HAPPINESS")
      return { name: key, value: entry[key] }; // 올바른 구조로 변환
    }) || [];

  const lightenRGBA = (hex: string, alpha: number) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const maxValue = Math.max(...(pieData.map((d) => d.value) || [])); // 최대 value 찾기

  return (
    <div className="emotion-card">
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
          <span>
            {userName}의 {title} 감정기록
          </span>
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
            <div className="progress-container">
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
                        {sortedStatDetails?.sortedTopEmotions.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={emotionColors[Object.keys(entry)[0]]}
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
                        {sortedStatDetails?.sortedTopEmotions.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.value === maxValue
                                  ? lightenRGBA(
                                      emotionColors[Object.keys(entry)[0]],
                                      0.2
                                    )
                                  : 'rgba(0, 0, 0, 0)'
                              }
                            />
                          )
                        )}
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
                        {sortedStatDetails?.sortedTopEmotions.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.value === maxValue
                                  ? lightenRGBA(
                                      emotionColors[Object.keys(entry)[0]],
                                      0.2
                                    )
                                  : 'rgba(0, 0, 0, 0)'
                              }
                            />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="progress-center-emotion">
                    <img
                      src={
                        sortedStatDetails?.sortedTopEmotions?.[0]
                          ? emotionIcons[
                              Object.keys(
                                sortedStatDetails.sortedTopEmotions[0]
                              )[0]
                            ]
                          : ''
                      }
                      alt="Emotion Icon"
                    />
                  </div>
                </>
              ) : (
                <div>로딩 중...</div>
              )}
            </div>
            <div>
              {/* 감정 요약 문구 */}
              <div className="emotion-summary">
                {sortedStatDetails ? (
                  <p>
                    <span style={{ color: '#ff3fa4' }}>
                      {sortedStatDetails &&
                      sortedStatDetails.sortedTopEmotions.length > 0
                        ? emotionTranslations[
                            Object.keys(
                              sortedStatDetails.sortedTopEmotions[0]
                            )[0]
                          ]
                        : null}{' '}
                      감정
                    </span>
                    <span>을 가장 많이 느끼셨네요!</span>
                  </p>
                ) : (
                  <div> 해당 월에 등록된 일기가 없습니다. </div>
                )}
              </div>
              {/* 감정 비율 (수평 정렬) */}
              <div className="emotion-percentages">
                {sortedStatDetails?.sortedTopEmotions
                  .slice(0, 3)
                  .map((emotion, index) => (
                    <div className="emotion-percentage" key={index}>
                      <span
                        className="emotion-dot"
                        style={{
                          backgroundColor:
                            emotionColors[Object.keys(emotion)[0]],
                        }}
                      ></span>
                      <span>
                        {emotionTranslations[Object.keys(emotion)[0]]}{' '}
                        {emotionPercentages[Object.keys(emotion)[0]] || 0}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="stats-summary">
            <div className="stats-container">
              {sortedStatDetails?.sortedTopEmotions
                .slice(0, 3)
                .map((emotion, index) => (
                  <div className="stat">
                    <p className="stat-emotion-count" key={index}>
                      {Object.values(emotion)[0]}일
                    </p>
                    <div className="stat-emotion-record-container" key={index}>
                      <img
                        src={
                          sortedStatDetails?.sortedTopEmotions?.[index]
                            ? emotionIcons[
                                Object.keys(
                                  sortedStatDetails.sortedTopEmotions[index]
                                )[0]
                              ]
                            : ''
                        }
                        alt={`기록 ${index + 1}위 감정`}
                        style={{ width: '18px', height: 'auto' }}
                      />
                      <p className="stat-emotion-record">
                        {emotionTranslations[Object.keys(emotion)[0] || 0]} 감정
                        기록됨
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="keywords-section">
        <div className="keywords-section-header">
          <div
            className="keywords-section-Left-Header"
            style={{
              borderBottom: 'none',
              flex: 6, // ✅ 60% 차지
              fontSize: '24px',
              display: 'flex',
              flexDirection: 'column', // ✅ 요소들을 세로로 정렬
              alignItems: 'flex-start', // ✅ 왼쪽 정렬
              gap: '0px',
            }}
          >
            <span>{title}의 키워드</span>
            <span
              style={{
                color: '#38383899',
                fontSize: '12px',
                textAlign: 'left',
              }}
            >
              다이어리를 작성하면서 많이 사용한 키워드 6가지입니다. <br />
              키워드와 함께기록했던 감정도 확인해보세요!
            </span>
          </div>
          <div
            className="keywords-section-Right-Header"
            style={{
              display: 'flex',
              justifyContent: 'flex-end', // ✅ 오른쪽 정렬
              alignItems: 'center', // ✅ 수직 중앙 정렬
              flex: 4, // ✅ 40% 차지
              padding: '10px 20px',
            }}
          >
            <div className="speech-bubble-container">
              {/* 아이콘 */}
              <div
                className="header-icon"
                style={{
                  position: 'relative',
                  width: '28px',
                  height: '28px',
                }}
              >
                <span
                  className="icon-background"
                  style={{
                    backgroundColor: '#DDF4FC',
                    width: '28px',
                    height: '28px',
                    display: 'block',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                  }}
                ></span>
                <img
                  className="icon-image"
                  src={TagStatsRightHeaderIconImage}
                  style={{
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  alt="태그 통계 페이지 헤더 아이콘 그림"
                />
              </div>

              {/* 말풍선 */}
              <div className="speech-bubble">
                {sortedStatDetails?.sortedTopTags?.[0] ? (
                  <>
                    <strong>
                      {Object.keys(sortedStatDetails?.sortedTopTags[0])[0]}
                    </strong>{' '}
                    키워드를
                    <br />
                    가장 많이 사용했습니다.
                  </>
                ) : (
                  <>사용된 키워드가 없습니다.</>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="keywords">
          <div className="keywords-left">
            {Array.from({ length: 3 }, (_, i) => {
              const tag = tags[i]; // 1~3등 키워드 가져오기
              return (
                <div
                  key={i}
                  className={`keyword-item ${tag ? 'has-keyword' : ''}`}
                >
                  {tag ? (
                    <span># {tag}</span>
                  ) : (
                    <span># {i + 1}등 키워드</span> // 기본값 출력
                  )}
                </div>
              );
            })}
          </div>

          <div className="keywords-right">
            {Array.from({ length: 3 }, (_, i) => {
              const tag = tags[3 + i]; // 4~6등 키워드 가져오기
              return (
                <div
                  key={i}
                  className={`keyword-item ${tag ? 'has-keyword' : ''}`}
                >
                  {tag ? (
                    <span># {tag}</span>
                  ) : (
                    <span># {i + 4}등 키워드</span> // 기본값 출력
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
