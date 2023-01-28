import React, { useState } from "react";
import moment from "moment";
import { toast } from "react-hot-toast";

const Post = ({ item, data, setData, state }) => {
  const [comment, setComment] = useState("");

  const deleteComment = (id) => {
    fetch(process.env.REACT_APP_API_URL + "/api/deletecomment/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        toast.success(result.message);
        const newData = data.filter((item) => {
          return item._id !== result;
        });
        setData(newData);
      });
  };

  const deletpost = (id) => {
    fetch(process.env.REACT_APP_API_URL + "/api/deletepost/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        toast.success(result.message);
        const newData = data.filter((item) => {
          return item._id !== result;
        });
        setData(newData);
      });
  };

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
        const newData = data
          .map((item) => {
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
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(data);
        const newData = data
          .map((item) => {
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

  const makeComment = (text, postId) => {
    fetch(process.env.REACT_APP_API_URL + "/api/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        toast.success(result.message);
        const newData = data
          .map((item) => {
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
    setComment("");
  };

  return (
    <>
      <div className="d-flex flex-column mt-4 mb-4">
        <div className="card">
          <div className="card-header p-3 d-flex flex-row align-items-center justify-content-between">
            <div className="d-flex flex-column align-items-start">
              <h5>{item.title}</h5>
              <p className="m-0">{item.body}</p>
            </div>
            <h5 className="text-danger">
              {item.postedBy?._id == state?._id ? (
                <i
                  className="bi bi-trash3-fill"
                  onClick={() => deletpost(item._id)}
                  style={{ cursor: "pointer" }}
                ></i>
              ) : (
                ""
              )}
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="embed-responsive embed-responsive-1by1">
              <img className="embed-responsive-item" src={item.photo} />
            </div>
            <div className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-center">
                <div className="btn p-0">
                  {item.likes?.includes(state._id) ? (
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
                <strong className="d-block pl-1">{item.likes?.length}</strong>
              </div>
              <strong className="d-block">{item.postedBy?.username}</strong>
              <small className="text-muted">
                {moment(item?.createdAt).startOf("second").fromNow()}
              </small>
            </div>
            {item.comments.length > 0 ? (
              <div className="p-3">
                <span className="text-muted">
                  View all {item.comments.length} comments
                </span>

                <div>
                  {item.comments.map((comment) => {
                    return (
                      <div className="d-flex align-items-center justify-content-between" key={comment._id}>
                        <div >
                          <strong className="d-block">
                            {comment.postedBy.username}
                          </strong>
                          <span>{comment.text}</span>
                        </div>
                        {comment.postedBy?._id == state?._id ? (
                          <i
                            className="bi bi-trash3-fill text-danger"
                            onClick={() => deleteComment(comment._id)}
                            style={{ cursor: "pointer" }}
                          ></i>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="position-relative comment-box">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-100 border-0 p-3 input-post"
                  placeholder="Add a comment..."
                />
                <button
                  className="btn btn-primary position-absolute btn-ig"
                  type="submit"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
