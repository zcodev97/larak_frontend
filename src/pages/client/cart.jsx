import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormatDateTime, Larak_System_URL } from "../../globals";
import { v4 as uuidv4 } from "uuid";

function ClientCartPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState();

  function generateOrderId() {
    // Customize the prefix or length as needed
    const uniqueId = uuidv4().replace(/-/g, "").substring(0, 6); // Extract 6 characters from the UUID
    return String(uniqueId);
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
          className="container"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: window.innerHeight,
          }}
        >
          <p> اضف منتجات للسلة</p>
        </div>
      ) : (
        <div
          className="container-fluid"
          style={{ height: window.innerHeight - 85, overflowY: "auto" }}
        >
          <table className="table table-sm text-center">
            <thead style={{ fontSize: "16px", fontWeight: "bold" }}>
              <tr>
                <td> </td>

                <td> </td>
              </tr>
            </thead>
            <tbody style={{ fontSize: "16px" }}>
              {window.cart
                ?.filter((i) => i.amount !== 0 || i.amount < 0)
                .map((i) => (
                  <tr>
                    <td>
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="container d-flex justify-content-center align-items-center">
                          <p
                            onClick={() => {
                              navigate("/client_cart", { replace: true });
                              i.amount += 1;
                            }}
                            style={{
                              color: "#de3d33",
                              fontSize: "20px",
                            }}
                          >
                            {" "}
                            <i class="fi fi-rs-plus"></i>
                          </p>
                        </div>
                        <div className="container d-flex justify-content-center align-items-center">
                          <p>{i.amount}</p>
                        </div>

                        <div className="container">
                          <p
                            onClick={() => {
                              navigate("/client_cart", { replace: true });
                              if (i.amount === 1) {
                                let index = window.cart.findIndex(
                                  (x) => x.id === i.id
                                );
                                window.cart.splice(index, 1);
                              } else {
                                i.amount -= 1;
                              }
                            }}
                            style={{
                              color: "#de3d33",
                              fontSize: "20px",
                            }}
                          >
                            <i class="fi fi-rs-minuss"></i>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="container justify-content-end d-flex">
                        <div className="p-2 text-end">
                          <p>
                            {i.title?.length > 16
                              ? i.title.substring(0, 16)
                              : i.title}
                          </p>

                          <p>
                            {(i.price * i.amount).toLocaleString("en-US", {
                              style: "currency",
                              currency: "IQD",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <img
                          src={i.image}
                          alt={i.title}
                          style={{
                            alignItems: "center",
                            borderRadius: "20px",
                            boxShadow: "0px 2px 2px 2px #e6e6e6",
                            margin: "5px",
                            width: "60px",
                            height: "100px",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: '2px'
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="container text-center" style={{ fontSize: "20px" }}>
            <p>سعر السلة</p>
            {window.cart
              .map((i) => i.price * i.amount)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              )
              .toLocaleString("en-US", {
                style: "currency",
                currency: "IQD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
          </div>

          <div className="container text-center">
            <div
              className="btn btn-light rounded  text-danger"
              onClick={() => {
                navigate("/client_order_confirm");
                // if (window.confirm("هل متاكد للطلب!") == true) {
                //   orderItems();

                //   alert("تم الطلب بنجاح, سيتم التواصل معك");
                // } else {
                //   alert("تم الغاء العملية");
                // }
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
