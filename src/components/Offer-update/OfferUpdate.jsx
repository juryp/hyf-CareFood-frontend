import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router";
import "./offerUpdate.css";

const UpdateOfferForm = () => {
  const [offer, setOffer] = useState({
    name: '',            // Initialize name
    description: '',
    pickup_time: "17:00:00",
    startDate: "2024-09-14",
    endDate: "2024-09-14",
    boxType: "Standard", // Default box type
    quantity: 1,         // Initialize quantity
  });

  const [boxes, setBoxes] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        const response = await axios.get('http://cfood.obereg.net:5000/boxes/get-boxes/1');
        const data = response.data;

        if (data && data.boxes && data.boxes.length > 0) {
          setBoxes(data.boxes);
          const standardBox = data.boxes.find(box => box.type === 'Standard');
          if (standardBox) {
            setOffer(prevOffer => ({
              ...prevOffer,
              name: standardBox.type,
              description: standardBox.description,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching the offer data:', error);
      }
    };

    fetchOfferData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOffer({ ...offer, [name]: value });

    if (name === "boxType") {
      const selectedBox = boxes.find(box => box.type === value);
      if (selectedBox) {
        setOffer(prevOffer => ({
          ...prevOffer,
          description: selectedBox.description,
        }));
      }
    }
  };

  // Handle the form submission with PUT request
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure that Diabetic is mapped correctly here
    const boxTypeMap = {
      "Standard": 1,
      "Vegan": 2,
      "Gluten-Free": 3,
      "Diabetic": 4, };

    const requestData = {
      provider_id: 3, 
      date: offer.startDate, 
      type: boxTypeMap[offer.boxType] || 1,
      quantity: offer.quantity,
      description: offer.description,
      pickup_time: offer.pickup_time, 
    };

    try {
      const response = await axios.put('http://cfood.obereg.net:5000/boxes/add-boxes', requestData);
      if (response.status === 200) {
        alert('Offer updated successfully!');
        navigate("/"); 
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error updating the offer:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    setOffer({
      name: '',
      description: '',
      startDate: "2024-09-14", 
      endDate: "2024-09-14",
      boxType: 'Standard', 
      pickup_time: "17:00:00",
      quantity: 1,
    });

    alert('Offer update canceled');
    navigate("/"); 
  };

  return (
    <Form onSubmit={handleSubmit} className="update-offer-form">
      <h2>Update an Offer</h2>

      <Form.Group controlId="formOfferType" className="mb-3">
        <Form.Label>Box Type <span className="mandatory">*</span></Form.Label>
        <Form.Control
          as="select"
          name="boxType"
          value={offer.boxType}
          onChange={handleInputChange}
          required >
            
          {boxes.map((box) => (
            <option key={box.type} value={box.type}>{box.type}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formOfferDescription" className="mb-3">
        <Form.Label>Description <span className="mandatory">*</span></Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={offer.description}
          onChange={handleInputChange}
          placeholder="Offer Description"
          required
        />
        <Form.Text className="text-muted">
          Description of the selected box type will appear here.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formOfferQuantity" className="mb-3">
        <Form.Label>Quantity <span className="mandatory">*</span></Form.Label>
        <Form.Control
          type="number"
          name="quantity"
          value={offer.quantity}
          onChange={handleInputChange}
          min="1" // Minimum quantity is 1
          required
        />
      </Form.Group>

      <Form.Group controlId="formOfferStartDate" className="mb-3">
        <Form.Label>Start Date <span className="mandatory">*</span></Form.Label>
        <Form.Control
          type="date"
          name="startDate"
          value={offer.startDate}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formOfferEndDate" className="mb-3">
        <Form.Label>End Date <span className="mandatory">*</span></Form.Label>
        <Form.Control
          type="date"
          name="endDate"
          value={offer.endDate}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <div className="form-actions d-flex justify-content-between">
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Save</Button>
      </div>
    </Form>
  );
};

export default UpdateOfferForm;
