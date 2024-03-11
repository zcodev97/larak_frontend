function Loading() {
  return (
    <div
      className="container-flex"
      style={{
        height: window.innerHeight,
        color: "#ff8000",
        fontSize: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="spinner-grow"
        style={{ width: "10rem", height: "10rem" }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
