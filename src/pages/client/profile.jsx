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

      <p
        className=" pt-4  text-center "
        style={{ fontWeight: "bold", fontSize: "24px" }}
      >
        الاعدادات
      </p>
      <p
        className=" pt-4  text-center "
        style={{ fontWeight: "bold", fontSize: "20px" }}
      >
        <b>{localStorage.getItem("username")}</b>
      </p>

      <div className="container text-center border rounded mt-2 mb-1">
        <div
          className="btn"
          style={{
            fontSize: "20px",
            color: "#ff8000",
            fontWeight: "bold",
          }}
          onClick={() => {
            navigate("/client_profile_details");
          }}
        >
          تفاصيل المستخدم
        </div>
      </div>
      <hr />
      <div className="container text-center border rounded mt-2 mb-1">
        <div
          className="btn"
          style={{
            fontSize: "20px",
            color: "#ff8000",
            fontWeight: "bold",
          }}
        >
          الموظفين
        </div>
      </div>
      <hr />
      <div className="container text-center border rounded mt-2 mb-1">
        <div
          className="btn"
          style={{
            fontSize: "20px",
            color: "#ff8000",
            fontWeight: "bold",
          }}
        >
          طلبات الموطفين
        </div>
      </div>

      <div className="container text-center mt-4" style={{ fontSize: "20px" }}>
        <hr />

        <div className="container-fluid">
          <input
            type="text"
            className="form-control text-center"
            style={{
              backgroundColor: "#e6e6e6",
              fontSize: "20px",
              padding: "20px",
            }}
            id="location"
            placeholder="الموقع"
            name="location"
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </div>

        <div className="container  text-center p-4">
          Role : {localStorage.getItem("user_type")}
        </div>

        <div
          className="btn btn-light text-danger border border-danger p-3"
          onClick={handleLogout}
          style={{ fontSize: "20px" }}
        >
          خروج
        </div>
      </div>
    </>
  );
}

export default ClientProfilePage;