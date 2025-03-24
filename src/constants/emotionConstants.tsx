// 감정 표현 상수 및 타입 정의
export const emotions = {
  "😊": "HAPPINESS", // 행복
  "😢": "SADNESS", // 슬픔
  "😡": "ANGER", // 분노
  "😱": "FEAR", // 두려움
  "🤔": "INTEREST", // 관심
  "🫢": "SURPRISE", // 놀라움
  "😒": "DISGUST", // 혐오
  "😳": "SHAME", // 수치심
} as const;

// 감정 키(이모지) 타입
export type EmotionKey = keyof typeof emotions;

// 감정 값 (감정명) 타입
export type EmotionValue = typeof emotions[EmotionKey];

// Emotion은 감정 값만 저장
export type Emotion = EmotionValue;