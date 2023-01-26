import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (photoUrl) {
      fetch(process.env.REACT_APP_API_URL + "/api/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          photoUrl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [photoUrl]);

  const postDetails = () => {
    if (!title || !body || !image) {
      return toast.error("Please fill all required fields");
    }
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "surge-intern-test");
    data.append("cloud_name", "dp6yyczpu");
    fetch(process.env.REACT_APP_CLOUDINARY_URL, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPhotoUrl(data.secure_url);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="card gedf-card">
        <div className="card-body">
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="posts"
              role="tabpanel"
              aria-labelledby="posts-tab"
            >
              <div className="form-group">
                <input
                  className="form-control"
                  id="title"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  id="message"
                  rows={3}
                  placeholder="What are you thinking?"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
            </div>
          </div>
          <div className="btn-toolbar justify-content-between">
            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => postDetails()}
              >
                share
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
