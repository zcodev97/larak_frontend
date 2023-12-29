import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./pages/Loading";
import { Larak_System_URL } from "./globals";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import NoPage from "./pages/NoPage";
import CategoriesPage from "./pages/Categories";
import NewCustomersPage from "./pages/NewCustomers";

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

  useEffect(() => {
    getSavedUserInLocalStorage();
  }, []);

  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loading ? <Loading /> : loggedIn ? <HomePage /> : <LoginPage />
            }
          />

          <Route path="/home" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/new_clients" element={<NewCustomersPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
