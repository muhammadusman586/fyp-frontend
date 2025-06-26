import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useRef, useState } from "react";
import {
  formatCVC,
  formatCreditCardNumber,
  formatExpirationDate,
} from "../utils/card-utils";
import Cards from "react-credit-cards-2";

const CreditCard = ({ onSubmit }) => {
  const formRef = useRef(null);
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: undefined,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (ev) => {
    const target = ev.target;
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    }
    setState((val) => ({
      ...val,
      [target.name]: target.value,
    }));
  };

  const handleInputFocus = (evt) => {
    const target = evt.target;
    setState((prev) => ({ ...prev, focus: target.name }));
  };

  const validateCard = () => {
    const newErrors = {};
    
    // Validate card number (basic check for emptiness and pattern)
    if (!state.number) {
      newErrors.number = "Card number is required";
    } else if (!/^(\d\s?){16}(?=\D*$)|(\d\s?){19}(?=\D*$)$/.test(state.number)) {
      newErrors.number = "Invalid card number format";
    }
    
    // Validate name
    if (!state.name) {
      newErrors.name = "Name is required";
    }
    
    // Validate expiry date
    if (!state.expiry) {
      newErrors.expiry = "Expiration date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(state.expiry)) {
      newErrors.expiry = "Invalid expiry date format (MM/YY)";
    } else {
      // Check if card is expired
      const [month, year] = state.expiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();
      
      if (expiryDate < currentDate) {
        newErrors.expiry = "Card has expired";
      }
    }
    
    // Validate CVC
    if (!state.cvc) {
      newErrors.cvc = "CVC is required";
    } else if (!/^\d{3,4}$/.test(state.cvc.replace(/\s/g, ''))) {
      newErrors.cvc = "CVC must be 3 or 4 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data before submitting
    if (!validateCard()) {
      return;
    }
    
    // Pass the card data to the parent component
    if (onSubmit) {
      onSubmit(state);
    }
  };

  return (
    <form ref={formRef} className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
      <div className="form-inputs w-full px-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <input
            type="text"
            name="number"
            placeholder="Card Number"
            pattern="^(\d\s?){16}(?=\D*$)|(\d\s?){19}(?=\D*$)$"
            required
            className={`input input-bordered w-full max-w-xs ${errors.number ? 'border-red-500' : ''}`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          {errors.number && <small className="text-red-500">{errors.number}</small>}
          <small>Eg: XXXX XXXX XXXX XXXX(XXX)</small>
        </div>
        <div>
          <input
            type="text"
            name="name"
            className={`input input-bordered w-full max-w-xs ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Name"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          {errors.name && <small className="text-red-500">{errors.name}</small>}
        </div>
        <div>
          <input
            type="tel"
            name="expiry"
            className={`input input-bordered w-full max-w-xs ${errors.expiry ? 'border-red-500' : ''}`}
            placeholder="Valid Thru (MM/YY)"
            pattern="^(0[1-9]|1[0-2])\/\d{2}$"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          {errors.expiry && <small className="text-red-500">{errors.expiry}</small>}
        </div>
        <div>
          <input
            type="tel"
            name="cvc"
            className={`input input-bordered w-full max-w-xs ${errors.cvc ? 'border-red-500' : ''}`}
            placeholder="CVC"
            pattern="\d{3,4}"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          {errors.cvc && <small className="text-red-500">{errors.cvc}</small>}
        </div>
      </div>
      <div className="form-actions w-full px-8 mt-4">
        <button 
          type="submit" 
          className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full hover:bg-pink-600 transition-colors"
        >
          PAY
        </button>
      </div>
    </form>
  );
};

export default CreditCard;