import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./makeReservation.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
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
  // Get the user from localStorage
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data
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
      const box_id =
        offers.boxType === "Standard"
          ? 1
          : offers.boxType === "Diabetic"
          ? 3
          : 2;
    
      const reservationData = {
        user_id: user?.id,
        provider_id: offer?.provider_id,
        box_id: box_id,
        date: offer?.date || "2024-09-14",
        quantity: quantity,
      };
console.log(user?.id);

      const response = await axios.post(
        "http://cfood.obereg.net:5000/reservations/",
        reservationData
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Reservation successfully created:", response.data);
        toast.success("Reservation successfully created!");

        // Delay navigation to show the toast for 3 seconds (3000 ms)
        setTimeout(() => {
          navigate("/reservation-list");
        }, 3000); // Wait 3 seconds before navigating
      } else {
        console.error("Error creating reservation:", response.data.message);
      }
    } catch (error) {
      console.error("Network error while creating reservation:", error);
      if (error.response) {
        console.log("Server Response:", error.response.data);
        toast.error("Not enough boxes available for reservation!");
      }
    }
  };

  return (
    <div className="make-reservation">
      <ToastContainer position="top-center" />
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

        {/* <label>Pickup Time</label>
        <select
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
        >
          <option value="12:00">12:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
        </select> */}
      </div>

      <div className="reservation-actions">
        <button onClick={() => navigate(-1)}>Cancel</button>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default MakeReservation;
