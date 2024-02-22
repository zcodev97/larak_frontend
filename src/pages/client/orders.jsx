import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormatDateTime, Larak_System_URL } from "../../globals";

function ClientOrdersPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  async function clientOrders() {
    setLoading(true);

    await fetch(Larak_System_URL + "client_orders/", {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail === "Given token not valid for any token type") {
          navigate("/login", { replace: true });
          return;
        }
        if (data.detail) {
          alert(data.detail);
          return;
        }
        setData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    clientOrders();
  }, []);

  return (
    <>
      <NavBar />
      {loading ? (
        "loading"
      ) : (
        <div className="container-fluid">
          <table className="table table-striped text-center">
            <thead style={{ fontSize: "16px" }}>
              <tr>
                <td>تاريخ الطلب</td>

                <td>السلة</td>
              </tr>
            </thead>
            <tbody style={{ fontSize: "16px" }}>
              {data.reverse().map((i) => (
                <tr>
                  <td>{FormatDateTime(i.created_at)}</td>

                  <td>
                    {i.cart?.map((i) => (
                      <div className="cotnainer">{i.title}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default ClientOrdersPage;
