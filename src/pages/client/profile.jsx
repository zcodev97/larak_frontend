import { useState } from "react";
import NavBar from "../../components/navbar";
import { useNavigate } from "react-router-dom";

function ClientProfilePage() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setLoading(true);
    localStorage.clear();
    setLoading(false);
    navigate("/login", { replace: true });
  }

  return (
    <>
      <NavBar />

      <div className="container-fluid">
        <p
          className=" pt-4  text-center "
          style={{ fontWeight: "normal", fontSize: "24px" }}
        >
          الملف الشخصي
        </p>
        <p
          className=" pt-4  text-center "
          style={{ fontWeight: "bold", fontSize: "20px" }}
        >
          <b>{localStorage.getItem("username")}</b>
        </p>
        <p
          className=" pt-4  text-center "
          style={{ fontWeight: "normal", fontSize: "20px" }}
        >
          {localStorage.getItem("user_type")}
        </p>
        <div className="container text-end   mt-2 mb-1">
          <div
            className="btn btn-light p-4"
            style={{
              fontSize: "20px",
              color: "#de3d33",
              fontWeight: "bold",
              display:
                localStorage.getItem("user_type") === "user" ? "none" : "block",
            }}
            onClick={() => {
              navigate("/client_profile_details");
            }}
          >
            تفاصيل المستخدم
          </div>
        </div>
        {/* <hr
        style={{
          display:
            localStorage.getItem("user_type") === "user" ? "none" : "block",
        }}
      /> */}
        <div className="container text-center   mt-2 mb-1">
          <div
            className="btn btn-light p-4"
            style={{
              fontSize: "20px",
              color: "#de3d33",
              fontWeight: "bold",
              display:
                localStorage.getItem("user_type") === "user" ? "none" : "block",
            }}
            onClick={() => {
              navigate("/employees_list");
            }}
          >
            الموظفين
          </div>
        </div>
        <div
          className="container text-center mt-4"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            position: "absolute",
            bottom: "0",
            left: "0",
            marginBottom: "80px",
          }}
        >
          {/* <div className="container  text-center p-4">
            {localStorage.getItem("user_type")}
          </div> */}

          <div
            className="container btn btn-danger text-light p-3"
            onClick={handleLogout}
            style={{ fontSize: "20px" }}
          >
            <b> خروج </b>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientProfilePage;
