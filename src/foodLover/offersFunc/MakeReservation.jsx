import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./makeReservation.css";
import axios from "axios";
// Assuming you have a CSS file for styling

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
      let description = "";
      if (value === "Standard") {
        description = offer?.standard_description;
      } else if (value === "Vegan") {
        description = offer?.vegan_description;
      } else if (value === "Diabetic") {
        description = offer?.diabetic_description;
      }
      setOffers({
        ...offers, // Ensures other properties are preserved
        boxType: value,
        description: description,
      });
    }
  };

console.log("Offer details:", offer);

  // Function to handle reservation confirmation and sending the data to the server

  const handleConfirm = async () => {
    try {

       console.log("Available Standard Boxes:", offer?.standard_unit || 0);
       console.log("Available Diabetic Boxes:", offer?.diabetic_unit || 0);
       console.log("Available Vegan Boxes:", offer?.vegan_unit || 0);

      // Determine box_id based on the selected box type
      const box_id =
        offers.boxType === "Standard"
          ? 1
          : offers.boxType === "Diabetic"
          ? 3
          : 2; // Box type ID for Standard, Diabetic, and Vegan

      // Apply logic based on box_id
      let updatedQuantity = quantity;
      if (box_id === 1) {
        updatedQuantity = offer?.standard_unit || 1; // Assign standard_unit if box_id is 1
      } else if (box_id === 3) {
        updatedQuantity = offer?.diabetic_unit || 1; // Assign diabetic_unit if box_id is 2
      } else if (box_id === 2) {
        updatedQuantity = offer?.vegan_unit || 1; // Assign vegan_unit if box_id is 3
      }

      // Log the reservation data to inspect
      const reservationData = {
        user_id: 2, 
        provider_id: offer?.provider_id, 
        box_id: box_id,
        date: offer?.date || "2024-09-14", 
        quantity: updatedQuantity, 
      };

      console.log("Reservation Data:", reservationData); // Debugging log

      // Sending reservation data to the backend (adjust the URL as per your API)
      const response = await axios.post(
        "http://cfood.obereg.net:5000/reservations/",
        reservationData
      );

      const data = response.data;
      if (response.status >= 200 && response.status < 300) {
        console.log("Reservation successfully created:", data);
        // Redirect the user back to the reservation list page
        navigate("/reservation-list");
      } else {
        console.error("Error creating reservation:", data.message);
      }
    } catch (error) {
      // Log the error response for more information
      console.error("Network error while creating reservation:", error);
      if (error.response) {
        console.log("Server Response:", error.response.data); // This shows more detailed error message from the server
      }
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
          <option value="Vegan">Vegan</option>
          <option value="Diabetic">Diabetic</option>
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
          {offers.boxType === "Vegan" &&
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
