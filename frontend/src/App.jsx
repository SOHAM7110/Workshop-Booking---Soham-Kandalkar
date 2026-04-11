import { useState } from "react";

/* ---------- BUTTON ---------- */

function GlassButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn-glass text-sm font-medium flex items-center justify-center"
    >
      {children}
    </button>
  );
}

/* ---------- NAVBAR ---------- */

function Navbar({ user, setPage, handleLogout }) {
  return (
    <div className="flex justify-between items-center px-10 py-4 relative overflow-hidden bg-[#0f172a] border-b border-white/10 backdrop-blur-md">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

      {/* Blue Glow Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.25),transparent_70%)]"></div>

      <h1 className="text-xl font-semibold tracking-wide text-white relative z-10">
        IITB - Workshop Booking Page
      </h1>

      <div className="flex items-center gap-4 relative z-10">
        <GlassButton onClick={() => setPage("home")}>
          Home
        </GlassButton>

        <GlassButton onClick={() => setPage("workshops")}>
          Workshops
        </GlassButton>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        {user ? (
          <>
            <span className="text-sm text-blue-200 relative z-10">
              {user.name}
            </span>
            <GlassButton onClick={handleLogout}>Logout</GlassButton>
          </>
        ) : (
          <GlassButton onClick={() => setPage("login")}>
            Login
          </GlassButton>
        )}
      </div>
    </div>
  );
}

/* ---------- HERO ---------- */

function Hero({ setPage }) {
  return (
    <div className="text-center mt-20 px-4">
      <p className="text-sm text-gray-400 mb-2">4.8 rating (200+ reviews)</p>

      <h1 className="text-4xl font-semibold text-gray-800">
        Practical Learning for Real Careers
      </h1>

      <p className="text-gray-500 mt-3 text-lg">
        Explore structured workshops designed for real-world skills
      </p>

      <div className="mt-8 flex justify-center gap-6">
        <GlassButton onClick={() => setPage("workshops")}>
          Explore Workshops
        </GlassButton>

        <GlassButton>
          Get Started Free
        </GlassButton>
      </div>
    </div>
  );
}

/* ---------- WORKSHOPS ---------- */

function WorkshopSection({ workshops, user }) {
  return (
    <div className="max-w-4xl mx-auto mt-16 px-6">
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Available Workshops
        </h2>

        {workshops.map((w) => (
          <div
            key={w.id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <h3 className="font-medium text-gray-700">{w.name}</h3>
              <p className="text-xs text-gray-500">
                Duration: {w.duration} days
              </p>
            </div>

            {user && <GlassButton>Book</GlassButton>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- LOGIN ---------- */

function Login({ handleLogin }) {
  return (
    <div className="flex justify-center mt-20">
      <div className="w-80 border p-6 rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-medium mb-4">Login</h2>

        <input
          className="w-full border p-2 mb-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Username"
        />

        <input
          type="password"
          className="w-full border p-2 mb-4 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Password"
        />

        <GlassButton onClick={handleLogin}>Sign In</GlassButton>
      </div>
    </div>
  );
}

/* ---------- APP ---------- */

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  const workshops = [
    { id: 1, name: "React Bootcamp", duration: 2 },
    { id: 2, name: "Machine Learning Basics", duration: 3 },
  ];

  const handleLogin = () => {
    setUser({ name: "Soham" });
    setPage("home");
  };

  const handleLogout = () => setUser(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} setPage={setPage} handleLogout={handleLogout} />

      {page === "home" && <Hero setPage={setPage} />}
      {page === "workshops" && (
        <WorkshopSection workshops={workshops} user={user} />
      )}
      {page === "login" && <Login handleLogin={handleLogin} />}
    </div>
  );
}

export default App;