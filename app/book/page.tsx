import BookingForm from "./BookingForm";

export const metadata = { title: "Book | DB Logistics" };

export default function BookPage() {
  return (
    <div className="container section">
      <div className="section-head">
        <h2>Book a shipment</h2>
        <span className="count">Price is calculated live</span>
      </div>
      <BookingForm />
    </div>
  );
}
