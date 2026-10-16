export const metadata = { title: "Services | DB Logistics" };

const rows = [
  {
    num: "01",
    name: "Same-day courier",
    desc: "Parcels and documents inside Adama and Addis Ababa. Booked before 2pm, delivered the same day.",
    rate: "ETB 100 base + ETB 80 per kg"
  },
  {
    num: "02",
    name: "Express inter-city",
    desc: "Next-business-day delivery on the Addis Ababa, Adama, Bishoftu and Nazret corridor.",
    rate: "ETB 100 base + ETB 120 per kg"
  },
  {
    num: "03",
    name: "Scheduled freight",
    desc: "Linehaul runs three times a week to Dire Dawa, Hawassa, Mekelle and Bahir Dar depots.",
    rate: "ETB 500 base + ETB 55 per kg"
  }
];

export default function ServicesPage() {
  return (
    <div className="container section">
      <div className="section-head">
        <h2>Services and rates</h2>
        <span className="count">Printed rates, no surprises</span>
      </div>
      {rows.map((r) => (
        <div className="service-row" key={r.num}>
          <span className="num mono">{r.num}</span>
          <div>
            <h3>{r.name}</h3>
            <p>{r.desc}</p>
          </div>
          <span className="rate">{r.rate}</span>
        </div>
      ))}

      <h2 style={{ marginTop: "56px" }}>Coverage</h2>
      <table className="rate-table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Transit time</th>
            <th>Frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Adama - Addis Ababa</td><td>Same day</td><td>Daily</td></tr>
          <tr><td>Addis Ababa - Bishoftu / Nazret</td><td>Next day</td><td>Daily</td></tr>
          <tr><td>Addis Ababa - Dire Dawa</td><td>2 days</td><td>Mon / Wed / Fri</td></tr>
          <tr><td>Addis Ababa - Hawassa</td><td>2 days</td><td>Mon / Thu</td></tr>
          <tr><td>Addis Ababa - Mekelle</td><td>4 days</td><td>Tue / Sat</td></tr>
          <tr><td>Addis Ababa - Bahir Dar</td><td>3 days</td><td>Wed / Sat</td></tr>
        </tbody>
      </table>
    </div>
  );
}
