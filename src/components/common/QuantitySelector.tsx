import { useEffect, useState } from "react";

interface QuantitySelectorProps{
    counter: number,
    disabledDecrementBtn: boolean,
    disabledIncrementBtn: boolean,
    decreaseQuantity :(product?:any) => void,
    increaseQuantity: (product?:any) => void
}

const QuantitySelector = ({counter , disabledDecrementBtn, disabledIncrementBtn, decreaseQuantity, increaseQuantity}:QuantitySelectorProps) => {

const [productCounter,setProductCounter] = useState<number>(counter);

useEffect(() => {
    setProductCounter(counter);
},[counter]);



  return (
    <div className="quantitySelector">
      <button
        type="button"
        className={`${disabledDecrementBtn ? "disabled btn" : "btn"}`}
        onClick={decreaseQuantity}
      >
        -
      </button>
      <span className="counter">{productCounter}</span>
      <button
        type="button"
        className={`${disabledIncrementBtn ? "disabled btn" : "btn"}`}
        onClick={increaseQuantity}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
