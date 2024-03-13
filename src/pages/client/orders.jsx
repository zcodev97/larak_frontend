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
            <thead style={{ fontSize: "20px" }}>
              <tr>
                <td> </td>
              </tr>
            </thead>
            <tbody style={{ fontSize: "16px" }}>
              {data.reverse().map((d) => (
                <tr
                  className="text-center"
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0px 1px 2px 2px #e6e6e6",
                    margin: "5px",
                  }}
                >
                  {/* <td className="text-end">
                    <table className="table rounded">
                      <thead>
                        <td>السعر</td>
                        <td>الكمية</td>
                        <td>المنتج</td>
                      </thead>
                      {d.cart?.map((i) => (
                        <tbody>
                          <tr>
                            <td>
                              <b>
                                {(i.price * i.amount).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "IQD",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </b>
                            </td>
                            <td>
                              <b>
                                {" "}
                                <b className="pr-2 text-center">{i.amount}</b>
                              </b>
                            </td>
                            <td>
                              <b>{i.title}</b>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </td> */}
                  <td className="text-end">
                    <b> {d.order_id} </b> رقم الطلب
                    <p>{FormatDateTime(d.created_at)}</p>
                    <p>
                      {d?.status[0]?.manager_status !== undefined
                        ? d?.status[0]?.manager_status.accept
                        : d?.status[0]?.vendor_status.accept}
                      {" : "} حالة الطلب
                    </p>
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
