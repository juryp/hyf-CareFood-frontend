import  { useState } from 'react';
import { useNavigate } from 'react-router';


const CreateOffer = () => {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const [offer, setOffer] = useState({
    name: '',
    description: '',
    date: today,
    standardQuantity: 0,
    veganQuantity: 0,
    diabeticQuantity: 0,
    pickupTime: ''
  });

  const [errors, setErrors] = useState({});

  // Validation function to check for mandatory fields
  const validate = () => {
    const newErrors = {};
    if (!offer.name) newErrors.name = 'Name is mandatory';
    if (!offer.description) newErrors.description = 'Description is mandatory';
    if (!offer.date) newErrors.date = 'Date is mandatory';
    if (offer.standardQuantity <= 0 && offer.veganQuantity <= 0 && offer.diabeticQuantity <= 0)
      newErrors.quantities = 'At least one quantity must be greater than 0';
    if (!offer.pickupTime) newErrors.pickupTime = 'Pickup time is mandatory';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Form is valid, proceed with offer creation (e.g., send to API)
      console.log('Offer created:', offer);
      // Reset form after creation
      setOffer({
        name: '',
        description: '',
        date: today,
        standardQuantity: 0,
        veganQuantity: 0,
        diabeticQuantity: 0,
        pickupTime: ''
      });
      setErrors({});
    }
  };

  // Handle form cancellation
  //const handleCancel = () => {
    // Reset form and errors
   // setOffer({
      //name: '',
      //description: '',
     // date: today,
      //quantity: 1
    //});
    //setErrors({});
  //};

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Create a new offer</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={offer.name}
            onChange={handleChange}
            placeholder="Name of the offer"
          />
          {errors.name && <p className="text-danger">{errors.name}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={offer.description}
            onChange={handleChange}
            placeholder="Description of the offer"
          />
          {errors.description && <p className="text-danger">{errors.description}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
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

        <div className="mb-3">
          <label htmlFor="standardQuantity" className="form-label">Standard Quantity</label>
          <input
            type="number"
            id="standardQuantity"
            name="standardQuantity"
            className="form-control"
            value={offer.standardQuantity}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="veganQuantity" className="form-label">Vegan Quantity</label>
          <input
            type="number"
            id="veganQuantity"
            name="veganQuantity"
            className="form-control"
            value={offer.veganQuantity}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="diabeticQuantity" className="form-label">Diabetic Quantity</label>
          <input
            type="number"
            id="diabeticQuantity"
            name="diabeticQuantity"
            className="form-control"
            value={offer.diabeticQuantity}
            onChange={handleChange}
            min="0"
          />
          {errors.quantities && <p className="text-danger">{errors.quantities}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="pickupTime" className="form-label">Pickup Time</label>
          <input
            type="time"
            id="pickupTime"
            name="pickupTime"
            className="form-control"
            value={offer.pickupTime}
            onChange={handleChange}
          />
          {errors.pickupTime && <p className="text-danger">{errors.pickupTime}</p>}
        </div>

        <button type="submit" className="btn btn-primary me-2">Create</button>
        <button type="button" className="btn btn-secondary" onClick={()=>navigate('/offers')}>Cancel</button>
      </form>
    </div>
  );
};

export default CreateOffer;
