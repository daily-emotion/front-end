// 감정 표현 상수 및 타입 정의
export const emotions = [
  "😊", // 행복
  "😢", // 슬픔
  "😡", // 분노
  "😱", // 두려움
  "🤔", // 관심
  "🫢", // 놀라움
  "😒", // 혐오
  "😳", // 수치심
] as const;

export type Emotion = typeof emotions[number];