import { useState, React, useEffect } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { Larak_System_URL } from "../globals";

function SignUpPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser() {
    setLoading(true);
    await fetch(Larak_System_URL + "add_user/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: phone,
        password: password,
        user_type: "639a74b7-3311-458d-aa3a-ba20eb5bf0c4",
        supervisor: "31dc0b00-85fd-49a1-9d4f-5a3345f5cb84",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          return;
        }
        if (data.password) {
          alert(data.password);
          return;
        }

        navigate("/login", { replace: true });
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
          <div
            className="container pt-4 pb-4 mb-4 rounded-circle"
            style={{ color: "#ff8000", fontSize: "30px" }}
          >
            <b> تسجيل مستخدم جديد </b>
          </div>

          <div className="container-fluid">
            <input
              type="number"
              className="form-control text-center"
              style={{
                backgroundColor: "#e6e6e6",
                fontSize: "20px",
                padding: "20px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
              id="phone"
              placeholder=" رقم الهاتف"
              name="phone"
              onChange={(event) => {
                setPhone(event.target.value);
              }}
            />
          </div>

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
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>

          <button
            className="btn p-4"
            style={{ color: "#ff8000", fontSize: "20px" }}
            onClick={() => {
              if (phone.length !== 11) {
                alert("phone number must be 11 numbers");
                return;
              }
              registerUser();
            }}
            onKeyDown={() => {
              if (phone.length !== 11) {
                alert("phone number must be 11 numbers");
                return;
              }
              registerUser();
            }}
          >
            <b style={{ fontWeight: "bold" }}> تسجيل</b>
          </button>
          <br />

          <button
            className="btn p-4"
            style={{ color: "#ff8000", fontSize: "16px" }}
            onClick={() => {
              navigate("/login", { replace: true });
            }}
          >
            <b style={{ fontWeight: "normal" }}> لديك حساب </b>
          </button>
        </div>
      </form>
    </>
  );
}

export default SignUpPage;
