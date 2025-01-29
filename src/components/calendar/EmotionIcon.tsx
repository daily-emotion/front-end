const EmotionIcon = ({ emotion, onViewDiary }: { emotion: string, onViewDiary: () => void }) => {
  return <span onClick={onViewDiary}>{emotion}</span>;
};

export default EmotionIcon;
