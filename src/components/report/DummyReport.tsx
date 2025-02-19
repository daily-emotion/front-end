import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ReportPageHeaderIconImage from '../../assets/images/ReportPage/Group 13902.png';

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

  return (
    <div className="emotion-card">
      <div className="emotion-chart-container">
        <div className="header">
          <div className="header-icon">
            <span className="icon-background"></span>{' '}
            {/* 배경을 나타내는 span */}
            <img
              className="icon-image"
              src={ReportPageHeaderIconImage}
              alt="통계 페이지 헤더 아이콘 그림"
            />
          </div>
          <span>{title}</span>
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
                  {date}
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
                    paddingAngle={5} // 각 섹션 사이의 간격 추가
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="progress-center-emotion">
                😊 {/* 이모티콘 대신 이미지 사용 가능 */}
                {/* <img src="/path/to/image.png" alt="Emotion Icon" /> */}
              </div>
              {/* <div className="progress-bar">
                <div
                  className="progress-segment happy"
                  style={{
                    height: `${(happyDays / totalDays) * 100}%`,
                  }}
                ></div>
                <div
                  className="progress-segment neutral"
                  style={{
                    height: `${(neutralDays / totalDays) * 100}%`,
                  }}
                ></div>
                <div
                  className="progress-segment sad"
                  style={{
                    height: `${(sadDays / totalDays) * 100}%`,
                  }}
                ></div>
              </div> */}
            </div>
            <div>
              {/* 감정 요약 문구 */}
              <div className="emotion-summary">
                <p>
                  <span style={{ color: '#ff3fa4' }}>행복한 감정</span>
                  <span>을 가장 많이 느끼셨네요!</span>
                </p>
              </div>

              {/* 감정 비율 (수평 정렬) */}
              <div className="emotion-percentages">
                <div className="emotion-percentage">
                  <span
                    className="emotion-dot"
                    style={{ backgroundColor: '#ff3fa4' }}
                  ></span>
                  <span>
                    행복한 ({Math.round((happyDays / totalDays) * 100)}
                    %)
                  </span>
                </div>
                <div className="emotion-percentage">
                  <span>
                    슬픈 ({Math.round((sadDays / totalDays) * 100)}
                    %)
                  </span>
                </div>
                <div className="emotion-percentage">
                  <span>
                    불만 ({Math.round((neutralDays / totalDays) * 100)}
                    %)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="stats-summary">
            <div className="stats-container">
              <div className="stat">
                <p className="stat-emotion-count">{happyDays}일</p>
                <p className="stat-emotion-record">{`😊`} 행복한 감정 기록됨</p>
              </div>
              <div className="stat">
                <p className="stat-emotion-count">{sadDays}일</p>
                <p className="stat-emotion-record">{`😊`} 슬픈 감정 기록됨</p>
              </div>
              <div className="stat">
                <p className="stat-emotion-count">{neutralDays}일</p>
                <p className="stat-emotion-record">{`😊`} 불만 감정 기록됨</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="keywords-section">
        <div
          className="header"
          style={{
            fontSize: '24px',
            borderBottom: 'none',
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
        <div className="keywords">
          <div className="keywords-left">
            {Array.from({ length: 3 }, (_, i) => {
              const keyword = keywords[i]; // 1~3등 키워드 가져오기
              return (
                <div
                  key={i}
                  className={`keyword-item ${keyword ? 'has-keyword' : ''}`}
                >
                  {keyword ? (
                    <span># {keyword}</span>
                  ) : (
                    <span># {i + 1}등 키워드</span> // 기본값 출력
                  )}
                </div>
              );
            })}
          </div>

          <div className="keywords-right">
            {Array.from({ length: 3 }, (_, i) => {
              const keyword = keywords[3 + i]; // 4~6등 키워드 가져오기
              return (
                <div
                  key={i}
                  className={`keyword-item ${keyword ? 'has-keyword' : ''}`}
                >
                  {keyword ? (
                    <span>👫{keyword}</span>
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

export default DummyReport;
