import ContactForm from "./ContactForm";

export const metadata = { title: "Contact | DB Logistics" };

export default function ContactPage() {
  return (
    <div className="container section">
      <div className="section-head">
        <h2>Contact the dispatch desk</h2>
      </div>
      <div style={{ maxWidth: "680px" }}>
        <p>
          For bookings, quotes on oversized cargo, or contract runs, call the
          desk or send a message. We answer between 8:00 and 18:00, Monday to
          Saturday.
        </p>
        <table className="rate-table" style={{ marginBottom: "32px" }}>
          <tbody>
            <tr><td>Phone</td><td className="mono">+251 111 234 567</td></tr>
            <tr><td>Email</td><td className="mono">hello@debrelogistics.et</td></tr>
            <tr><td>Office</td><td>Kebele 04, Adama, Oromia, Ethiopia</td></tr>
          </tbody>
        </table>
        <ContactForm />
      </div>
    </div>
  );
}
