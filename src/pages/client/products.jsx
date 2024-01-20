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
  const columns = [
    {
      dataField: "amount",
      text: "الكمية المتوفرة",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "profit",
      text: "الربح",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "cost",
      text: "سعر الشراء",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "price",
      text: "سعر البيع",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "category",
      text: "الصنف",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "description",
      text: "تفاصيل المنتج",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "title",
      text: "الاسم",
      sort: true,
      filter: textFilter(),
    },
  ];

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/inner_legan_record_details", {
        state: {
          id: row.id,
          name: row.name,
          members: row.members,
          order_number: row.order_number,
          advices: row.advices,
          legna_steps: row.legna_steps,
          legna_date_end: row.legna_date_end,
        },
      });
    },
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 15,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
  });

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
          <b> المنتجات </b>
        </h3>

        <div className="grid-container">
          {data.map((product) => (
            <div className="grid-item" key={product.id}>
              <img
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
              />
              <br />
              <b className="border rounded m-2">{product.title}</b>
              <br />
              <b>{product.category}</b>
              <br />
              <b>{product.description}</b>
              <br />
              <b>
                {product.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "IQD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </b>{" "}
              <br />
              {/* Add more product details here */}
              <div
                className="btn btn-success"
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
                اضافة للسلة
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ClientProductsPage;
