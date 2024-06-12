import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home/Home";
import Login from "./screens/Login/Login";
import SignUp from "./screens/SignUp/SignUp";

const App = () => {
  const routes = (
    <Router>
      <Routes>
        <Route path="/dashboard" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signUp" exact element={<SignUp />} />
      </Routes>
    </Router>
  );
  return (

      <div>{routes}</div>

  );
};

export default App;
