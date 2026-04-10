import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <h2>Workshop Booking</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/workshops">Workshops</Link>
      </div>
    </div>
  );
}

export default Navbar;
