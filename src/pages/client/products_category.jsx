import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/navbar";
import { Larak_System_URL } from "../../globals";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Loading from "../Loading";
function ProductsCategoryPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function loadData() {
    setLoading(true);
    console.log(location.state.d);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <NavBar />
      <div className="container-fluid text-center">
        <h3 className="p-3 ">
          <b> المنتجات </b>
        </h3>

        <div className="grid-container">
          {loading ? (
            <Loading />
          ) : (
            location.state.d.map((product) => (
              <div className="grid-item" key={product.id}>
                <div className="container">
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: "auto", height: "100px" }}
                  />
                </div>
                <br />
                <b className="border rounded m-2">{product.title}</b>
                {/* <br />
              <b>{product.category}</b> */}
                {/* <br /> */}
                {/* <b>{product.description}</b> */}
                <br />
                <b>
                  {product.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "IQD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </b>{" "}
                <br />
                {/* Add more product details here */}
                <div
                  className="btn btn-success"
                  onClick={() => {
                    if (window.cart === undefined) {
                      window.cart = [];
                    }
                    // Check if the item already exists in the cart
                    const existingItem = window.cart.find(
                      (cartItem) => cartItem.id === product.id
                    );

                    if (existingItem) {
                      // Item already exists, increase the quantity
                      existingItem.amount += 1;
                    } else {
                      // Item does not exist, add to cart with a quantity of 1
                      window.cart.push({ ...product, amount: 1 });
                    }

                    navigate("/client_products_cateogry", {
                      state: {
                        d: location.state.d,
                      },
                    });
                  }}
                >
                  {window.cart === undefined
                    ? 0
                    : window.cart.find((i) => i.id === product.id)?.amount ?? 0}
                  {"  "} اضافة للسلة
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ProductsCategoryPage;
