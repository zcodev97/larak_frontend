import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./pages/Loading";
import { Larak_System_URL } from "./globals";
import HomePage from "./pages/products/products";
import LoginPage from "./pages/Login";
import NoPage from "./pages/NoPage";
import CategoriesPage from "./pages/Categories";
import UsersPage from "./pages/users";
import ClientProductsPage from "./pages/client/products";
import ClientCartPage from "./pages/client/cart";
import ClientOrdersPage from "./pages/client/orders";
import ClientProfilePage from "./pages/client/profile";

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

              {/* clients */}
              <Route path="/client_products" element={<ClientProductsPage />} />
              <Route path="/client_cart" element={<ClientCartPage />} />
              <Route path="/client_orders" element={<ClientOrdersPage />} />
              <Route path="/client_profile" element={<ClientProfilePage />} />
              {/*  */}

              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/users" element={<UsersPage />} />

              <Route path="/login" element={<LoginPage />} />

              <Route path="*" element={<NoPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <div className="container text-center text-danger ">
          <h1> لايوجد اتصال انترنت</h1>
        </div>
      )}
    </>
  );
}

export default App;
