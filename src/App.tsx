import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RedirectHandler from './pages/redirectHandler';
import MainPage from './pages/MainPage';
import MainPage2 from './pages/MainPage2';
import DiaryDetail from './pages/viewDiaryPage';
import CreateDiary from './pages/createDiary';
import UpdateDiaryPage from './pages/updateDiary';
import ReportPage from './pages/ReportPage';
import Header from './components/common/Header';
import DummyReportPage from './pages/DummyReportPage';
import ChartTestPage from './pages/ChartTestPage';

function Layout() {
  // 모든 경로 정보를 안정적으로 확인하기 위함
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' &&
        location.pathname !== '/oauth/callback' &&
        location.pathname !== '/dummyreport' && <Header />}
      <div className="content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/oauth/callback" element={<RedirectHandler />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/main2" element={<MainPage2 />} />
          <Route path="/diaries/view/:date" element={<DiaryDetail />} />
          <Route path="/diaries/new/:date" element={<CreateDiary />} />
          <Route path="/diaries/edit/:date" element={<UpdateDiaryPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/charttest" element={<ChartTestPage />} />
          <Route path="/dummyreport" element={<DummyReportPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
