import React, { useState } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  const workshops = [
    { id: 1, name: "Demo Workshop 1", duration: 2 },
    { id: 2, name: "Demo Workshop 2", duration: 3 },
  ];

  function handleLogin() {
    setUser({ name: "Soham" });
    setPage("home");
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <div>
      {/* NAVBAR */}
      <div style={{ backgroundColor: "grey", color: "white", padding: "10px" }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("workshops")}>Workshops</button>

        {user ? (
          <>
            <span style={{ marginLeft: "10px" }}>Hello {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>Login</button>
        )}
      </div>

      {page === "home" && (
        <div style={{ padding: "20px" }}>
          <h1>Welcome to Workshop App</h1>
          <p>This is home page</p>
        </div>
      )}

      {page === "workshops" && (
        <div style={{ padding: "20px" }}>
          <h2>Workshop List</h2>

          {workshops.map((w) => (
            <div
              key={w.id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{w.name}</h3>
              <p>Duration: {w.duration} days</p>

              {user && (
                <button onClick={() => alert("Booked!")}>Book Workshop</button>
              )}
            </div>
          ))}
        </div>
      )}

      {page === "login" && (
        <div style={{ padding: "20px" }}>
          <h2>Login</h2>

          <input placeholder="Username" />
          <br />
          <br />
          <input type="password" placeholder="Password" />
          <br />
          <br />

          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
