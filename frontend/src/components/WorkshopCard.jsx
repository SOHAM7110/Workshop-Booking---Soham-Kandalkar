import { useNavigate } from "react-router-dom";

function WorkshopCard({ workshop }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h3>{workshop.title}</h3>
      <p>{workshop.date}</p>

      <button onClick={() => navigate("/booking")}>Book Now</button>
    </div>
  );
}

export default WorkshopCard;
