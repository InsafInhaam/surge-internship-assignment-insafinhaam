import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./../App";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useNavigate();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container justify-content-center">
          <div className="d-flex flex-row justify-content-between align-items-center col-9">
            <Link className="navbar-brand" href="/">
              <h1 className="">Surge</h1>
            </Link>
            <div className="d-flex flex-row">
              <ul className="list-inline m-0">
                <li className="list-inline-item">
                  <a
                    href=""
                    className="link-menu"
                    onClick={() => {
                      localStorage.clear();
                      dispatch({ type: "CLEAR" });
                      history("/login");
                    }}
                  >
                    <p>Logout</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
