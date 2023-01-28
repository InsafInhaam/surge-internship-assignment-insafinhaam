import React, { useContext, useState } from "react";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { UserContext } from "../App";
import Post from "../components/Post";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/api/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        // console.log(result)
      });
  }, [data]);

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
                <CreatePost />
                {/* START OF POSTS */}
                {data?.map((item) => {
                  return (
                    <Post item={item} state={state} data={data} setData={setData}  key={item._id} />
                  );
                })}
                {/* END OF POSTS */}
              </div>
              <div className="col-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center border sidenav-profile-photo">
                    <img
                      src={state?.profilePic}
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
                    <span className="profile-info-name">{state?.name}</span>
                    <span className="profile-info-username">
                      {state?.username}
                    </span>
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

export default Home;
