export const metadata = { title: "About | Debre Logistics" };

export default function AboutPage() {
  return (
    <div className="container section">
      <div className="section-head">
        <h2>About Debre Logistics</h2>
      </div>
      <div style={{ maxWidth: "680px" }}>
        <p>
          Debre Logistics started in 2019 with one van, a borrowed office in
          Adama, and a simple promise: the package arrives when we said it
          would, and you always know where it is.
        </p>
        <p>
          Six years later we run daily courier runs on the Addis Ababa corridor
          and scheduled linehaul to six regional depots. Our dispatch system,
          booking flow and tracking tools are built and maintained in-house,
          which means when a customer needs a change, we ship it the same week.
        </p>
        <h3 style={{ marginTop: "32px" }}>The numbers</h3>
        <table className="rate-table">
          <tbody>
            <tr><td>Shipments per month</td><td>4,200+</td></tr>
            <tr><td>On-time delivery rate</td><td>97.4%</td></tr>
            <tr><td>Cities served</td><td>8</td></tr>
            <tr><td>Dispatch and driver staff</td><td>23</td></tr>
          </tbody>
        </table>
        <h3 style={{ marginTop: "32px" }}>Principles</h3>
        <p>
          Printed rates. Signed custody on document runs. A phone that gets
          answered. That is most of logistics; the rest is showing up.
        </p>
      </div>
    </div>
  );
}
