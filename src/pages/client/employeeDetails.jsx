import { useState, React, useEffect } from "react";
import Loading from "../Loading";
import { Larak_System_URL } from "../../globals";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormatDateTime } from "../../globals";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
function EmployeeDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [password, setPassword] = useState("");

  async function updatePassword() {
    setLoading(true);
    await fetch(Larak_System_URL + "update_password/", {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        new_password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          return;
        }
        if (data.password) {
          alert(data.password);
          return;
        }

        console.log(data);

        navigate("/employees_list", { replace: true });
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function clientOrders() {
    setLoading(true);

    await fetch(
      Larak_System_URL + "employee_orders/" + location.state.username,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
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

        setData(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const columns = [
    {
      dataField: "username",
      text: "اسم المستخدم",
      sort: true,
      filter: textFilter(),
    },
  ];

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/update_employee_password", {
        state: {
          id: row.id,
          username: row.username,
          date_joined: row.date_joined,
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

  useEffect(() => {
    clientOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <NavBar />
      <div
        className="container text-center"
        style={{ color: "#ff8000", fontSize: "20px", marginTop: "20px" }}
      >
        <b> تحديث كلمة السر للمستخدم </b> <br />
        <div className="container border rounded">
          <b> {location.state.username} </b>
        </div>
      </div>
      <form>
        <div
          className="container p-2     text-center text-dark d-flex"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            className="btn border rounded mt-2"
            style={{ color: "#ff8000", fontSize: "20px" }}
            onClick={() => {
              updatePassword();
            }}
          >
            <b style={{ fontWeight: "bold" }}> تحديث</b>
          </button>
          <div className="container">
            <input
              type="text"
              className="form-control text-center"
              style={{
                backgroundColor: "#e6e6e6",
                fontSize: "24px",
              }}
              id="pwd"
              placeholder=" كلمة السر الجديدة"
              name="pswd"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
        </div>
      </form>
      {loading ? (
        "loading"
      ) : (
        <div
          className="container-fluid"
          style={{ height: window.innerHeight / 2, overflowY: "auto" }}
        >
          <table className="table text-center">
            <thead style={{ fontSize: "20px" }}>
              <tr>
                <td>حالة الطلب</td>
                {/* <td>تاريخ الطلب</td> */}

                <td>السلة</td>
                <td>رقم الطلب</td>
              </tr>
            </thead>
            <tbody style={{ fontSize: "16px" }}>
              {data?.reverse().map((d) => (
                <tr className="text-center">
                  <td>{Object.keys(d?.status[0])}</td>
                  {/* <td>{FormatDateTime(i.created_at)}</td> */}

                  <td className="text-end">
                    <table className="table rounded">
                      <thead>
                        <td>السعر</td>
                        <td>الكمية</td>
                        <td>المنتج</td>
                      </thead>
                      {d.cart?.map((i) => (
                        <tbody>
                          <tr>
                            <td>
                              <b>
                                {(i.price * i.amount).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "IQD",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </b>
                            </td>
                            <td>
                              <b>
                                {" "}
                                <b className="pr-2 text-center">{i.amount}</b>
                              </b>
                            </td>
                            <td>
                              <b>{i.title}</b>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </td>
                  <td>
                    <b> {d.order_id} </b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default EmployeeDetailsPage;
