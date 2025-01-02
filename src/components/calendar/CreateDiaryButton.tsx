const CreateDiaryButton = ({
  onGoToCreateDiary,
}: {
  onGoToCreateDiary: () => void;
}) => {
  return (
    <span onClick={onGoToCreateDiary}>+</span>
    // 추후 원 안에 + 들어간 icon으로 변경
  );
};

export default CreateDiaryButton;
