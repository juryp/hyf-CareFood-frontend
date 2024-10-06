import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router";
import "./offerUpdate.css";

const UpdateOfferForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const provider_id = localStorage.getItem("provider_id");
  console.log("Retrieved Provider ID from localStorage: ", provider_id); // Add this line

  const [offer, setOffer] = useState({
    name: "",
    description: "",
    date: today,
    boxType: "Standard", // Default box type
    quantity: 1, // Default quantity
    pickup_time: "17:30:00", // Default pickup time
  });

  const [boxes, setBoxes] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch boxes data
  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        const response = await axios.get(
          `http://cfood.obereg.net:5000/boxes/get-boxes/${provider_id}`
        );
        const data = response.data;

        if (data && data.boxes && data.boxes.length > 0) {
          setBoxes(data.boxes);
          const standardBox = data.boxes.find((box) => box.type === "Standard");
          if (standardBox) {
            setOffer((prevOffer) => ({
              ...prevOffer,
              name: standardBox.type,
              description: standardBox.description,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching the offer data:", error);
      }
    };

    fetchOfferData();
  }, []);

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!offer.name) newErrors.name = "Box Type is mandatory";
    if (!offer.description) newErrors.description = "Description is mandatory";
    if (!offer.date) newErrors.date = "Date is mandatory";
    if (!offer.pickup_time) newErrors.pickup_time = "Pickup time is mandatory";
    if (offer.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    return newErrors;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });

    if (name === "boxType") {
      const selectedBox = boxes.find((box) => box.type === value);
      if (selectedBox) {
        setOffer((prevOffer) => ({
          ...prevOffer,
          description: selectedBox.description,
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const boxTypeMap = {
        Standard: 1,
        Vegan: 2,
        Diabetic: 3,
      };

      const requestData = {
        provider_id: provider_id, // Assuming provider ID is 3
        date: offer.date, // Correct field name
        type: boxTypeMap[offer.boxType] || 1, // Box type mapped
        quantity: offer.quantity,
        description: offer.description,
        pickup_time: offer.pickup_time,
      };
      console.log(provider_id);

      try {
        const response = await axios.put(
          "http://cfood.obereg.net:5000/boxes/add-boxes",
          requestData
        );
        if (response.status === 200) {
          alert("Offer updated successfully!");
          navigate("/offers"); // Redirect to offers page
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error updating the offer:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Update Offer</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBoxType" className="mb-3">
          <Form.Label>Box Type</Form.Label>
          <Form.Control
            as="select"
            name="boxType"
            value={offer.boxType}
            onChange={handleChange}
          >
            {boxes.map((box) => (
              <option key={box.type} value={box.type}>
                {box.type}
              </option>
            ))}
          </Form.Control>
          {errors.name && <p className="text-danger">{errors.name}</p>}
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={offer.description}
            onChange={handleChange}
            placeholder="Description of the offer"
          />
          {errors.description && (
            <p className="text-danger">{errors.description}</p>
          )}
        </Form.Group>

        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-control"
            value={offer.date}
            onChange={handleChange}
          />
          {errors.date && <p className="text-danger">{errors.date}</p>}
        </div>

        <Form.Group controlId="formQuantity" className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={offer.quantity}
            onChange={handleChange}
            min="1"
          />
          {errors.quantity && <p className="text-danger">{errors.quantity}</p>}
        </Form.Group>

        <Form.Group controlId="formPickupTime" className="mb-3">
          <Form.Label>Pickup Time</Form.Label>
          <Form.Control
            type="time"
            name="pickup_time"
            value={offer.pickup_time}
            onChange={handleChange}
          />
          {errors.pickup_time && (
            <p className="text-danger">{errors.pickup_time}</p>
          )}
        </Form.Group>

        <div className="form-actions d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate("/offers")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateOfferForm;
