import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Loading from "../pages/Loading";
import { useNavigate } from "react-router-dom";
import { Larak_System_URL } from "../globals";
import home from "./home.png";
import category from "./category.png";
import products from "./products.png";
import history from "./history.png";
import cart from "./cart.png";
import profile from "./profile.png";
// db password Qymbg5QhNbAzRn!

function NavBar() {
  const navigate = useNavigate();

  const [normalStyle, setnormalStyle] = useState("nav-link text-center");

  const [selectedItem, setSelectedItem] = useState("");

  const liClassName = " nav-item flex-grow-1 border rounded p-1 m-1 ";
  const liStyle = {
    color: "#ff8000",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const navItems = [
    { name: "Orders", path: "/client_products" },
    { name: "Categories", path: "/client_products" },
    { name: "Products", path: "/client_products" },
    { name: "Users", path: "/client_products" },
    { name: "Sub Users", path: "/client_products" },
    { name: "Bikers", path: "/client_products" },
    { name: "Invoices", path: "/client_products" },
  ];

  let clientNavBar = (
    <>
      <nav
        className="navbar navbar-expand-sm navbar-dark fixed-bottom "
        style={{
          marginTop: "-5px",
          marginBottom: "5px",
          marginLeft: "-10px",
          marginRight: "-5px",
          backgroundColor: "#FFECDF",
          height: "60px",
          borderRadius: "20px",
        }}
      >
        <div className="container-fluid d-flex justify-content-around">
          {/* Start of the navbar links */}
          <ul className="navbar-nav d-flex flex-row w-100">
            <li className="nav-item flex-grow-1 text-center m-0">
              <Link className={normalStyle} to="/client_products">
                <p style={{ color: "#ff8000" }}>
                  <img src={home} alt="" srcset="" width={30} />
                </p>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/all_client_products">
                <p style={{ color: "#ff8000" }}>
                  <img src={products} alt="" srcset="" width={30} />
                </p>
              </Link>
            </li>
            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_cateogries">
                <p style={{ color: "#ff8000" }}>
                  <img src={category} alt="" srcset="" width={30} />
                </p>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link
                className={normalStyle}
                to={
                  "/client_orders"
                  // window.groups === 5 ?

                  // "/admin_orders" :

                  // "/client_orders"
                }
              >
                <p style={{ color: "#ff8000" }}>
                  <img src={history} alt="" srcset="" width={30} />
                </p>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_cart">
                <p style={{ color: "#ff8000" }}>
                  <img src={cart} alt="" srcset="" width={30} />
                </p>
              </Link>
            </li>
            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_profile">
                <p style={{ color: "#ff8000" }}>
                  <img src={profile} alt="" srcset="" width={30} />
                </p>
              </Link>
            </li>
            {/* <li className="nav-item rounded text flex-grow-1 m-0">
          <Link className={normalStyle} to="/payments">
            <p>🚗</p>
            <b className="text-dark"> الكباتن</b>
          </Link>
        </li> */}

            {/* End of the logout button */}
          </ul>
          {/* End of the navbar links */}
        </div>
      </nav>

      <Outlet />
    </>
  );

  let adminNavBar = (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark">
        <div className="container-fluid d-flex justify-content-around">
          <ul className="navbar-nav d-flex flex-row w-100">
            {navItems.map((item) => (
              <li
                key={item.name}
                className={liClassName}
                onClick={() => setSelectedItem(item.name)}
              >
                <Link className={normalStyle} to={item.path}>
                  <p style={liStyle}>{item.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <Outlet />
    </>
  );

  return localStorage.getItem("usertype") === "admin"
    ? clientNavBar
    : adminNavBar;
}

export default NavBar;
