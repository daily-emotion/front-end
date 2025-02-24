import Report from '../components/report/Report';
import Header from '../components/common/Header';
import '../styles/pages/ReportPage.css';

const ReportPage = () => {
  // 현재 시간 (한국 기준)
  const now = new Date();
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9 적용

  // 이번 달 정보
  const thisYear = koreanTime.getFullYear();
  const thisMonth = koreanTime.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1

  // 지난 달 정보
  const lastYear = thisMonth === 1 ? thisYear - 1 : thisYear;
  const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;

  return (
    <>
      <Header />
      <div>
        <Report year={lastYear} month={lastMonth} title={`지난 달`} />
        <Report year={thisYear} month={thisMonth} title={`이번 달`} />
      </div>
    </>
  );
};

export default ReportPage;
