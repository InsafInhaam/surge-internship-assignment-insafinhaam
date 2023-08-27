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
            <Link className="navbar-brand" to="/">
              <h1 className="logo-title">Surge</h1>
            </Link>
            <div className="d-flex flex-row">
              <ul className="list-inline m-0">
                <li className="list-inline-item pr-3">
                  <a href="/user" className="link-menu">
                    Users
                  </a>
                </li>
                <li className="list-inline-item pr-5">
                  <a href={"/profile/" + state?._id} className="link-menu">
                    Profile
                  </a>
                </li>
                <li className="list-inline-item">
                  <a
                    href=""
                    className="btn btn-danger"
                    onClick={() => {
                      localStorage.clear();
                      dispatch({ type: "CLEAR" });
                      history("/login");
                    }}
                  >Logout
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