import Link from "next/link";

const services = [
  {
    num: "01",
    name: "Same-day courier",
    desc: "Parcels and documents inside Adama and Addis Ababa, picked up within the hour.",
    rate: "from ETB 100"
  },
  {
    num: "02",
    name: "Inter-city freight",
    desc: "Palletized and loose cargo on scheduled linehaul runs to major cities.",
    rate: "from ETB 500"
  },
  {
    num: "03",
    name: "Secure document runs",
    desc: "Signed-chain-of-custody delivery for contracts, tenders and bank documents.",
    rate: "from ETB 150"
  }
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">Adama, Ethiopia | Est. 2019</p>
          <h1>
            Freight that moves like it should. Paperwork that never gets lost.
          </h1>
          <p className="lede">
            Debre Logistics runs courier, parcel and freight services between
            Ethiopian cities, with live tracking on every shipment and a
            dispatch desk that actually answers the phone.
          </p>
          <div className="hero-actions">
            <Link href="/book" className="btn">Book a shipment</Link>
            <Link href="/track" className="btn ghost">Track a package</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>What we move</h2>
            <span className="count">03 services</span>
          </div>
          {services.map((s) => (
            <div className="service-row" key={s.num}>
              <span className="num mono">{s.num}</span>
              <div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </div>
              <span className="rate">{s.rate}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Why shippers stay</h2>
          </div>
          <div className="form-grid">
            <div>
              <h3 style={{ fontSize: "18px" }}>Live tracking</h3>
              <p style={{ color: "var(--muted)", fontSize: "15px" }}>
                Every booking gets a DBR tracking code. The status updates the
                moment a driver scans the package.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "18px" }}>Flat, printed rates</h3>
              <p style={{ color: "var(--muted)", fontSize: "15px" }}>
                The price you see at booking is the price on the invoice. No
                fuel surprises, no weekend multipliers.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "18px" }}>One dispatch desk</h3>
              <p style={{ color: "var(--muted)", fontSize: "15px" }}>
                A real person in Adama watches every route. When a run slips,
                you hear it from us first.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "18px" }}>Dispatch software built in-house</h3>
              <p style={{ color: "var(--muted)", fontSize: "15px" }}>
                Our booking, tracking and dispatch tools were built and are
                maintained by our own engineers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
