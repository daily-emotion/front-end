// 태그 상수 및 타입 정의
export const tags = [
  "대인관계",
  "결혼식",
  "여행",
  "운동",
  "독서",
  "회사",
] as const;
export type tag = typeof tags[number];