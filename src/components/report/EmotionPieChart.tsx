import { useEffect, useState } from 'react';

const EmotionPieChart = () => {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const calculateEmotionPercentages = () => {
      const total = Object.values(emotionCounts).reduce(
        (acc, count) => acc + count,
        0
      );

      if (total === 0) return {};
    };
  });

  return (
    <>
      <div className="progress-container">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={sortedStatDetails?.sortedTopEmotions || []} // 차트에 들어갈 데이터
              cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
              cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
              innerRadius={50} // 도넛 차트로 만들기 위한 내부 반지름
              outerRadius={70} // 외부 반지름 설정
              dataKey="value" // 데이터에서 'value' 값을 기준으로 크기 설정
              stroke="none"
              // paddingAngle={5} // 각 섹션 사이의 간격 추가
            >
              {sortedStatDetails?.sortedTopEmotions.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={emotionColors[Object.keys(entry)[0]]}
                />
              ))}
            </Pie>

            {/* 바깥쪽 원 */}
            <Pie
              data={sortedStatDetails?.sortedTopEmotions || []} // 차트에 들어갈 데이터
              cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
              cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
              innerRadius={70} // 도넛 차트로 만들기 위한 내부 반지름
              outerRadius={75} // 외부 반지름 설정
              dataKey="value" // 데이터에서 'value' 값을 기준으로 크기 설정
              stroke="none"
              // paddingAngle={5} // 각 섹션 사이의 간격 추가
            >
              {sortedStatDetails?.sortedTopEmotions.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.value === maxValue
                      ? lightenRGBA(emotionColors[Object.keys(entry)[0]], 0.2)
                      : 'rgba(0, 0, 0, 0)'
                  }
                />
              ))}
            </Pie>

            {/* 안쪽 원 */}
            <Pie
              data={sortedStatDetails?.sortedTopEmotions || []} // 차트에 들어갈 데이터
              cx="50%" // 차트를 컨테이너 중앙에 배치 (X축)
              cy="50%" // 차트를 컨테이너 중앙에 배치 (Y축)
              innerRadius={45} // 도넛 차트로 만들기 위한 내부 반지름
              outerRadius={50} // 외부 반지름 설정
              dataKey="value" // 데이터에서 'value' 값을 기준으로 크기 설정
              stroke="none"
              // paddingAngle={5} // 각 섹션 사이의 간격 추가
            >
              {sortedStatDetails?.sortedTopEmotions.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.value === maxValue
                      ? lightenRGBA(emotionColors[Object.keys(entry)[0]], 0.2)
                      : 'rgba(0, 0, 0, 0)'
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="progress-center-emotion">
          <img
            src={
              sortedStatDetails?.sortedTopEmotions?.[0]
                ? emotionIcons[
                    Object.keys(sortedStatDetails.sortedTopEmotions[0])[0]
                  ]
                : ''
            }
            alt="Emotion Icon"
          />
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
    </>
  );
};
