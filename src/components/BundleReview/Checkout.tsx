import checkoutImage from "../../assets/icons/checkout.png";
import { CheckoutPrice } from "../../models/bundle";

interface CheckoutProps {
  totalPrice: CheckoutPrice;
  handleSaveLater: () => void;
}

const Checkout = ({ totalPrice, handleSaveLater }:CheckoutProps) => {
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
          {totalPrice.beforeDiscount > 0 && <span className={`${totalPrice.afterDiscount > 0 ? 'discount' : ''}`}>${totalPrice.beforeDiscount}</span>}
          {totalPrice.afterDiscount > 0 && <span>${totalPrice.afterDiscount}</span>}
        </div>
      </div>
      
    </div>
    <div className="finalStep">
        {totalPrice.afterDiscount > 0 && <span className="message">Congrats! You’re saving $`${Number((totalPrice.beforeDiscount - totalPrice.afterDiscount).toFixed(2))}`on your security bundle!</span>}
        <button type="button" className="checkoutBtn">Checkout</button>
        <button type="button" className="saveLink" onClick={handleSaveLater}>Save my system for later</button>
      </div>
    </div>
  );
};

export default Checkout;
