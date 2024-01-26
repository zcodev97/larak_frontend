import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Loading from "../pages/Loading";
import { useNavigate } from "react-router-dom";
import { Larak_System_URL } from "../globals";

// db password Qymbg5QhNbAzRn!

function NavBar() {
  const navigate = useNavigate();

  const [normalStyle, setnormalStyle] = useState(
    "nav-link text-dark text-center bg-light m-0 border-end border-2"
  );

  return (
    <>
      <nav
        className="navbar navbar-expand-sm navbar-dark fixed-bottom"
        style={{
          marginTop: "-5px",
          marginBottom: "-12px",
          marginLeft: "-12px",
          marginRight: "-10px",
        }}
      >
        <div
          className="container-fluid d-flex justify-content-around"
          style={{ marginTop: "20px" }}
        >
          {/* Start of the navbar links */}
          <ul className="navbar-nav d-flex flex-row w-100">
            <li className="nav-item flex-grow-1 text-center m-0">
              <Link className={normalStyle} to="/client_products">
                <p>🏠</p>
                <b className="text-dark">الصفحة الرئيسية</b>
              </Link>
            </li>

            {/* <li className="nav-item rounded flex-grow-1 m-0">
              <Link className={normalStyle} to="/users">
                <p>🧑‍🦲</p>
                <b className="text-success"> المستخدمين</b>
              </Link>
            </li> */}

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_cateogries">
                <p>🦪</p>
                <b className="text-danger"> التصنيفات</b>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link
                className={normalStyle}
                to={window.groups === 5 ? "/admin_orders" : "/client_orders"}
              >
                <p>🚗</p>
                <b className="text-dark"> الطلبات</b>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_cart">
                <p>🛒</p>
                <b className="text-dark"> السلة</b>
              </Link>
            </li>
            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/client_profile">
                <p>🧑‍🦲</p>
                <b className="text-dark"> الملف</b>
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
}

export default NavBar;
