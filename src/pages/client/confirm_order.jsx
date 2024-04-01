import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormatDateTime, Larak_System_URL } from "../../globals";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { fromLonLat, transform } from "ol/proj";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Icon from "ol/style/Icon";
function MapComponent() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
      }),
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{1-4}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=aWkeLP21AKVpB5R5JZ3I&app_code=tmLcVPJ_CRu8j1Uq_4Y-ag",
            crossOrigin: "anonymous",
          }),
          visible: true,
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([
          parseFloat(44.3852922139959),
          parseFloat(33.32711910085179),
        ]),
        zoom: 15,
      }),
    });

    setMap(initialMap);

    return () => {
      if (initialMap) {
        initialMap.setTarget(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    getSavedLocation();

    const draw = new Draw({
      source: map.getLayers().array_[1].getSource(),
      type: "Point",
      maxPoints: 1,
    });

    draw.on("drawend", function (event) {
      const vectorSource = map.getLayers().array_[1].getSource();
      vectorSource.clear(); // Clear existing features before adding a new one
      const feature = event.feature;
      const coords = feature.getGeometry().getCoordinates();
      const lonLatCoords = transform(coords, "EPSG:3857", "EPSG:4326");
      console.log("Selected point coordinates (lon/lat):", lonLatCoords);
      localStorage.setItem("lon", lonLatCoords[0]);
      localStorage.setItem("lat", lonLatCoords[1]);
      // No need to manually add the feature, as it's already added by the Draw interaction
    });

    map.addInteraction(draw);

    return () => {
      map.removeInteraction(draw);
    };
  }, [map]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          const view = map.getView();
          view.setCenter(fromLonLat(coords));
          view.setZoom(15);

          const locationFeature = new Feature({
            geometry: new Point(fromLonLat(coords)),
          });
          const vectorSource = map.getLayers().array_[1].getSource();
          vectorSource.clear(); // Clear existing features before adding a new one
          vectorSource.addFeature(locationFeature); // Add the new location feature

          localStorage.setItem("lon", position.coords.longitude);
          localStorage.setItem("lat", position.coords.latitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true, // Request high accuracy
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const getSavedLocation = () => {
    const coords = [localStorage.getItem("lon"), localStorage.getItem("lat")];
    const view = map.getView();
    view.setCenter(fromLonLat(coords));
    view.setZoom(15);

    const locationFeature = new Feature({
      geometry: new Point(fromLonLat(coords)),
    });
    const vectorSource = map.getLayers().array_[1].getSource();
    vectorSource.clear(); // Clear existing features before adding a new one
    vectorSource.addFeature(locationFeature); // Add the new location feature
  };

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: window.innerWidth / 1.2,
          height: window.innerHeight / 2,
        }}
        className="container rounded"
      ></div>
      <div className="container text-center">
        <button
          className="btn p-2 mt-2 border rounded"
          onClick={getCurrentLocation}
          style={{
            fontSize: "20px",
            color: "#ff8000",
            fontWeight: "bold",
          }}
        >
          👆 موقعي الحالي
        </button>
      </div>
    </div>
  );
}

function ConfirmOrderPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState();

  function generateOrderId() {
    // Customize the prefix or length as needed
    const uniqueId = uuidv4().replace(/-/g, "").substring(0, 6); // Extract 6 characters from the UUID
    return String(uniqueId);
  }

  async function orderItems() {
    setLoading(true);

    let orderId = generateOrderId();

    let dataTosend = JSON.stringify({
      client: localStorage.getItem("username_id"),
      cart: window.cart,
      status: {
        client: {
          map_location: [
            localStorage.getItem("lon"),
            localStorage.getItem("lat"),
          ],
          text_location: localStorage.getItem("text_location"),
        },
      },

      order_id: orderId,
    });

    await fetch(Larak_System_URL + "client_submit_order/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: dataTosend,
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
    window.cart = undefined;
    setLoading(false);
    navigate("/client_orders", { replace: true });
  }

  useEffect(() => {
    setCart(window.cart);
  }, []);

  return (
    <>
      <NavBar />
      {loading ? (
        "loading"
      ) : window.cart?.length === 0 ||
        window.cart === undefined ||
        window.cart?.filter((i) => i.amount > 0).length === 0 ? (
        <div
          className="container"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: window.innerHeight,
          }}
        >
          <p> اضف منتجات للسلة</p>
        </div>
      ) : (
        <div
          className="container-fluid"
          style={{ height: window.innerHeight - 85, overflowY: "auto" }}
        >
          <div>
            <div className="container text-center mt-2 mb-2">
              <p style={{ fontSize: "24px" }}> تاكيد الطلب</p>
              <p style={{ fontSize: "24px" }}>
                {" "}
                {localStorage.getItem("text_location")}
              </p>

              <p style={{ fontSize: "24px" }}> موقعك الحالي </p>

              <p>
                <MapComponent />
              </p>
            </div>
            <table className="table table-sm text-center">
              <thead style={{ fontSize: "16px", fontWeight: "bold" }}>
                <tr>
                  <td> </td>

                  <td> </td>
                </tr>
              </thead>
              <tbody style={{ fontSize: "16px" }}>
                {window.cart
                  ?.filter((i) => i.amount !== 0 || i.amount < 0)
                  .map((i) => (
                    <tr>
                      <td>
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="container d-flex justify-content-center align-items-center">
                            <p
                              onClick={() => {
                                navigate("/client_order_confirm", {
                                  replace: true,
                                });
                                i.amount += 1;
                              }}
                              style={{
                                color: "#de3d33",
                                fontSize: "20px",
                              }}
                            >
                              <i class="fi fi-rs-plus"></i>
                            </p>
                          </div>
                          <div className="container d-flex justify-content-center align-items-center">
                            <p>{i.amount}</p>
                          </div>

                          <div className="container">
                            <p
                              onClick={() => {
                                navigate("/client_order_confirm", {
                                  replace: true,
                                });
                                if (i.amount === 1) {
                                  let index = window.cart.findIndex(
                                    (x) => x.id === i.id
                                  );
                                  window.cart.splice(index, 1);
                                } else {
                                  i.amount -= 1;
                                }
                              }}
                              style={{
                                color: "#de3d33",
                                fontSize: "20px",
                              }}
                            >
                              <i class="fi fi-rs-minuss"></i>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="container justify-content-end d-flex">
                          <div className="p-2 text-end">
                            <p>
                              {i.title?.length > 16
                                ? i.title.substring(0, 16)
                                : i.title}
                            </p>

                            <p>
                              {(i.price * i.amount).toLocaleString("en-US", {
                                style: "currency",
                                currency: "IQD",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>

                          <img
                            src={i.image}
                            alt={i.title}
                            style={{
                              alignItems: "center",
                              borderRadius: "20px",
                              boxShadow: "0px 2px 2px 2px #e6e6e6",
                              margin: "5px",
                              width: "25%",
                              height: "25%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="container text-center" style={{ fontSize: "20px" }}>
            <p>سعر السلة</p>
            {window.cart
              .map((i) => i.price * i.amount)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              )
              .toLocaleString("en-US", {
                style: "currency",
                currency: "IQD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
          </div>

          <div className="container text-center">
            <div
              className="btn btn-light rounded  text-danger"
              onClick={() => {
                orderItems();
              }}
              style={{ fontSize: "24px" }}
            >
              <b>طلب</b>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ConfirmOrderPage;
