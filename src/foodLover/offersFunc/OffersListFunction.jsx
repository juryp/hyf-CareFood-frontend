import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import offersApi from "../../api/offers.js";
import "./offersListFunction.css";

const OffersListFunction = () => {
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const params = {
    startDate: today, // Set startDate to today's date
    endDate: today, // Set endDate to today's date
  };

  const handleOffers = async () => {
    try {
      const res = await offersApi.get(params);
      const offersData = await res.json();
      setOffers(offersData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleOffers();
  }, []);

  const handleOfferClick = (offer) => {
    navigate("/offers-detail", { state: offer }); // Navigate to the Offer Detail page
  };

  return (
    <div className="offers-list">
      <h1>Today's Offers</h1>
      {offers.length > 0 && <h3>{offers[0].date}</h3>}
      <ul>
        {offers.map((offer, index) => (
          <li
            key={index}
            className="offer-item"
            onClick={() => handleOfferClick(offer)}
          >
            <div>
              <h2>{offer.provider_name}</h2>
              <p>
                {offer.standard_unit} standard units, {offer.vegan_unit} vegan
                units, {offer.diabetic_unit} diabetic units left
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OffersListFunction;
