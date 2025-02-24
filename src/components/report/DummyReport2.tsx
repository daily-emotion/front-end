import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import EmotionStatsHeaderIconImage from '../../assets/images/ReportPage/ReportPage_EmotionStats_Header_Icon.png';
import TagStatsRightHeaderIconImage from '../../assets/images/ReportPage/ReportPage_TagStats_Header_Right_Icon.png';
import HappynessEmoji from '../../assets/images/emotions/HAPPYNESS.png';

interface DummyReportProps {
  title: string;
  date: string;
  happyDays: number;
  sadDays: number;
  neutralDays: number;
  keywords: string[];
}

const DummyReport: React.FC<DummyReportProps> = ({
  title,
  date,
  happyDays,
  sadDays,
  neutralDays,
  keywords,
}) => {
  const totalDays = happyDays + sadDays + neutralDays;
  const data = [
    { name: '행복한', value: happyDays, color: '#ff3fa4' }, // 핑크
    { name: '슬픈', value: sadDays, color: '#6c757d' }, // 회색
    { name: '불만', value: neutralDays, color: '#ff0000' }, // 빨강
  ];

  const maxValue = Math.max(...data.map((d) => d.value)); // 최대 value 찾기

  const lightenRGBA = (hex: string, alpha: number) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

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
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={data} // 차트에 들어갈 데이터
                    cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
                    cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
                    innerRadius={50} // 도넛 차트로 만들기 위한 내부 반지름
                    outerRadius={70} // 외부 반지름 설정
                    dataKey="value" // 데이터에서 'value' 값을 기준으로 크기 설정
                    stroke="none"
                    // paddingAngle={5} // 각 섹션 사이의 간격 추가
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  {/* 바깥쪽 원 */}
                  <Pie
                    data={data} // 차트에 들어갈 데이터
                    cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
                    cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
                    innerRadius={70} // 도넛 차트로 만들기 위한 내부 반지름
                    outerRadius={75} // 외부 반지름 설정
                    dataKey="value" // 데이터에서 'value' 값을 기준으로 크기 설정
                    stroke="none"
                    // paddingAngle={5} // 각 섹션 사이의 간격 추가
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.value === maxValue
                            ? lightenRGBA(entry.color, 0.2)
                            : 'rgba(0, 0, 0, 0)'
                        }
                      />
                    ))}
                  </Pie>

                  {/* 안쪽 원 */}
                  <Pie
                    data={data} // 차트에 들어갈 데이터
                    cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
                    cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
                    innerRadius={45} // 도넛 차트로 만들기 위한 내부 반지름
                    outerRadius={50} // 외부 반지름 설정
                    dataKey="value" // 데이터에서 'value' 값을 기준으로 크기 설정
                    stroke="none"
                    // paddingAngle={5} // 각 섹션 사이의 간격 추가
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.value === maxValue
                            ? lightenRGBA(entry.color, 0.2)
                            : 'rgba(0, 0, 0, 0)'
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="progress-center-emotion">
                <img src={HappynessEmoji} alt="Emotion Icon" />
              </div>
            </div>
            <div>
              {/* 감정 요약 문구 */}
              <div className="emotion-summary">
                {sortedStatDetails ? (
                  <p>
                    <span style={{ color: '#ff3fa4' }}>
                      {sortedStatDetails &&
                      sortedStatDetails.sortedTopEmotions.length > 0
                        ? Object.keys(sortedStatDetails.sortedTopEmotions[0])[0]
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
                        style={{ backgroundColor: '#ff3fa4' }}
                      ></span>
                      <span>
                        {emotionTranslations[Object.keys(emotion)[0]]}
                        {emotionPercentages[Object.keys(emotion)[0]] || 0}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="stats-summary">
            <div className="stats-container">
              <div className="stat">
                {sortedStatDetails?.sortedTopEmotions
                  .slice(0, 3)
                  .map((emotion, index) => (
                    <>
                      <p className="stat-emotion-count" key={index}>
                        {Object.values(emotion)[0]}일
                      </p>
                      <div
                        className="stat-emotion-record-container"
                        key={index}
                      >
                        <img
                          src={HappynessEmoji}
                          alt={`기록 ${index + 1}위 감정`}
                          style={{ width: '18px', height: 'auto' }}
                        />
                        <p className="stat-emotion-record">
                          {Object.keys(emotion)[0] || 0} 감정 기록됨
                        </p>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="keywords-section" style={{}}>
          <div
            className="keywords-section-header"
            style={{
              borderBottom: 'none',
              display: 'flex',
              flexDirection: 'row', // ✅ 좌우 배치
              alignItems: 'flex-start', // ✅ 수직 정렬
              justifyContent: 'space-between', // ✅ 양쪽 정렬
              width: '100%', // ✅ 전체 너비 설정
            }}
          >
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
                  <strong>#인간관계</strong> 키워드를
                  <br />
                  가장 많이 사용했습니다.
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
    </div>
  );
};

export default DummyReport2;
