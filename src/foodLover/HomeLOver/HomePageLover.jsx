import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './homePageLover.css';
import offersApi from '../../api/offers.js';
import reservationApi from '../../api/reservations.js';

const HomePageLover = () => {
  const [offers, setOffers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState();

  // Function to fetch offers
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Function to fetch offers
  const handleOffers = async () => {
    try {
      const res = await offersApi.get({
        startDate: today, // Use today's date dynamically
        endDate: today, // Use today's date dynamically
      });
      const offersData = await res.json();
      setOffers(offersData);
    } catch (error) {
      console.log(error);
    }
  };
  const users = JSON.parse(localStorage.getItem("user")); // Retrieve user data

  // Function to fetch reservations
  const handleReservations = async () => {
    try {
      const res = await reservationApi.getUser(users?.id, {
        startDate: today, // Use today's date dynamically
        endDate: today, // Use today's date dynamically
      });
      const reservationData = await res.json();
      setReservations(reservationData);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    handleOffers();
    handleReservations();
  }, []);

  // Calculate totals for diabetic_unit, standard_unit, vegan_unit
  const totalProviders = offers.length;
  const totalDiabeticUnits = offers.reduce(
    (sum, offer) => sum + offer.diabetic_unit,
    0
  );
  const totalStandardUnits = offers.reduce(
    (sum, offer) => sum + offer.standard_unit,
    0
  );
  const totalVeganUnits = offers.reduce(
    (sum, offer) => sum + offer.vegan_unit,
    0
  );

  // Condition to show or hide the "Check out the offers" button
  const showCheckOffersButton =
    totalDiabeticUnits > 0 || totalStandardUnits > 0 || totalVeganUnits > 0;

  // Filter for open reservations (status other than Delivered)
  const openReservations = reservations.filter(
    (reservation) => reservation.status !== "Delivered"
  );

  // Handle navigation to reservation details
  const handleReservationClick = (reservation) => {
    navigate("/reservation-detail", { state: { reservation } });
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <div className="homepage-lover">
      <div className="offers-summary">
        <h2>Welcome, {user ? user.name : null}!</h2>
        <p>Today</p>
        <div className="offers-totals">
          <div>
            <strong>{totalProviders}</strong> offers
          </div>
          <div>
            <strong>{totalDiabeticUnits}</strong> diabetic units
          </div>
          <div>
            <strong>{totalStandardUnits}</strong> standard units
          </div>
          <div>
            <strong>{totalVeganUnits}</strong> vegan units
          </div>
        </div>
        {showCheckOffersButton ? (
          <button
            className="check-offers-button"
            onClick={() => navigate("/offerslover")}
          >
            Check out the offers
          </button>
        ) : (
          <p>Bummer, too late! Come back tomorrow to check out new offers!</p>
        )}
      </div>

      <div className="reservations-section">
        <h2>Your open reservations</h2>
        {openReservations.length > 0 ? (
          openReservations.map((reservation, index) => (
            <div
              key={index}
              className="reservation-item"
              onClick={() => handleReservationClick(reservation)}
            >
              <div className="reservation-row">
                <span>{reservation.provider_name}</span> -{" "}
                <span>{reservation.status}</span>
              </div>
            </div>
          ))
        ) : (
          <p>You don't have open reservations at the moment...</p>
        )}
      </div>
    </div>
  );
};

export default HomePageLover;






