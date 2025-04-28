import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// import SearchPage from "./pages/SearchPage";
import "./App.css";
import "./index.css";

function App() {
  return (
    <>
      <div>
        helloworld
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/search" element={<SearchPage />} /> */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
