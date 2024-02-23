import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Larak_System_URL } from "../../globals";

function ClientCartPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState();

  async function orderItems() {
    setLoading(true);

    console.log(
      JSON.stringify({
        client: window.username_id,
      })
    );

    await fetch(Larak_System_URL + "client_submit_order/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        client: localStorage.getItem("username_id"),
        cart: window.cart,
        status: {
          client_order: {
            date: Date.now(),
            location: "test",
          },
        },
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
    window.cart = undefined;
    setLoading(false);
    navigate("/client_orders", { replace: true });
  }

  useEffect(() => {
    setCart(window.cart);
  }, []);

  return (
    <>
      <NavBar />
      {loading ? (
        "loading"
      ) : window.cart?.length === 0 ||
        window.cart === undefined ||
        window.cart?.filter((i) => i.amount > 0).length === 0 ? (
        <div
          className="container text-center mt-4"
          style={{ fontSize: "24px", fontWeight: "bold" }}
        >
          <p> اضف منتجات للسلة</p>
        </div>
      ) : (
        <div className="container-fluid">
          <table className="table table-striped text-center">
            <thead style={{ fontSize: "16px", fontWeight: "bold" }}>
              <tr>
                <td> </td>
                <td> </td>
                <td> </td>

                <td>السعر</td>

                <td>الكمية</td>
                <td>المنتج</td>
              </tr>
            </thead>
            <tbody style={{ fontSize: "16px" }}>
              {window.cart?.map((i) => (
                <tr>
                  <td
                    onClick={() => {
                      navigate("/client_cart", { replace: true });
                      i.amount += 1;
                    }}
                    style={{
                      color: "#ff8000",
                      fontSize: "24px",
                    }}
                  >
                    <b> +</b>
                  </td>
                  <td></td>
                  <td
                    onClick={() => {
                      navigate("/client_cart", { replace: true });
                      if (i.amount === 1) {
                        let index = window.cart.findIndex((x) => x.id === i.id);
                        window.cart.splice(index, 1);
                      } else {
                        i.amount -= 1;
                      }
                    }}
                    style={{
                      color: "#ff8000",
                      fontSize: "24px",
                    }}
                  >
                    <b> - </b>
                  </td>

                  <td>
                    {(i.price * i.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td>{i.amount}</td>
                  <td>
                    {i.title?.length > 16 ? i.title.substring(0, 16) : i.title}
                  </td>
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
              style={{ fontSize: "24px" }}
            >
              <b>طلب</b>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientCartPage;
