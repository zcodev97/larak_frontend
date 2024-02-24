import { useState, useEffect, useRef } from "react";
import NavBar from "../../components/navbar";
import { useNavigate } from "react-router-dom";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { fromLonLat, transform } from "ol/proj";
import Circle from "ol/geom/Circle";

function MapComponent() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);

          localStorage.setItem("lon", position.coords.latitude);
          localStorage.setItem("lat", position.coords.longitude);

          const coords = [position.coords.longitude, position.coords.latitude];
          const circleFeature = new Feature(new Circle(fromLonLat(coords), 50));

          const vectorSource = new VectorSource({
            features: [circleFeature],
          });

          const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
              stroke: new Stroke({
                color: "blue",
                width: 3,
              }),
              fill: new Fill({
                color: "rgba(0, 0, 255, 0.1)",
              }),
            }),
          });

          map.addLayer(vectorLayer);
          map.getView().setCenter(fromLonLat(coords));
          map.getView().setZoom(15);
        },
        function (error) {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "rgba(255, 0, 0, 0.5)" }),
          stroke: new Stroke({ color: "red", width: 2 }),
        }),
      }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            //                  url: 'https://maps.dijlh.com/?z={z}&y={y}&x={x}&layer=streets',
            url: "https://{1-4}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=aWkeLP21AKVpB5R5JZ3I&app_code=tmLcVPJ_CRu8j1Uq_4Y-ag",

            //url: 'https://s3.eu-central-1.amazonaws.com/dijlh/tiles/streets/{z}/{y}/{x}.png',
            minZoom: 0,
            maxZoom: 20,
            crossOrigin: "anonymous",
          }),
          visible: true,
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([
          parseFloat(localStorage.getItem("lat")),
          parseFloat(localStorage.getItem("lon")),
        ]),
        zoom: 15,
      }),
    });

    const draw = new Draw({
      source: vectorSource,
      type: "Point",
      maxPoints: 1,
    });

    let feature = null; // declare a variable to store the drawn feature

    draw.on("drawend", function (event) {
      if (feature) {
        vectorSource.removeFeature(feature); // remove previous feature if it exists
      }

      feature = event.feature;
      const coords = feature.getGeometry().getCoordinates();
      const lonLatCoords = transform(coords, "EPSG:3857", "EPSG:4326"); // convert to lat/lon
      console.log("Selected point coordinates (lon/lat):", lonLatCoords);

      localStorage.setItem("lon", lonLatCoords[0]);
      localStorage.setItem("lat", lonLatCoords[1]);
    });

    map.addInteraction(draw);

    return () => {
      map.removeInteraction(draw);
      map.setTarget(null);
    };
  }, []);

  return (
    <div
      className="container rounded"
      ref={mapRef}
      style={{ width: window.innerWidth / 1.2, height: window.innerHeight / 2 }}
    ></div>
  );
}

function ClientProfileDetailsPage() {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState(false);
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);

  // async function submitUserInfo() {
  //   setLoading(true);
  //   await fetch(Larak_System_URL + "add_user/", {
  //     method: "POST",
  //     headers: {
  //       accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       username: phone,
  //       password: password,
  //       user_type: "639a74b7-3311-458d-aa3a-ba20eb5bf0c4",
  //       supervisor: "31dc0b00-85fd-49a1-9d4f-5a3345f5cb84",
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.detail) {
  //         alert(data.detail);
  //         return;
  //       }
  //       if (data.password) {
  //         alert(data.password);
  //         return;
  //       }

  //       navigate("/login", { replace: true });
  //     })
  //     .catch((error) => {
  //       alert(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }

  return (
    <>
      <NavBar />

      <p
        className=" pt-4  text-center "
        style={{ fontWeight: "bold", fontSize: "24px" }}
      >
        تفاصيل المستخدم
      </p>

      <div className="container-fluid">
        <div className="container-fluid">
          <input
            type="text"
            className="form-control text-center"
            style={{
              backgroundColor: "#e6e6e6",
              fontSize: "20px",
              padding: "20px",
            }}
            id="phone"
            placeholder="الاسم الاول"
            name="phone"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        </div>
        <hr />
        <div className="container-fluid">
          <input
            type="text"
            className="form-control text-center"
            style={{
              backgroundColor: "#e6e6e6",
              fontSize: "20px",
              padding: "20px",
            }}
            id="phone"
            placeholder="الاسم الاخير"
            name="phone"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </div>
        <hr />
        <div className="container-fluid">
          <input
            type="text"
            className="form-control text-center"
            style={{
              backgroundColor: "#e6e6e6",
              fontSize: "20px",
              padding: "20px",
            }}
            id="phone"
            placeholder="الموقع كتابتا"
            name="locaiton"
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </div>
        <hr />

        <div className="container mt-2 text-center">
          <div className="container p-2">
            <b> الموقع </b>
          </div>
        </div>

        <MapComponent />
      </div>
    </>
  );
}

export default ClientProfileDetailsPage;
