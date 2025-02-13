import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RedirectHandler from './pages/redirectHandler';
import MainPage from './pages/MainPage';
import MainPage2 from './pages/MainPage2';
import DiaryDetail from './pages/viewDiaryPage';
import CreateDiary from './pages/createDiary';
import UpdateDiaryPage from './pages/updateDiary';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/oauth/callback" element={<RedirectHandler />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/main2" element={<MainPage2 />} />
        <Route path="/diaries/view/:date" element={<DiaryDetail />}/>
        <Route path="/diaries/new/:date" element={<CreateDiary />} />
        <Route path="/diaries/edit/:date" element={<UpdateDiaryPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
