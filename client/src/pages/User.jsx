import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/api/alluser", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUsers(result);
      });
  }, [users]);

  return (
    <>
      <Navbar />

      <div className="container pt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="people-nearby">
              {users?.map((user) => {
                return (
                  <div className="nearby-user">
                    <div className="row">
                      <div className="col-md-2 col-sm-2">
                        <img
                          src={user.profilePic}
                          alt={user.username}
                          className="profile-photo-lg"
                        />
                      </div>
                      <div className="col-md-7 col-sm-7">
                        <h5>
                          <Link to={"/profile/"+user._id} className="profile-link">
                            {user.username}
                          </Link>
                        </h5>
                        <p>{user.name}</p>
                        {/* <p className="text-muted">{user.username}</p> */}
                      </div>
                      <div className="col-md-3 col-sm-3">
                        <button className="btn btn-primary pull-right">
                          Add Friend
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
