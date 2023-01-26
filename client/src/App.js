import "./App.css";
import Login from "./pages/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer, initialState } from "./reducers/userReducer";
import Popup from "./components/Popup";

export const UserContext = createContext();

const Routing = () => {
  const history = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      history("/");
    } else {
      if(window.location.href == "http://127.0.0.1:3000/register" || window.location.href == "http://localhost:3000/register" ){
        history("/register");
      }else{
        history("/login");
      }
    }
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Popup />
      <Router>
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
