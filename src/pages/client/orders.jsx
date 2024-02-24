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
        console.log(data);
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
        <div
          className="container-fluid"
          style={{ height: window.innerHeight - 85, overflowY: "auto" }}
        >
          <table className="table table-striped text-center">
            <thead style={{ fontSize: "16px" }}>
              <tr>
                <td>حالة الطلب</td>
                {/* <td>تاريخ الطلب</td> */}

                <td>السلة</td>
                <td>رقم الطلب</td>
              </tr>
            </thead>
            <tbody style={{ fontSize: "16px" }}>
              {data.reverse().map((i) => (
                <tr className="text-center">
                  <td>{Object.keys(i?.status[0])}</td>
                  {/* <td>{FormatDateTime(i.created_at)}</td> */}

                  <td className="text-end">
                    {i.cart?.map((i) => (
                      <div className="container d-flex text-end">
                        <p className="pr-2 text-end">{i.amount}</p>
                        <p>{i.title}</p>
                      </div>
                    ))}
                  </td>
                  <td>{i.order_id}</td>
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
