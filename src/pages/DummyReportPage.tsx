import DummyReport from '../components/report/DummyReport';
import '../styles/pages/DummyReportPage.css';

const DummyReportPage = () => {
  const prevMonthData = {
    title: '저번달',
    date: '2024. 12. 01~12.31',
    happyDays: 10,
    sadDays: 8,
    neutralDays: 6,
    keywords: ['인간관계', '감정', '행복'],
  };

  const currentMonthData = {
    title: '이번달',
    date: '2024. 01. 01~01.31',
    happyDays: 12,
    sadDays: 5,
    neutralDays: 4,
    keywords: ['소통', '기쁨', '스트레스'],
  };

  return (
    <div className="container">
      <div className="card-wrapper">
        <DummyReport {...prevMonthData} />
        <DummyReport {...currentMonthData} />
      </div>
    </div>
  );
};

export default DummyReportPage;
