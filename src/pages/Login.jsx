import { useState, React, useEffect } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { Larak_System_URL } from "../globals";

function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function checkIfUsernameAndPasswordIsCorrect() {
    setLoading(true);
    await fetch(Larak_System_URL + "login/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          return;
        }
        console.log(data);
        window.username = data.user.username;
        window.username_id = data.user.id;
        window.groups = data.user.groups[0];
        localStorage.setItem("token", data.access);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("username_id", data.user.id);
        localStorage.setItem("first_name", data.user.first_name);
        localStorage.setItem("last_name", data.user.last_name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("phone", data.user.phone);
        localStorage.setItem("user_type", data.user.user_type);

        // navigate("/home", { replace: true });
      })
      .catch((error) => {
        alert(error);
      });

    var token = localStorage.getItem("token");

    if (token === null || token === "") {
      return;
    }

    await fetch(Larak_System_URL + "categories/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          return;
        }
        console.log(data);

        // Convert the JSON object to a string
        var jsonString = JSON.stringify(data);

        // Save the string in the local storage with a specific key
        localStorage.setItem("categories", jsonString);

        navigate("/client_products", { replace: true });
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  if (loading) return <Loading />;

  return (
    <>
      <form
        style={{
          minHeight: window.innerHeight,
          display: "grid",
          alignItems: "center",
        }}
      >
        <div className="container p-4     text-center text-dark">
          <div
            className="container pt-4 pb-4 mb-4 rounded-circle"
            style={{ color: "#ff8000", fontSize: "50px" }}
          >
            <b>Larak</b>
          </div>
          <div className="row d-flex justify-content-center align-items-center p-4 m-1">
            <div className="col-md-6 m-1">
              <div className="container-fluid">
                <input
                  type="text"
                  className="form-control text-center"
                  style={{
                    backgroundColor: "#e6e6e6",
                    fontSize: "20px",
                    padding: "20px",
                  }}
                  id="email"
                  placeholder="أسم المستخدم"
                  name="email"
                  onChange={handleUsername}
                />
              </div>
            </div>

            <div className="col-md-6 m-1">
              <div className="container-fluid">
                <input
                  type="password"
                  className="form-control text-center"
                  style={{
                    backgroundColor: "#e6e6e6",
                    fontSize: "20px",
                    padding: "20px",
                    marginBottom: "20px",
                    marginTop: "20px",
                  }}
                  id="pwd"
                  placeholder="كلمة السر"
                  name="pswd"
                  onChange={handlePassword}
                />
              </div>
            </div>
            <hr />
          </div>

          <button
            className="btn   rounded-circle border border-1 p-4"
            style={{ color: "#ff8000", fontSize: "20px" }}
            onClick={() => {
              checkIfUsernameAndPasswordIsCorrect();
            }}
            onKeyDown={() => {
              checkIfUsernameAndPasswordIsCorrect();
            }}
          >
            <b style={{ fontWeight: "bold" }}> دخول</b>
          </button>
        </div>
      </form>
    </>
  );
}

export default LoginPage;
