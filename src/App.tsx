import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import DiaryDetail from "./pages/viewDiaryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/view" element={<DiaryDetail date={"2025-1-14"} />} />
      </Routes>
    </Router>
  );
}

export default App;
