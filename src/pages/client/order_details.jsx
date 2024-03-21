import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";

function OrderDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location.state);

  let x = location.state.cart?.map((i) => i.price * i.amount);

  let totalPrice = x.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return (
    <>
      <NavBar />
      <div
        className="container text-center d-flex justify-content-center align-items-center"
        style={{ fontSize: "20px", margin: "5px", padding: "5px" }}
      >
        <b className="p-2">{location.state.order_id}</b>

        <b className="p-2"> رقم الطلب</b>
      </div>

      <table className="table table-sm text-center rounded">
        <thead>
          <td>السعر</td>
          <td>الكمية</td>
          <td>المنتج</td>
        </thead>
        {location.state.cart?.map((i) => (
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

      <div className="container text-center" style={{ fontSize: "16px" }}>
        المبلغ الكلي
      </div>

      <div
        className="container text-center"
        style={{ fontSize: "20px", margin: "5px", padding: "5px" }}
      >
        {totalPrice.toLocaleString("en-US", {
          style: "currency",
          currency: "IQD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
      </div>
    </>
  );
}

export default OrderDetailsPage;
