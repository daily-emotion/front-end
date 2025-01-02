const EmotionIcon = ({ onViewDiary }: { onViewDiary: () => void }) => {
  const dailyEmotion = '😡';
  // const [dailyEmotion, setDailyEmotion] = useState('')

  /**
   * 일기가 있으면 dailyEmotion
   *
   */

  return <span onClick={onViewDiary}>{dailyEmotion}</span>;
};

export default EmotionIcon;
