import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PasswordPage from "./pages/PasswordPage";
import HomePage from "./pages/HomePage.jsx";
import NoahsPage from "./pages/NoahsPage.jsx";
import FormPage from "./pages/FormPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/password" element={<PasswordPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/noahspage" element={<NoahsPage />} />
          <Route path="/rsvp" element={<FormPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
