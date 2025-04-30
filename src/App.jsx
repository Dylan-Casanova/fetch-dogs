import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import "./App.css";
import "./index.css";

const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AppWithNavbar />
    </Router>
  );
}

function AppWithNavbar() {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/search" || location.pathname === "/favorites" ? (
        <Navbar />
      ) : null}

      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;