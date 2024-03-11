import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Loading from "../pages/Loading";
import { useNavigate } from "react-router-dom";
import { Larak_System_URL } from "../globals";

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
          // marginTop: "5px",
          marginBottom: "0px",
          paddingTop: "0px",
          marginLeft: "-10px",
          marginRight: "-5px",
          backgroundColor: "#de3d33",
          height: "60px",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <div className="container-fluid d-flex justify-content-around">
          {/* Start of the navbar links */}
          <ul className="navbar-nav d-flex flex-row w-100">
            <li className="nav-item flex-grow-1 text-center m-0">
              <Link className={normalStyle} to="/client_products">
                <p style={{ color: "white" }}>
                  <i class="fa fa-home fa-3x" aria-hidden="true"></i>
                </p>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/all_client_products">
                <p style={{ color: "white" }}>
                  <i class="fa fa-list fa-3x" aria-hidden="true"></i>
                </p>
              </Link>
            </li>
            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_cateogries">
                <p style={{ color: "white" }}>
                  <i class="fa fa-object-group fa-3x" aria-hidden="true"></i>
                </p>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to={"/client_orders"}>
                <p style={{ color: "white" }}>
                  <i class="fa fa-history fa-3x" aria-hidden="true"></i>
                </p>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_cart">
                <p style={{ color: "white" }}>
                  <i class="fa fa-shopping-cart fa-3x" aria-hidden="true"></i>
                </p>
              </Link>
            </li>
            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_profile">
                <p style={{ color: "white" }}>
                  <i class="fa fa-user fa-3x" aria-hidden="true"></i>
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

  return localStorage.getItem("user_type") === "admin"
    ? adminNavBar
    : clientNavBar;
}

export default NavBar;
