import { useEffect, useState } from "react";
import './BundleBuilder.css';
import {
  Product,
  ProductType,
  SelectedPlan,
  SelectedProduct,
  Step,
} from "../../models/bundle";
import ProductCard from "./ProductCard";
import {
  DECREMENT,
  INCREMENT,
} from "../../constants/quantityActions";
import StepHeader from "./StepHeader";

interface builderProps {
  steps: Step[];
  selectProducts: (products: SelectedProduct[]) => void;
  action: string;
  products: SelectedProduct[];
  plans: SelectedPlan[];
  updatePlans: (plans: SelectedPlan[]) => void;
}

const BundleBuilder = ({
  steps,
  selectProducts,
  products,
  plans,
  updatePlans,
  action
}: builderProps) => {
  const [selectedStep, setSelectedStep] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );
  const [selectedPlans, setSelectedPlans] = useState<SelectedPlan[]>([]);

  useEffect(() => {
    if (steps.length > 0) {
      setSelectedStep(steps[0].name);
    }
  }, [steps]);

  useEffect(() => {
    setSelectedProducts(products);
    setSelectedPlans(plans);
  }, [products, plans]);

  const handleStepSelection = (stepName: string) => {
    if (selectedStep === stepName) {
      setSelectedStep("");
      return;
    }
    setSelectedStep(stepName);
  };

  const handlePlanChange = (
    step: Step,
    product: Product,
    isChecked: boolean,
  ) => {
    const productCustomId = `${step.id}-${product.id}`;
    const planAlreadyExist = selectedPlans.find(
      (item) => item.id === productCustomId,
    );
    if (planAlreadyExist) {
      setSelectedPlans((prevPlans) => {
        const updatedPlans = isChecked
          ? prevPlans.map((item: SelectedPlan) =>
              item.id === planAlreadyExist.id
                ? { ...item, isSelected: isChecked }
                : item,
            )
          : prevPlans.filter(
              (item: SelectedPlan) => item.id !== planAlreadyExist.id,
            );
        updatePlans(updatedPlans);
        return updatedPlans;
      });
    } else {
      const plan: SelectedPlan = {
        id: productCustomId,
        image: product.image || "",
        name: product.title,
        productId: product.id,
        stepId: step.id,
        discount: product.discount,
        beforeDiscount: Number((product.price).toFixed(2)),
        afterDiscount: Number((product.price - product.price * (product.discount / 100)).toFixed(2)), 
        isSelected: isChecked,
      };

      setSelectedPlans((prevPlans) => [...prevPlans, plan]);
      updatePlans([...selectedPlans, plan]);
    }
  };

  const handleProductSelection = (
    action: string,
    step: Step,
    selectedProduct: Product,
    selectedType?: ProductType,
  ) => {
    const productCustomId = `${selectedProduct.id}-${selectedProduct.title.toLowerCase().replaceAll(" ", "-")}${selectedType ? "-" + selectedType.color : ""}`;
    const productAlreadyExist = selectedProducts.find(
      (item) => item.id === productCustomId,
    );

    if (productAlreadyExist) {
      setSelectedProducts((prevProducts) => {
        const shouldRemove =
          action === DECREMENT && productAlreadyExist.quantity === 1;

        const updatedProducts = shouldRemove
          ? prevProducts.filter(
              (prod: SelectedProduct) => prod.id !== productAlreadyExist.id,
            )
          : prevProducts.map((item: SelectedProduct) => {
              const newQuantity =
                action === INCREMENT ? item.quantity + 1 : item.quantity - 1;
              return item.id === productAlreadyExist.id
                ? {
                    ...item,
                    quantity: newQuantity,
                    beforeDiscount: Number((selectedProduct.price * newQuantity).toFixed(2)),
                    afterDiscount: Number(selectedProduct.discount) !== 0  ? Number(((selectedProduct.price - selectedProduct.price * (selectedProduct.discount / 100)) * newQuantity).toFixed(2)) : 0
                  }
                : item;
            });

        selectProducts(updatedProducts);
        return updatedProducts;
      });
    } else {
      const product: SelectedProduct = {
        id: productCustomId,
        image: selectedType ? selectedType.image : selectedProduct.image || "",
        color: selectedType ? selectedType.color : "",
        name: selectedProduct.title,
        quantity: 1,
        limitedQuantity: selectedType
          ? selectedType.quantity
          : selectedProduct.quantity || 0,
        productId: selectedProduct.id,
        stepId: step.id,
        price: selectedProduct.price,
        discount: selectedProduct.discount,
        beforeDiscount: selectedProduct.price,
        afterDiscount: Number(selectedProduct.discount) !== 0 ?  Number((selectedProduct.price - selectedProduct.price * (selectedProduct.discount / 100)).toFixed(2)) : 0,
      };

      setSelectedProducts((prevProducts) => [...prevProducts, product]);
      selectProducts([...selectedProducts, product]);
    }
  };

  return (
    <>
      {steps.length > 0 && (
        <div className="bundle-steps-container">
          {steps.map((step, index) => (
            <div
              className={`bundle-step ${selectedStep === step.name ? "selected" : ""}`}
              key={step.id}
            >
              <span className="stepCounter">
                step {index + 1} of {steps.length}
              </span>
              <div className="step-container">
                <StepHeader step={step} selectedItems={step.isPlan ? selectedPlans : selectedProducts} currentStep={selectedStep} selectStep={handleStepSelection}/> 
                {step.name == selectedStep && step.products.length > 0 && (
                  <>
                    <div className="productsContainer">
                      {step.products.map((product: Product) => (
                        <ProductCard
                          key={product.id}
                          step={step}
                          product={product}
                          selectedPlans={plans}
                          updateProduct={handleProductSelection}
                          selectedProducts={selectedProducts}
                          updatePlan={handlePlanChange}
                          action={action}
                        />
                      ))}
                    </div>
                    {step.id !== steps.length && (
                      <button
                        type="button"
                        className="nextStep"
                        onClick={() => setSelectedStep(steps[step.id].name)}
                      >
                        Next: {steps[step.id].title}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BundleBuilder;
