import {
  emotions,
  Emotion,
  EmotionKey,
} from '../../constants/emotionConstants';

const EmotionIcon = ({
  date,
  emotion,
  onViewDiary,
}: {
  date: string;
  emotion: string;
  onViewDiary: (date: string) => void;
}) => {
  // emotion 문자열 상수 => 이모지
  const emoji = Object.keys(emotions).find(
    (key) => emotions[key as EmotionKey] === emotion
  ) as EmotionKey | undefined;

  if (!emoji) {
    return null;
  }

  return <span onClick={() => onViewDiary(date)}>{emoji}</span>;
};

export default EmotionIcon;
