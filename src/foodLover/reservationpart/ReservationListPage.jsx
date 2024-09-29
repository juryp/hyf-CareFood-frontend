import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./reservationListPage.css";
import reservationApi from "../../api/reservations.js";
import forward_icon from "../../assets/forward.png";

const ReservationListPage = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [reservedCount, setReservedCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const params = {
    startDate: today,
    endDate: today,
    Issue: true,
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUserReservations = async () => {
    try {
      const res = await reservationApi.getUser(user?.id, params);
      const data = await res.json();
      console.log(data);
      setReservations(data);
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

  const groupedReservations = Object.keys(groupedData).map((date) => ({
    date,
    reservations: groupedData[date],
  }));

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
    handleUserReservations();
  }, []);

  // const openReservations = reservations.filter(
  //   (reservation) => reservation.status !== "Delivered"
  // );
  const archiveReservations = reservations.filter(
    (reservation) => reservation.status === "Delivered"
  );

  const handleClick = (reservation) => {
    navigate("/reservation-detail", { state: { reservation } });
  };

  return (
    <div className="content">
      <h2 className="heading">Reservations - Food Provider</h2>
      <div className="count-container">
        <div>
          <p className="count">{reservedCount}</p>
          <h3>Reserved</h3>
        </div>
        <div>
          <p className="count">{readyCount}</p>
          <h3>Ready for pickup</h3>
        </div>
        <div>
          <p className="count">{deliveredCount}</p>
          <h3>Delivered</h3>
        </div>
      </div>
      {groupedReservations.map((item) => (
        <div className="list" key={item.date}>
          <h4>{item.date}</h4>
          <ul>
            {item.reservations.map((reservation, index) => (
              <li
                onClick={() => handleClick(reservation)}
                className="list-item"
                key={reservation.id}
              >
                <div>
                  <strong>{reservation.id}</strong>
                </div>
                <div>
                  <div className="text-center">{reservation.type}</div>
                  <div>
                    {reservation.reservation_date} - {reservation.status}
                  </div>
                  <div className="text-center">{reservation.user_name}</div>
                </div>
                <div>
                  <img className="icon" src={forward_icon} alt="Forward" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h2>Archive</h2>
      {archiveReservations.length > 0 ? (
        archiveReservations.map((reservation, index) => (
          <div
            key={index}
            className="reservation-item1"
            onClick={() => handleClick(reservation)}
          >
            <div className="reservation-row">
              <span>{reservation.provider_name}</span> -{" "}
              <span>{reservation.type}</span>
            </div>
            <div className="reservation-row">
              <span>{reservation.status}</span>
            </div>
          </div>
        ))
      ) : (
        <p>No archived reservations.</p>
      )}
    </div>
  );
};

export default ReservationListPage;
