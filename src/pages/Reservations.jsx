import { useEffect, useState } from "react";
import "../App.css";
import "../global.css";
import { useNavigate } from "react-router";
import forward_icon from "../assets/forward.png";
import reservation_icon from "../assets/reservation_icon.png";
import offers_icon from "../assets/offers_icon.png";
import logout_icon from "../assets/logout_icon.png";
import axios from "axios";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  // const today = new Date().toISOString().split("T")[0];
  // const params = {
  //   startDate: today,
  //   Issue: true,
  // };

  const navigate = useNavigate();

  // Counters for the different status
  const [reservedCount, setReservedCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);

  const [provider, setProvider] = useState();
  const providers = JSON.parse(localStorage.getItem("user"));

  const handleReservations = async () => {
    try {
      const response = await axios.get(
        `http://cfood.obereg.net:5000/reservations/provider/${providers.id}?startDate=today&Issue=true`
      );
      // const data = await response.json();
      console.log(response.data);
      setReservations(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const groupedData = reservations.reduce((groups, reservation) => {
    const date = reservation.reservation_date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reservation);
    return groups;
  }, {});

  const groupedReservations = Object.keys(groupedData)
    .sort((a, b) => new Date(b) - new Date(a))
    .map((date) => {
      return {
        date,
        reservations: groupedData[date],
      };
    });

  useEffect(() => {
    const reserved = reservations.filter(
      (item) => item.status === "Reserved"
    ).length;
    const ready = reservations.filter(
      (item) => item.status === "Ready for Pickup"
    ).length;
    const delivered = reservations.filter(
      (item) => item.status === "Delivered"
    ).length;

    setReservedCount(reserved);
    setReadyCount(ready);
    setDeliveredCount(delivered);
  }, [reservations]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setProvider(JSON.parse(localStorage.getItem("user")));
      handleReservations();
    }
  }, []);

  return (
    <div className="content">
      <h2 className="heading">
        {" "}
        Reservations for <small> {provider ? provider.name : null} </small>{" "}
      </h2>
      <div className="count-container">
        <div>
          <p className="count"> {reservedCount} </p>
          <h3> Reserved </h3>
        </div>
        <div>
          <p className="count"> {readyCount} </p>
          <h3> Ready for pickup </h3>
        </div>
        <div>
          <p className="count"> {deliveredCount} </p>
          <h3> Delivered </h3>
        </div>
      </div>
      {groupedReservations.map((item) => (
        <div className="list" key={item.date}>
          <h4> {item.date} </h4>
          <ul>
            {item.reservations.map((reservation, index) => (
              <li
                onClick={() => {
                  navigate(`/reservations/${reservation.id}`);
                }}
                className="list-item"
                id={`reservation-${reservation.id}`}
                key={index}
              >
                <div>
                  {" "}
                  <strong> {reservation.id} </strong>{" "}
                </div>
                <div>
                  <div className="text-center"> {reservation.type} </div>
                  <div>
                    {" "}
                    {reservation.reservation_date} - {reservation.status}{" "}
                  </div>
                  <div className="text-center"> {reservation.user_name} </div>
                </div>
                <div>
                  <img className="icon" src={forward_icon} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
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

export default Reservations;
