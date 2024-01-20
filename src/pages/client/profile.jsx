import { useState } from "react";
import NavBar from "../../components/navbar";
import { useNavigate } from "react-router-dom";

function ClientProfilePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("last_name");
    localStorage.removeItem("first_name");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    setLoading(false);
    navigate("/login", { replace: true });
  }

  return (
    <>
      <NavBar />
      <div className="container text-center">
        <h1>تفاصيل المستخدم</h1>
        <h1>{localStorage.getItem("username")}</h1>
        <h1>{localStorage.getItem("first_name")}</h1>
        <h1>{localStorage.getItem("last_name")}</h1>
        <div className="btn btn-danger" onClick={handleLogout}>
          خروج
        </div>
      </div>
    </>
  );
}

export default ClientProfilePage;
