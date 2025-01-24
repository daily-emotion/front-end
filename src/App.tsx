import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import DiaryDetail from "./pages/viewDiaryPage";
import CreateDiary from "./pages/createDiary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/view" element={<DiaryDetail date={"2025-1-14"} />} />
        <Route path="/diaries/new/:date" element={<CreateDiary />} />
        {/* <Route path="/diaries/edit/:date" element={<CreateDiary />} />   */}
        {/* <Route path="/diaries/view/:date" element={<CreateDiary />} />  */}
      </Routes>
    </Router>
  );
}

export default App;
