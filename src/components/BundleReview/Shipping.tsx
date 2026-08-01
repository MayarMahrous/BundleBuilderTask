import shippingIcon from "../../assets/icons/shipping.svg";

const shipping = () => {
  const icons: Record<string, string> = {
    shipping: shippingIcon,
  };
  return (
    <div className="shippingContainer">
      <img src={icons.shipping} alt="shipping" />
      <span>Fast Shipping</span>
      <div className="price">
        <span className={ "beforeDiscount"}>$5.99</span>
         <span>FREE</span>
      </div>
    </div>
  );
};

export default shipping;
