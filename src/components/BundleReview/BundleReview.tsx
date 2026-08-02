import {
  CheckoutPrice,
  SelectedPlan,
  SelectedProduct,
  Step,
} from "../../models/bundle";
import camUnlimitedIcon from "../../assets/icons/cam-unlimited.svg";
import "./BundleReview.css";
import QuantitySelector from "../common/QuantitySelector";
import { useEffect, useState } from "react";
import Shipping from "./Shipping";
import Checkout from "./Checkout";
import { SAVEDPLANS, SAVEDPRODUCTS } from "../../constants/quantityActions";

interface reviewProps {
  steps: Step[];
  products: SelectedProduct[];
  updateProducts: (products: SelectedProduct[]) => void;
  plans: SelectedPlan[];
}
const BundleReview = ({
  steps,
  products,
  updateProducts,
  plans,
}: reviewProps) => {
  const [selectedProducts, setSelectedProducts] =
    useState<SelectedProduct[]>(products);
  const [totalPrice, setTotalPrice] = useState<CheckoutPrice>({
    beforeDiscount: 0,
    afterDiscount: 0,
  });

  const sumDiscounts = (
    items: { beforeDiscount: number; afterDiscount: number, discount: number}[],
  ) =>
    items.reduce(
      (acc, item) => {
        acc.totalBeforeDiscount += item.beforeDiscount;
        acc.totalAfterDiscount += item.discount > 0 ? item.afterDiscount : item.beforeDiscount;
        return acc;
      },
      { totalBeforeDiscount: 0, totalAfterDiscount: 0 },
    );

  useEffect(() => {
    setSelectedProducts(products);
  }, [products]);

  useEffect(() => {
    const productsTotal = sumDiscounts(products);
    const plansTotal = sumDiscounts(plans);

    setTotalPrice({
      beforeDiscount:
        Number((productsTotal.totalBeforeDiscount + plansTotal.totalBeforeDiscount).toFixed(2)),
      afterDiscount:
        Number((productsTotal.totalAfterDiscount + plansTotal.totalAfterDiscount).toFixed(2)),
    });
  }, [products, plans]);

  const icons: Record<string, string> = {
    camunlimited: camUnlimitedIcon,
  };

  const planStep = steps.find((step: Step) => step.isPlan);

  const handleQuantityIncrement = (product: SelectedProduct) => {
    if (product.quantity < product.limitedQuantity) {
      const updatedProducts = selectedProducts.map((item: SelectedProduct) => {
        const newQuantity = item.quantity + 1;
        return item.id === product.id
          ? {
              ...item,
              quantity: newQuantity,
              beforeDiscount: Number((product.price * newQuantity).toFixed(2)),
              afterDiscount:
                Number(product.discount) !== 0
                  ? Number(
                      (
                        (product.price -
                          product.price * (product.discount / 100)) *
                        newQuantity
                      ).toFixed(2),
                    )
                  : 0,
            }
          : item;
      });
      updateProducts(updatedProducts);
    }
  };

  const handleQuantityDecrement = (product: SelectedProduct) => {
    if (product.quantity > 1) {
      const updatedProducts = selectedProducts.map((item: SelectedProduct) => {
        const newQuantity = item.quantity - 1;
        return item.id === product.id
          ? {
              ...item,
              quantity: newQuantity,
              beforeDiscount: Number((product.price * newQuantity).toFixed(2)),
              afterDiscount:
                Number(product.discount) !== 0
                  ? Number(
                      (
                        (product.price -
                          product.price * (product.discount / 100)) *
                        newQuantity
                      ).toFixed(2),
                    )
                  : 0,
            }
          : item;
      });
      updateProducts(updatedProducts);
    } else {
      const updatedProducts = selectedProducts.filter(
        (item: SelectedProduct) => item.id !== product.id,
      );
      updateProducts(updatedProducts);
    }
  };

  const saveProductsLater = () => {
    !!products.length ? localStorage.setItem(SAVEDPRODUCTS, JSON.stringify(products)) : localStorage.removeItem(SAVEDPRODUCTS);
    !!plans.length ? localStorage.setItem(SAVEDPLANS, JSON.stringify(plans)) : localStorage.removeItem(SAVEDPLANS);
  }

  return (
    <div className="reviewContainer">
      <div className="header">
        <span>Review</span>
      </div>
      <div className="content">
      <div className="productsContent">
        <div className="info">
          <h2>Your security system</h2>
          <p>
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
        </div>
        {steps.map(
          (step: Step) =>
            !step.isPlan && (
              <div className="step" key={step.id}>
                <span className="stepName">{step.name}</span>
                <div className="products">
                  {selectedProducts.map(
                    (product: SelectedProduct) =>
                      product.stepId === step.id && (
                        <div className="product" key={product.id}>
                          <img
                            src={
                              product.image ||
                              `${icons[product.name.toLowerCase().replaceAll(" ", "")]}`
                            }
                            alt={product.name}
                          />
                          <span className="productName">{product.name}</span>
                          <QuantitySelector
                            counter={product.quantity}
                            increaseQuantity={() =>
                              handleQuantityIncrement(product)
                            }
                            decreaseQuantity={() =>
                              handleQuantityDecrement(product)
                            }
                            disabledDecrementBtn={product.quantity === 0}
                            disabledIncrementBtn={
                              product.quantity === product.limitedQuantity
                            }
                          />
                          <div className="price">
                            <span
                              className={
                                product.afterDiscount > 0
                                  ? "beforeDiscount"
                                  : ""
                              }
                            >
                              ${product.beforeDiscount}
                            </span>
                            {product.afterDiscount > 0 && (
                              <span>
                                {Number(product.afterDiscount) === 0
                                  ? "FREE"
                                  : `$${product.afterDiscount}`}
                              </span>
                            )}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            ),
        )}
        {planStep && (
          <div className="step">
            <span className="stepName">{planStep.name}</span>
            <div className="products">
              {plans &&
                plans.length > 0 &&
                plans.map(
                  (plan: SelectedPlan) =>
                    plan.stepId === planStep.id && (
                      <div className="plan product" key={plan.id}>
                        <img
                          src={
                            plan.image ||
                            `${icons[plan.name.toLowerCase().replaceAll(" ", "")]}`
                          }
                          style={{ background: "none" }}
                          alt={plan.name}
                        />
                        <span className="productName">{plan.name}</span>
                        <div className="price">
                          <span
                            className={
                              plan.afterDiscount > 0 ? "beforeDiscount" : ""
                            }
                          >
                            ${plan.beforeDiscount}/mo
                          </span>
                          {plan.afterDiscount > 0 && (
                            <span>
                              {Number(plan.afterDiscount) === 0
                                ? "FREE"
                                : `$${plan.afterDiscount}/mo`}
                            </span>
                          )}
                        </div>
                      </div>
                    ),
                )}
            </div>
          </div>
        )}
        <Shipping />
      </div>
      <Checkout totalPrice={totalPrice} handleSaveLater={saveProductsLater}/>
      </div>
    </div>
  );
};

export default BundleReview;
