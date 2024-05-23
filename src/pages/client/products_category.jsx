import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/navbar";

import Loading from "../Loading";
function ProductsCategoryPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <NavBar />
      <div
        style={{
          marginTop: "10px",
          height: window.innerHeight - 85,
          overflowY: "auto",
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            {location.state.d?.filter((product) => product.active).map((product) => (
              <div
                key={product.id}
                style={{
                  alignItems: "center",
                  borderRadius: "20px",
                  boxShadow: "0px 2px 2px 2px #e6e6e6",
                }}
              >
                {/* image section */}
                <div
                  className="text-center"
                  style={{
                    marginTop: "5px",
                    padding: "10px",
                    height: "150px",
                    width: "auto",
                    backgroundImage: `url(${product.image})`,
                    backgroundPosition: "center",
                    backgroundSize: "150px",
                    backgroundRepeat: "no-repeat",
                    // borderRadius: "25px",
                  }}
                >
                  <div
                    style={{
                      height: "140px",
                      backgroundColor: "transparent",
                      padding: "5px",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <div className="bg-light rounded">
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

                          navigate("/client_products_category", {
                            state: {
                              d: location.state.d,
                            },
                            replace: true,
                          });
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
                          // navigate("/all_client_products", { replace: true });

                          navigate("/client_products_category", {
                            state: {
                              d: location.state.d,
                            },
                            replace: true,
                          });
                        }}
                      >
                        <b style={{ fontSize: "20px" }}> - </b>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="container text-center mt-4"
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
                  <p style={{ fontSize: "16px" }}>
                    {product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="m-3 text-center" style={{ fontSize: "16px" }}>
                    {product.title.length > 16
                      ? product.title.substring(0, 16)
                      : product.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ProductsCategoryPage;
