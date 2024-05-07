import { useState, React, useEffect } from "react";
import Loading from "../Loading";
import { FormatDateTime, Larak_System_URL } from "../../globals";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { v4 as uuidv4 } from "uuid";

function EmployeeDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [password, setPassword] = useState("");

  async function updatePassword() {
    setLoading(true);
    await fetch(Larak_System_URL + "update_password/", {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        new_password: password,
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
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function clientOrders() {
    setLoading(true);

    await fetch(
      Larak_System_URL +
        "get_employee_orders_for_supervisor/" +
        location.state.username,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.detail === "Given token not valid for any token type") {
          navigate("/login", { replace: true });
          return;
        }

        console.log(data);
        if (data.detail) {
          alert(data.detail);
          return;
        }

        setData(data.results);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function updateOrder(order, status) {
    order.status[0].manager_status.accept = status;
    order.status[0].manager_status.manager = localStorage.getItem("supervisor");
    order.status[0].manager_status.date = new Date();

    console.log(order);

    setLoading(true);

    await fetch(Larak_System_URL + "update_order/" + order.id, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        status: order.status,
      }),
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

        navigate("/employees_list", { replace: true });

        setData(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function generateOrderId() {
    // Customize the prefix or length as needed
    const uniqueId = uuidv4().replace(/-/g, "").substring(0, 6); // Extract 6 characters from the UUID
    return String(uniqueId);
  }

  async function managerOrderItems(cart) {
    setLoading(true);

    let orderId = generateOrderId();

    let dataTosend = JSON.stringify({
      client: localStorage.getItem("username_id"),
      cart: cart,
      status: {
        vendor_status: null,
        biker_status: null,
        arrvied_status: null,
        decliened_status: null,
        client: {
          username: localStorage.getItem("username"),
          firstname: localStorage.getItem("first_name"),
          lastname: localStorage.getItem("last_name"),
          map_location: [
            localStorage.getItem("lon"),
            localStorage.getItem("lat"),
          ],
          text_location: localStorage.getItem("text_location"),
        },
      },

      order_id: orderId,
    });

    await fetch(Larak_System_URL + "client_submit_order/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: dataTosend,
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
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
    window.cart = undefined;
    setLoading(false);
    navigate("/client_orders", { replace: true });
  }

  async function updateEmployeeOrderStatus(order_id, status) {
    setLoading(true);

    let dataTosend = JSON.stringify({
      status: {
        manager_action: {
          title: status,
          date: new Date().now,
        },
      },
    });

    await fetch(Larak_System_URL + "update_employee_order/" + order_id, {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: dataTosend,
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
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
    window.cart = undefined;
    setLoading(false);
    navigate("/client_orders", { replace: true });
  }

  useEffect(() => {
    console.log(location.state);

    clientOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <NavBar />
      <div
        className="container text-center"
        style={{ color: "#ff8000", fontSize: "20px", marginTop: "20px" }}
      >
        <b> تحديث كلمة السر للمستخدم </b> <br />
        <div className="container ">
          <b> {location.state.username} </b>
        </div>
      </div>
      <form>
        <div
          className="container p-2 text-center text-dark d-flex"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            className="btn border rounded mt-2"
            style={{ color: "#ff8000", fontSize: "20px" }}
            onClick={() => {
              updatePassword();
            }}
          >
            <b style={{ fontWeight: "bold" }}> تحديث</b>
          </button>
          <div className="container">
            <input
              type="text"
              className="form-control text-center"
              style={{
                backgroundColor: "#e6e6e6",
                fontSize: "24px",
              }}
              id="pwd"
              placeholder=" كلمة السر الجديدة"
              name="pswd"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
        </div>
      </form>
      {loading ? (
        "loading"
      ) : (
        <div
          className="container-fluid"
          style={{ height: window.innerHeight / 2, overflowY: "auto" }}
        >
          <table className="table text-center">
            <thead style={{ fontSize: "20px" }}>
              <tr>
                <td>تاريخ الطلب</td>
                <td> </td>

                <td>السلة</td>
              </tr>
            </thead>
            <tbody style={{ fontSize: "16px" }}>
              {data?.reverse().map((d) => (
                <tr className="text-center">
                  <td>{FormatDateTime(d.created_at)}</td>
                  <td>
                    <button
                      className="btn btn-light text-success"
                      style={{ fontSize: "16px" }}
                      onClick={() => {
                        updateEmployeeOrderStatus(d.id, "accepted");
                        managerOrderItems(d.cart);
                      }}
                    >
                      <b>قبول</b>
                    </button>
                    <hr />
                    <button
                      className="btn btn-light text-danger"
                      style={{ fontSize: "16px" }}
                      onClick={() => {
                        updateEmployeeOrderStatus(d.id, "rejected");
                      }}
                    >
                      <b>رفض</b>
                    </button>
                  </td>

                  <td className="text-end">
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

export default EmployeeDetailsPage;
