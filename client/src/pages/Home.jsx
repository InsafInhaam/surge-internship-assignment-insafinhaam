import React, { useContext, useState } from "react";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import moment from "moment";
import { UserContext } from "../App";

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

  const likePost = (id) => {
    fetch(process.env.REACT_APP_API_URL + "/api/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
            if (item._id == result._id) {
              return result;
            } else {
              return item;
            }
          })
          .catch((err) => {
            console.error(err);
          });

        setData(newData);
      });
  };

  const unlikePost = (id) => {
    fetch(process.env.REACT_APP_API_URL + "/api/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(data);
        const newData = data.map((item) => {
            if (item._id == result._id) {
              return result;
            } else {
              return item;
            }
          })
          .catch((err) => {
            console.error(err);
          });

        setData(newData);
      });
  };

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
                {data.map((item) => {
                  return (
                    <div
                      className="d-flex flex-column mt-4 mb-4"
                      key={item._id}
                    >
                      <div className="card">
                        <div className="card-header p-3">
                          <div className="d-flex flex-column align-items-start">
                            <h5>{item.title}</h5>
                            <p>{item.body}</p>
                          </div>
                        </div>
                        <div className="card-body p-0">
                          <div className="embed-responsive embed-responsive-1by1">
                            <img
                              className="embed-responsive-item"
                              src={item.photo}
                            />
                          </div>
                          <div className="p-3 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-center">
                              <div className="btn p-0">
                                {item.likes.includes(state._id) ? (
                                  <i
                                    className="bi bi-heart-fill text-danger"
                                    onClick={() => unlikePost(item._id)}
                                  ></i>
                                ) : (
                                  <i
                                    className="bi bi-heart"
                                    onClick={() => likePost(item._id)}
                                  ></i>
                                )}
                              </div>
                              <strong className="d-block pl-1">
                                {item.likes?.length}
                              </strong>
                            </div>
                            <strong className="d-block">
                              {item.postedBy?.username}
                            </strong>
                            <small className="text-muted">
                              {moment(item?.createdAt)
                                .startOf("second")
                                .fromNow()}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <span className="profile-info-username">{state?.username}</span>
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
