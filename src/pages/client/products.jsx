import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { Larak_System_URL } from "../../globals";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
function ClientProductsPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve the string from the local storage
  var storedCategories = localStorage.getItem("categories");

  const [data, setData] = useState([]);

  async function loadData() {
    setLoading(true);
    await fetch(Larak_System_URL + "client_products/", {
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

        window.products = data;

        setData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  // Parse the string into a JavaScript object
  var categoriesAsJson = JSON.parse(storedCategories);

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <NavBar />
      <div className="container-fluid text-center">
        <h3 className="p-3 ">
          <b> الصفحة الرئيسية </b>
        </h3>

        <div className="grid-container">
          {data.map((product) => (
            <div className="grid-item" key={product.id}>
              <div
                className="container"
                onClick={() => {
                  navigate("/product_details", {
                    state: {
                      id: product.id,
                      cateogry: product.cateogry,
                      image: product.image,
                      title: product.title,
                      description: product.description,
                      price: product.price,
                    },
                  });
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: "auto", height: "100px" }}
                />
                <br />
                <b className="mb-2">{product.title}</b>
                {/* <br />
              <b>{product.category}</b> */}
                {/* <br /> */}
                {/* <b>{product.description}</b> */}
                <br />
                <b className="mb-2">
                  {product.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "IQD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </b>{" "}
                <br />
              </div>

              {/* Add more product details here */}
              <div
                className="btn btn-warning"
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

                  navigate("/client_products", { replace: true });
                }}
              >
                {window.cart === undefined
                  ? ""
                  : window.cart.find((i) => i.id === product.id)?.amount ?? 0}
                {"  "} <b> + </b>
              </div>
              <div
                className="btn btn-warning"
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

                  navigate("/client_products", { replace: true });
                }}
              >
                {window.cart === undefined
                  ? 0
                  : window.cart.find((i) => i.id === product.id)?.amount ?? 0}
                {"  "} <b> - </b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ClientProductsPage;
