import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import back_icon from "../assets/back_icon.png";
import reservation_icon from "../assets/reservation_icon.png";
import offers_icon from "../assets/offers_icon.png";
import logout_icon from "../assets/logout_icon.png";

const ReservationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [reservations, setReservations] = useState({});

  const handleReservationDetails = async () => {
    try {
      const response = await axios.get(
        `http://cfood.obereg.net:5000/reservations/provider/3?startDate=today&Issue=true`
      );
      // const data = await response.json();
      response.data.map((r) => {
        if (r.id.toString() === id) {
          setReservations(r);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReadyStatus = async () => {
    await axios.post(`ready/${id}`);
  };

  const handleDeliveredStatus = async () => {
    await axios.post(`issue/${id}`);
    navigate("/reservations");
  };

  const handleButtonText = () => {
    if (reservations.status === "Reserved") {
      return (
        <button onClick={handleReadyStatus} className="status">
          {" "}
          Ready for pickup{" "}
        </button>
      );
    } else if (reservations.status === "Ready for Pickup") {
      return (
        <button onClick={handleDeliveredStatus} className="status">
          {" "}
          Delivered{" "}
        </button>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    handleReservationDetails();
  }, [handleReadyStatus, handleDeliveredStatus]);

  return (
    <div className="content">
      <img
        onClick={() => navigate("/reservations")}
        className="back-icon"
        src={back_icon}
      />
      <div>
        <h2 className="heading"> Reservation for {reservations.type} </h2>
        <p className="date">
          {" "}
          Reservation date: {reservations.reservation_date}{" "}
        </p>
        <p className="food-lover">
          {" "}
          Reserved by: <strong>{reservations.user_name}</strong>{" "}
        </p>
      </div>
      <div className="details">
        <div>
          <p>
            {" "}
            <strong>{reservations.quantity}</strong>{" "}
          </p>
          <p> units </p>
        </div>
        <div>
          <p>
            {" "}
            <strong>{reservations.status}</strong>{" "}
          </p>
          <p> status </p>
        </div>
      </div>
      <div className="button-container">{handleButtonText()}</div>
      <div className="footer">
        <div onClick={() => navigate("/reservations")}>
          <img src={reservation_icon} />
          <p> Reservations </p>
        </div>
        <div onClick={() => navigate("/offers")}>
          <img src={offers_icon} />
          <p> Offers </p>
        </div>
        <div onClick={() => navigate("/")}>
          <img src={logout_icon} />
          <p> Logout </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
