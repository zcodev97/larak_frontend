import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { Larak_System_URL } from "../../globals";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Loading from "../Loading";
function ClientProductsPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve the string from the local storage
  var storedCategories = localStorage.getItem("categories");
  const [data, setData] = useState();

  const [categories, setCategories] = useState([]);

  async function loadCategories() {
    setLoading(true);
    await fetch(Larak_System_URL + "categories/", {
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

        setCategories(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
    loadCategories();
  }, []);
  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div
          className="container-fluid text-center"
          style={{
            float: "right",
            overflowY: "auto",
            height: window.innerHeight - 70,
          }}
        >
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-indicators bg-dark rounded">
              {data
                ?.filter((product) => product.on_banner)
                .map((product, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : ""}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
            </div>
            <div className="carousel-inner">
              {data
                ?.filter((product) => product.on_banner && product.active)
                .map((product, index) => (
                  <div
                    key={product.id}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
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
                      className="d-block w-100 rounded m-2"
                      src={product?.image}
                      alt={product?.title}
                      height={250}
                      width={250}
                    />
                  </div>
                ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon bg-dark rounded p-4"
                aria-hidden="true"
              />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon bg-dark rounded p-4"
                aria-hidden="true"
              />
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          {/* categories section */}
          <hr />

          <div className="container d-flex" style={{ overflowX: "auto" }}>
            {categories
              ?.filter((product) => product.on_home_screen && product.active)
              .map((item) => (
                <div className="container w-100" key={item.id}>
                  <div
                    className="container w-100  rounded mt-2  text-dark  "
                    onClick={() => {
                      let data = window.products?.filter(
                        (i) => i.category === item.title
                      );
                      navigate("/client_products_cateogry", {
                        state: {
                          d: data,
                        },
                      });
                    }}
                    style={{ backgroundColor: "#EF774C" }}
                  >
                    <div className="container text-center d-flex rounded p-3">
                      <b
                        className="text-center"
                        style={{
                          fontSize: "16px",
                          color: "#FFECDF",
                          fontWeight: "bold",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </b>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <hr />
          {/* products section */}
          <div
            className="container-fluid"
            style={{ height: window.innerHeight - 100, overflowY: "auto" }}
          >
            {data
              ?.filter((product) => product.on_home_screen)
              .map((product) => (
                <div className="container-fluid" key={product.id}>
                  <div className="container-fluid mb-2">
                    <div className="container-fluid d-flex">
                      <img
                        className="rounded"
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
                        src={product.image}
                        alt={product.title}
                        style={{ width: "25%", height: "50%" }}
                      />
                      <b
                        className="m-3 text-start"
                        style={{ fontSize: "16px" }}
                      >
                        {product.title.length > 16
                          ? product.title.substring(0, 16)
                          : product.title}
                        <br />
                        {product.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "IQD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}{" "}
                      </b>
                      <br />
                      <div className="container-fluid text-end">
                        <div
                          className="btn btn-light "
                          style={{
                            color: "#ff8000",
                            // border: "solid",
                            // borderWidth: "2px",
                          }}
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
                          <b style={{ fontSize: "20px" }}> + </b>
                        </div>
                        <b
                          className="m-4"
                          style={{
                            fontSize: "16px",

                            fontWeight: "bold",
                          }}
                        >
                          {window.cart === undefined
                            ? []
                            : window.cart.find((i) => i.id === product.id)
                                ?.amount ?? 0}
                        </b>
                        <div
                          className="btn btn-light"
                          style={{
                            color: "#ff8000",
                            // border: "solid",
                            // borderWidth: "2px",
                          }}
                          onClick={() => {
                            if (window.cart === undefined) {
                              window.cart = [];
                            }
                            // Check if the item already exists in the cart
                            const existingItem = window?.cart.find(
                              (cartItem) => cartItem.id === product.id
                            );

                            if (existingItem) {
                              if (existingItem.amount === 0) {
                              } else {
                                // Item already exists, increase the quantity
                                existingItem.amount -= 1;
                              }
                            }
                            navigate("/client_products", { replace: true });
                          }}
                        >
                          <b style={{ fontSize: "20px" }}> - </b>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ClientProductsPage;
