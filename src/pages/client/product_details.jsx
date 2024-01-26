import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/navbar";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Loading from "../Loading";

function ProductDetailsPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <NavBar />
      <div className="container-fluid text-center">
        <h3 className="p-3 ">
          <b> تفاصيل المنتج </b>
        </h3>

        <div className="container">
          <div className="container">
            <img
              className="rounded"
              src={location.state.image}
              style={{ width: "300px", height: "auto" }}
              alt=""
            />
          </div>
          <hr />
          <h3>{location.state.title}</h3>
          <br />
          <h3>{location.state.description}</h3>
          <hr />
          <h3>
            {location.state.price.toLocaleString("en-US", {
              style: "currency",
              currency: "IQD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </h3>
          <br />
          <div
            className="btn btn-warning"
            onClick={() => {
              if (window.cart === undefined) {
                window.cart = [];
              }
              // Check if the item already exists in the cart
              const existingItem = window.cart.find(
                (cartItem) => cartItem.id === location.state.id
              );

              if (existingItem) {
                // Item already exists, increase the quantity
                existingItem.amount += 1;
              } else {
                // Item does not exist, add to cart with a quantity of 1
                window.cart.push({ ...location.state, amount: 1 });
              }

              navigate("/product_details", {
                state: {
                  id: location.state.id,
                  cateogry: location.state.cateogry,
                  image: location.state.image,
                  title: location.state.title,
                  description: location.state.description,
                  price: location.state.price,
                },
                replace: true,
              });
            }}
          >
            {window.cart === undefined
              ? 0
              : window.cart.find((i) => i.id === location.state.id)?.amount ??
                0}
            <b> اضافة للسله</b>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailsPage;
