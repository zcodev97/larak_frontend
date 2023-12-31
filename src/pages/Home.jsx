import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import { Larak_System_URL } from "../globals";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
function HomePage() {
  const columns = [
    {
      dataField: "title",
      text: "الاسم",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "description",
      text: "شرح",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "amount",
      text: "الكمية المتوفرة",
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
      dataField: "created_at",
      text: "تاريخ انشاء المنتج",
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
      dataField: "created_by",
      text: "منشأ المنتج",
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
    await fetch(Larak_System_URL + "products/", {
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
        console.log(data);
        data.map((i) => console.log((i.category = i.category.title)));

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadData();
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
        <>
          <NavBar />
          <div className="container-fluid text-center">
            <h1>Home Page</h1>

            <BootstrapTable
              hover={true}
              bordered={false}
              bootstrap4
              keyField="id"
              columns={columns}
              data={data}
              pagination={pagination}
              filter={filterFactory()}
              rowEvents={rowEvents}
            />
          </div>{" "}
        </>
      ) : (
        <div className="container text-center text-danger rounded ">
          {" "}
          <h1> No Internet Connection</h1>{" "}
        </div>
      )}
    </>
  );
}

export default HomePage;
