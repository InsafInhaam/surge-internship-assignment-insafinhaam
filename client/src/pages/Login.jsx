import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../App";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const handleSubmit = () => {
    if (!username && !emailRegex.test(email)) {
      toast.error("Please enter a valid username or email address");
      return;
    }
    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    if (!token) {
      toast.error("Yoou must verify the captcha");
      return;
    }

    fetch(process.env.REACT_APP_API_URL + "/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          toast.success(data.message);
          history("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-8 login-section-wrapper">
              <div className="login-wrapper my-auto">
                <h1 className="login-title">Log in</h1>
                <form action="#!">
                  <div className="form-group">
                    <label htmlFor="email">Email or Username</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email or username"
                      value={username || email}
                      onChange={(e) => {
                        if (e.target.value.indexOf("@") === -1) {
                          setUsername(e.target.value);
                          setEmail("");
                        } else {
                          setEmail(e.target.value);
                          setUsername("");
                        }
                      }}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      placeholder="Enter your passsword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <ReCAPTCHA
                      sitekey={process.env.REACT_APP_RECAPTCHA}
                      onChange={(token) => setToken(token)}
                      onExpired={(e) => setToken("")}
                    />
                  </div>

                  <input
                    name="login"
                    id="login"
                    className="btn btn-block login-btn"
                    type="button"
                    defaultValue="Login"
                    onClick={() => handleSubmit()}
                  />
                </form>
                <p className="login-wrapper-footer-text">
                  Don't have an account?
                  <Link to="/register" className="text-reset">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
            <div className="col-sm-4 px-0 d-none d-sm-block">
              <div className="login-page-details">
                <div className="login-surge">
                  <h1 className="surge">Surge SE Internship</h1>
                  <h1>March 2023</h1>
                  <br />
                  <br />
                  <h3 className="insaf">Insaf Inhaam</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
