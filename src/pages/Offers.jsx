import { useNavigate } from "react-router";
import "../App.css";
import reservation_icon from "../assets/reservation_icon.png";
import offers_icon from "../assets/offers_icon.png";
import logout_icon from "../assets/logout_icon.png";
import { useEffect, useState } from "react";
import api from "../api/offers";

const Offers = () => {
  const navigate = useNavigate();

  const [providerOffers, setProviderOffers] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [provider, setProvider] = useState();
  const providers = JSON.parse(localStorage.getItem("user"));

  const fetchProviderOffers = async () => {
    try {
      const response = await api.get({
        startDate: today,
        endDate: today,
        providerId: providers?.id,
      });
      const offer = await response.json();
      console.log(offer);
      setProviderOffers(offer);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setProvider(JSON.parse(localStorage.getItem("user")));
      fetchProviderOffers();
    }
  }, []);

  return (
    <div className="content">
      <div className="title-wrapper">
        <h2 className="heading">
          {" "}
          Welcome <small>{provider ? provider.name : null}</small>{" "}
        </h2>
        <p onClick={() => navigate("/Offer-update")}> New Offer </p>
      </div>
      <div>
        <ul>
          {providerOffers.length > 0 ? (
            providerOffers.map((offer, index) => (
              <li
                key={index}
                className="list-item"
                onClick={() => navigate(`/offers/${offer.provider_id}`)}
              >
                <div>
                  {" "}
                  <strong>{offer.provider_id}</strong>{" "}
                </div>
                <div className="quantity-section">
                  {" "}
                  <p> Standard: {offer.standard_unit} </p>
                  <p> Vegan: {offer.vegan_unit} </p>
                  <p> Diabetic: {offer.diabetic_unit} </p>
                </div>
                <div>
                  {" "}
                  <small>Pickup time: {offer.pickup_time} </small>{" "}
                </div>
              </li>
            ))
          ) : (
            <li>No offers available</li>
          )}
        </ul>
      </div>
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

export default Offers;
