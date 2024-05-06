import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./pages/Loading";
import { Larak_System_URL } from "./globals";
import LoginPage from "./pages/Login";
import NoPage from "./pages/NoPage";
import ClientProductsPage from "./pages/client/products";
import ClientCartPage from "./pages/client/cart";
import ClientOrdersPage from "./pages/client/orders";
import ClientProfilePage from "./pages/client/profile";
import ClientCategoriesPage from "./pages/client/cateogries";
import ProductsCategoryPage from "./pages/client/products_category";
import ProductDetailsPage from "./pages/client/product_details";
import AllClientProductsPage from "./pages/client/all_products";
import SignUpPage from "./pages/SignUp";
import ClientProfileDetailsPage from "./pages/client/profileDetails";
import "leaflet/dist/leaflet.css";
import ManagerEmployeesPage from "./pages/client/managerEmployees";
import AddEmployeePage from "./pages/client/addEmployee";
import EmployeeDetailsPage from "./pages/client/employeeDetails";
import OrderDetailsPage from "./pages/client/order_details";
import ConfirmOrderPage from "./pages/client/confirm_order";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getSavedUserInLocalStorage() {
    setLoading(true);

    var token = localStorage.getItem("token") ?? "";

    if (token === null || token === "") {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    fetch(Larak_System_URL + "user-info/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          setLoggedIn(false);
          console.log(setLoggedIn);
          return;
        }
        setLoggedIn(true);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    getSavedUserInLocalStorage();
    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {isOnline ? (
        <div className="container-fluid" style={{ height: "100vh" }}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  loading ? (
                    <Loading />
                  ) : loggedIn ? (
                    <ClientProductsPage />
                  ) : (
                    <LoginPage />
                  )
                }
              />

              <Route
                path="/all_client_products"
                element={<AllClientProductsPage />}
              />
              <Route path="/client_products" element={<ClientProductsPage />} />
              <Route path="/product_details" element={<ProductDetailsPage />} />
              <Route path="/client_cart" element={<ClientCartPage />} />
              <Route
                path="/client_order_confirm"
                element={<ConfirmOrderPage />}
              />
              <Route path="/client_orders" element={<ClientOrdersPage />} />
              <Route
                path="/client_order_details"
                element={<OrderDetailsPage />}
              />
              <Route path="/client_profile" element={<ClientProfilePage />} />
              <Route
                path="/client_profile_details"
                element={<ClientProfileDetailsPage />}
              />
              <Route
                path="/client_cateogries"
                element={<ClientCategoriesPage />}
              />
              <Route
                path="/client_products_category"
                element={<ProductsCategoryPage />}
              />
              <Route
                path="/employees_list"
                element={<ManagerEmployeesPage />}
              />
              <Route
                path="/update_employee_password"
                element={<EmployeeDetailsPage />}
              />
              <Route path="/add_employee" element={<AddEmployeePage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign_up" element={<SignUpPage />} />

              <Route path="*" element={<NoPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <div
          className="container text-center text-danger border rounded  mt-4 d-flex"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: window.innerHeight,
          }}
        >
          <p> لايوجد اتصال انترنت </p>
        </div>
      )}
    </>
  );
}

export default App;
