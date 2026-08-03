import { useState } from "react";
import checkoutImage from "../../assets/icons/checkout.png";
import { CheckoutPrice } from "../../models/bundle";
import ConfirmationModal from "../common/ConfirmationModal";

interface CheckoutProps {
  totalPrice: CheckoutPrice;
  handleSaveLater: () => void;
}

const Checkout = ({ totalPrice, handleSaveLater }:CheckoutProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState({isOpen: false, message: ""});
  const saveProducts = () => { 
  setShowConfirmationModal({isOpen: true, message: "System saved! We'll have it ready for you next time."});
  handleSaveLater();
  }
  return (
    <div className="reviewFooter">
    <div className="checkout">
      <div className="summary">
        <img src={checkoutImage} alt="checkout" />
      </div>
      <div className="totalPrice">
        <div className="low">
          <span>as low as $19.19/mo</span>
        </div>
        <div className="price">
          {totalPrice.afterDiscount !== totalPrice.beforeDiscount && (
            <span className={`${totalPrice.afterDiscount >= 0 ? 'discount' : ''}`}>${totalPrice.beforeDiscount}</span>
          )}
          <span>${totalPrice.afterDiscount}</span>
        </div>
      </div>
      
    </div>
    <div className="finalStep">
        {totalPrice.afterDiscount !== totalPrice.beforeDiscount && (
          <span className="message">Congrats! You’re saving ${Number((totalPrice.beforeDiscount - totalPrice.afterDiscount).toFixed(2))} on your security bundle!</span>
        )}
        <button type="button" className="checkoutBtn" onClick={() => setShowConfirmationModal({isOpen: true, message: "Thanks for your purchase. A confirmation email is on its way."})}>Checkout</button>
        <button type="button" className="saveLink" onClick={saveProducts}>Save my system for later</button>
    </div>
      {showConfirmationModal.isOpen && <ConfirmationModal message={showConfirmationModal.message} onClose={() => setShowConfirmationModal({isOpen: false, message: ""})} />}
    </div>
  );
};

export default Checkout;
