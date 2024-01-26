import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";

function ClientCategoriesPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve the string from the local storage
  var storedCategories = localStorage.getItem("categories");

  // Parse the string into a JavaScript object
  var categoriesAsJson = JSON.parse(storedCategories);

  return (
    <>
      <NavBar />
      <div className="container ">
        {categoriesAsJson.map((item) => (
          <div className="container-fluid text-center">
            <div className="btn " key={item.id}>
              <div
                className="btn btn-warning"
                onClick={() => {
                  let data = window.products.filter(
                    (i) => i.category === item.title
                  );
                  navigate("/client_products_cateogry", {
                    state: {
                      d: data,
                    },
                  });
                }}
              >
                <div className="container">
                  <b> {item.title} </b>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ClientCategoriesPage;
