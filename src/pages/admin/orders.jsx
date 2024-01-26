import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { FormatDateTime, Larak_System_URL } from "../../globals";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
function AdminOrdersPage() {
  const columns = [
    {
      dataField: "created_at",
      text: " تاريخ الطلب",
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
      dataField: "amount",
      text: "الكمية",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "product",
      text: "المنتج",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "client",
      text: "العميل",
      sort: true,
      filter: textFilter(),
    },
  ];

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/admin_order_details", {
        state: {
          client: row.client,
          product: row.product,
          amount: row.amount,
          price: row.price,
          status: row.status,
          created_at: row.created_at,
        },
      });
    },
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 5,
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
    await fetch(Larak_System_URL + "client_orders/", {
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
        // console.log(data);
        data.map((i) => (i.created_at = FormatDateTime(i.created_at)));

        setData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <NavBar />
      <div className="container-fluid text-center">
        <h3 className="p-3 ">
          <b> الطلبات </b>
        </h3>

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
      </div>
    </>
  );
}

export default AdminOrdersPage;
