import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormatDateTime, Larak_System_URL } from "../../globals";
import Loading from "../Loading";

function ClientOrdersPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  async function managerOrders() {
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
        // console.log(data);
        setData(data.results);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  async function userOrders() {
    setLoading(true);

    await fetch(Larak_System_URL + "get_employee_orders/", {
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

        setData(data.results);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    localStorage.getItem("user_type") === "user"
      ? userOrders()
      : managerOrders();
  }, []);

  return (
    <>
      <NavBar />
      {loading ? (
        <Loading />
      ) : (
        <div
          className="container-fluid"
          style={{
            height: window.innerHeight - 85,
            overflowY: "auto",
          }}
        >
          <table
            className="table text-center"
            style={{
              borderCollapse: "separate",
              borderSpacing: "0 15px",
            }}
          >
            <tbody style={{ fontSize: "16px" }}>
              {data.reverse().map((d) => (
                <tr
                  className="text-center"
                  style={{
                    borderTop: "0px",
                    borderRadius: "10px",
                    boxShadow: "4px 4px 4px  #e6e6e6",
                    margin: "5px",
                  }}
                  onClick={() => {
                    navigate("/client_order_details", { state: d });
                  }}
                >
                  <td className="text-end">
                    <p>{d.order_id}</p>
                    <p>{FormatDateTime(d.created_at)}</p>
                    {localStorage.getItem("user_type") === "user" ? (
                      <b className="m-1">
                        {d?.status?.manager_action === null
                          ? "قيد موافقة المدير"
                          : d?.status?.manager_action?.title === "accepted"
                          ? "تمت الموافقة"
                          : "مرفوض"}
                      </b>
                    ) : (
                      <b className="m-1">
                        {d?.status?.arrived_status
                          ? "تم التوصيل"
                          : d?.status?.biker_status?.biker
                          ? "قيد الشحن"
                          : d?.status?.vendor_status?.title
                          ? "في انتظار تعيين سائق"
                          : "قيد الموافقة"}
                      </b>
                    )}
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
