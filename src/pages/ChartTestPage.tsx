import { PieChart, Pie } from 'recharts';

const ChartTestPage = () => {
  const data = [
    { name: 'A', value: 30 },
    { name: 'B', value: 70 },
  ];

  return (
    <div>
      <h3>Test PieChart</h3>
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={50}
          fill="#8884d8"
        />
      </PieChart>
    </div>
  );
};

export default ChartTestPage;
