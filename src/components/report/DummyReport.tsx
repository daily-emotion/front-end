import React from 'react';

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
  return (
    <div className="emotion-card">
      <div className="header-section">
        <div className="header">{title}</div>
        <div className="chart">
          <div className="progress-bar">
            <div>
              <h2>감정 통계</h2>
              <p>{date}</p>
            </div>
            <span
              className="happy"
              style={{
                height: `${(happyDays / (happyDays + sadDays + neutralDays)) * 100}%`,
              }}
            ></span>
            <span
              className="neutral"
              style={{
                height: `${(neutralDays / (happyDays + sadDays + neutralDays)) * 100}%`,
              }}
            ></span>
            <span
              className="sad"
              style={{
                height: `${(sadDays / (happyDays + sadDays + neutralDays)) * 100}%`,
              }}
            ></span>
          </div>
          <div className="stats-summary">
            <div className="stat">
              <h3>{happyDays}일</h3>
              <p>행복한 감정 기록됨</p>
            </div>
            <div className="stat">
              <h3>{sadDays}일</h3>
              <p>슬픈 감정 기록됨</p>
            </div>
            <div className="stat">
              <h3>{neutralDays}일</h3>
              <p>불만 감정 기록됨</p>
            </div>
          </div>
        </div>
      </div>
      <div className="keywords-section">
        <div className="keywords">
          <h3>{title}의 키워드</h3>
          <div className="keywords-left">
            {keywords.slice(0, 3).map((keyword, index) => (
              <div key={index} className="keyword-item">
                {keyword ? (
                  <span>👫{keyword}</span>
                ) : (
                  <span># {index + 1}등 키워드</span>
                )}
              </div>
            ))}
          </div>
          <div className="keywords-right">
            {keywords.slice(3, 6).map((keyword, index) => (
              <div key={index} className="keyword-item">
                {keyword ? (
                  <span>👫{keyword}</span>
                ) : (
                  <span># {index + 4}등 키워드</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DummyReport;
