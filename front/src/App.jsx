import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes.jsx";

import "./App.css";
import RouteSeoWrapper from "./components/common/RouteSeoWrapper.jsx";

function App() {
  return (
    <Router>
      <RouteSeoWrapper />
      <AppRoutes />
    </Router>
  );
}

export default App;