import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { FormatDateTime, Larak_System_URL } from "../../globals";
function AdminOrderDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // weapon types drop down menu
  const [selectedBiker, setSelectedBiker] = useState("");

  const [bikerDropDownMenu, setBikersDropDownMenu] = useState([]);
  let dropdownBikersTemp = [];

  async function loadBikers() {
    setLoading(true);
    var token = localStorage.getItem("token");

    fetch(Larak_System_URL + "bikers/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.detail) {
          alert(response.detail);
          setLoading(false);
        }

        console.log(response);

        response.forEach((item) => {
          dropdownBikersTemp.push({
            label: item.username,
            value: item.id,
          });
        });
        setBikersDropDownMenu(dropdownBikersTemp);
      });

    setLoading(false);
  }

  async function updateOrder() {
    setLoading(true);

    await fetch(Larak_System_URL + "client_submit_order/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        status: {
          client_order: {
            date: location.state.created_at,
            location: location.state.client_order.location,
          },
          admin_action: {
            order_accepted_date: Date.now(),
            action: "accepted",
            selected_biker: selectedBiker,
          },
          biker_action: {},
          order_recevied: "",
        },
      }),
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
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });

    navigate("/admin_orders", { replace: true });
  }

  useEffect(() => {
    console.log(location.state.status);
    loadBikers();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container text-center mt-4">
        <h2> {location.state.client} </h2>
        <hr />
        <p>اسم المنتج</p>
        <h3>{location.state.product}</h3>
        <p> الكمية</p>
        <h3>{location.state.amount}</h3>
        <p> السعر</p>
        <h3>
          {location.state.price.toLocaleString("en-US", {
            style: "currency",
            currency: "IQD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </h3>
        <div className="container border rounded p-3">
          <p>تاريخ الطلب</p>
          <p>{FormatDateTime(location.state.status?.client_order?.date)}</p>
          <p> موقع الطلب</p>
          <p>{location.state.status.client_order?.location}</p>
        </div>
        <hr />
        <p> اختيار السائق</p>
        <div className="container">
          <Select
            defaultValue={selectedBiker}
            options={bikerDropDownMenu}
            onChange={(opt) => setSelectedBiker(opt.value)}
            placeholder={"اختار السائق"}
          />
        </div>

        <div className="btn btn-success m-2">قبول الطلب</div>

        <div className="btn btn-danger m-2">رفض الطلب</div>
      </div>
    </>
  );
}

export default AdminOrderDetailsPage;
