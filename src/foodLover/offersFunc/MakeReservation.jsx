import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./makeReservation.css"; // Assuming you have a CSS file for styling

const MakeReservation = () => {
  const { state: offer } = useLocation(); // Get the offer details passed via state
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1); // Number of boxes to reserve
  const [pickupTime, setPickupTime] = useState("12:00"); // Default pickup time
  const [offers, setOffers] = useState({
    description: offer?.standard_description || "", // Default description
    boxType: "Standard", // Default box type
  });

  // Update the offer description when box type is changed
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "boxType") {
      if (value === "Standard") {
        setOffers({
          boxType: "Standard",
          description: offer?.standard_description,
        });
      } else if (value === "Diabetic") {
        setOffers({
          boxType: "Diabetic",
          description: offer?.diabetic_description,
        });
      } else if (value === "Vegetarian") {
        setOffers({
          boxType: "Vegetarian",
          description: offer?.vegan_description,
        });
      }
    }
  };

  // Function to handle reservation confirmation and sending the data to the server
  const handleConfirm = async () => {
    try {
      // Reservation data structure to send to the backend
      const reservationData = {
        user_id: 9, // Example user ID, replace with actual user ID from login
        provider_id: offer?.provider_id, // Provider ID from the offer
        box_id:
          offers.boxType === "Standard"
            ? 1
            : offers.boxType === "Diabetic"
            ? 2
            : 3, // Box type ID (adjust IDs as per your data)
        date: offer?.date || "2024-09-14", // Date for the reservation
        quantity, // Number of boxes to reserve
        pickup_time: pickupTime, // Time of pickup
      };

      // Sending reservation data to the backend (adjust the URL as per your API)
      const response = await fetch(
        "http://cfood.obereg.net:5000/reservations/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Reservation successfully created:", data);
        // Redirect the user back to the reservation list page
        navigate("/reservation-list");
      } else {
        console.error("Error creating reservation:", data.message);
      }
    } catch (error) {
      console.error("Network error while creating reservation:", error);
    }
  };

  return (
    <div className="make-reservation">
      <h1>Make a reservation for {offer?.provider_name}</h1>
      <p>{offers.description}</p>

      <div className="reservation-details">
        <label>Box Type</label>
        <select
          name="boxType"
          value={offers.boxType}
          onChange={handleInputChange}
        >
          <option value="Standard">Standard</option>
          <option value="Diabetic">Diabetic</option>
          <option value="Vegetarian">Vegetarian</option>
        </select>

        <label>Quantity</label>
        <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
          {/* Display the correct number of units based on the selected box type */}
          {offers.boxType === "Standard" &&
            [...Array(offer?.standard_unit + 1).keys()].map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          {offers.boxType === "Diabetic" &&
            [...Array(offer?.diabetic_unit + 1).keys()].map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          {offers.boxType === "Vegetarian" &&
            [...Array(offer?.vegan_unit + 1).keys()].map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
        </select>

        <label>Pickup Time</label>
        <select
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
        >
          <option value="12:00">12:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
        </select>
      </div>

      <div className="reservation-actions">
        <button onClick={() => navigate(-1)}>Cancel</button>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default MakeReservation;
