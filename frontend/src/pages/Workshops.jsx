import WorkshopCard from "../components/WorkshopCard";

function Workshops() {
  const data = [
    { title: "Python", date: "20 April" },
    { title: "Machine Learning", date: "25 April" },
  ];

  return (
    <div className="container">
      <h1>Available Workshops</h1>

      <div className="grid">
        {data.map((w, i) => (
          <WorkshopCard key={i} workshop={w} />
        ))}
      </div>
    </div>
  );
}

export default Workshops;
