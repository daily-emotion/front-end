const EmotionIcon = ({
  date,
  emotion,
  onViewDiary,
}: {
  date: string;
  emotion: string;
  onViewDiary: (date: string) => void;
}) => {
  return <span onClick={() => onViewDiary(date)}>{emotion}</span>;
};

export default EmotionIcon;
