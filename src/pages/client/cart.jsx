import { useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Larak_System_URL } from "../../globals";

function ClientCartPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function orderItems() {
    setLoading(true);

    window.cart.map(async (i) => {
      await fetch(Larak_System_URL + "client_submit_order/", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: i.amount,
          status: {
            client_order: {
              date: Date.now(),
              location: "test",
            },
            admin_action: {},
            biker_action: {},
            order_recevied: "",
          },
          client: window.username_id,
          product: i.id,
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
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
    window.cart = undefined;
    setLoading(false);
    navigate("/client_orders", { replace: true });
  }

  return (
    <>
      <NavBar />
      {loading ? (
        "loading"
      ) : window.cart === undefined ? (
        <div className="container text-center mt-4">
          <h3> اضف منتجات للسلة</h3>
        </div>
      ) : (
        <div className="container-fluid">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <td>السعر</td>

                <td> </td>
                <td>الكمية</td>
                <td>المنتج</td>
                <td> </td>
              </tr>
            </thead>
            <tbody>
              {window.cart.map((i) => (
                <tr>
                  <td>
                    {(i.price * i.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className="btn bg-success text-light m-1"
                    onClick={() => {
                      navigate("/client_cart", { replace: true });
                      i.amount += 1;
                    }}
                  >
                    +
                  </td>
                  <td
                    className="btn bg-danger text-light m-1"
                    onClick={() => {
                      navigate("/client_cart", { replace: true });
                      i.amount -= 1;
                    }}
                  >
                    -
                  </td>
                  <td>{i.amount}</td>
                  <td>{i.title}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="container text-center">
            <div
              className="btn btn-success"
              onClick={() => {
                if (window.confirm("هل متاكد للطلب!") == true) {
                  orderItems();
                  alert("تم الطلب بنجاح, سيتم التواصل معك");
                } else {
                  alert("تم الغاء العملية");
                }
              }}
            >
              طلب
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientCartPage;
