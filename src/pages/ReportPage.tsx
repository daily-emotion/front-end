import Report from '../components/report/Report';
import Header from '../components/common/Header';

const ReportPage = () => {
  // const [thisYear, setThisYear] = useState<number>(2025);
  // const [thisMonth, setThisMonth] = useState<number>(1);
  // const [lastYear, setLastYear] = useState<number>(2024);
  // const [lastMonth, setLastMonth] = useState<number>(12);

  return (
    <>
      <Header />
      <div>
        <Report isThisMonth={false} />
        <Report isThisMonth={true} />
      </div>
    </>
  );
};

export default ReportPage;
