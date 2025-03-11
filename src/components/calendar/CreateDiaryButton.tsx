import '../../styles/components/calendar/CreateDiaryButton.css';

const CreateDiaryButton = ({
  date,
  onGoToCreateDiary,
}: {
  date: string;
  onGoToCreateDiary: (date: string) => void;
}) => {
  return (
    <div className="createDiaryButton">
      <span onClick={() => onGoToCreateDiary(date)}>+</span>
    </div>
  ); // 추후 원 안에 + 들어간 icon으로 변경;
};

export default CreateDiaryButton;
