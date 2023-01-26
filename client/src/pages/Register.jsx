import React, { useEffect,useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const history = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const [loading, setLoading] = useState(false);


  const [token, setToken] = useState("")
  const reCaptcha = useRef();

  useEffect(() => {
    if (profilePic) {
      setLoading(true);
      fetch(process.env.REACT_APP_API_URL + "/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          profilePic,
          token
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.message);
            setLoading(false);
            history("/login");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [profilePic]);

  console.log(token)

  const handleSubmit = () => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!name || !email || !username || !password || !image) {
      return toast.error("Please fill all required fields");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return toast.error("Invalid email address");
    } else if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    } else if (!specialChars.test(password)) {
      return toast.error("Password must have special characters");
    }
    if(!token){
      return toast.error("You must verify the captcha");
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
        setProfilePic(data.secure_url);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-8 login-section-wrapper">
              <div className="login-wrapper my-auto">
                <h1 className="login-title">Register</h1>
                <form action="#!">
                  <div className="form-group">
                    <label htmlFor="username">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="form-control"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    <label htmlFor="password">Password</label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      className="form-control"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <ReCAPTCHA
                      ref={reCaptcha}
                      sitekey={process.env.REACT_APP_RECAPTCHA}
                      onChange={token => setToken(token)}
                      onExpired={e => setToken("")}
                    />
                  </div>
                  <input
                    name="login"
                    id="login"
                    className="btn btn-block login-btn"
                    type="button"
                    defaultValue={loading ? "Creating..." : "Signup"}
                    onClick={() => handleSubmit()}
                  />
                </form>
                <p className="login-wrapper-footer-text">
                  Already have an account?
                  <Link to="/login" className="text-reset">
                    login here
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

export default Register;
