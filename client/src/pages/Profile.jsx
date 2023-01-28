import React, { useContext, useState } from "react";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { UserContext } from "../App";
import Post from "../components/Post";
import { Link, useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const user_id = location.pathname.split("/")[2];
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/api/getPostById/" + user_id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        // console.log(result);
      });
  }, [data]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/api/getUserById/" + user_id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result);
        // console.log(result)
      });
  }, [user]);

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="mt-4">
        <div className="container d-flex justify-content-center">
          <div className="col-9">
            <div className="row">
              <div className="col-8">
                {user_id == state?._id ? <CreatePost /> : ""}
                {/* START OF POSTS */}
                {data?.map((item) => {
                  return (
                    <Post
                      item={item}
                      state={state}
                      data={data}
                      setData={setData}
                      key={item._id}
                    />
                  );
                })}
                {/* END OF POSTS */}
              </div>
              <div className="col-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center border sidenav-profile-photo">
                    <img
                      src={user?.profilePic}
                      alt="..."
                      style={{
                        transform: "scale(1.5)",
                        width: "100%",
                        position: "absolute",
                        left: 0,
                      }}
                    />
                  </div>
                  <div className="profile-info ml-3 d-flex flex-column align-items-center">
                    <span className="profile-info-name">{user?.name}</span>
                    <span className="profile-info-username">
                      {user?.username}
                    </span>
                    {user_id == state?._id ? (
                    <Link className="btn btn-warning mt-2" to="/EditProfile">Edit Profile</Link>
                  ) : (
                    ""
                  )}
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
