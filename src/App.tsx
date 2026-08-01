import { useEffect, useState } from "react";
import "./App.css";
import "./assets/fonts/fonts.css";
import BundleBuilder from "./components/BundleBuilder/BundleBuilder";
import BundleReview from "./components/BundleReview/BundleReview";
import { SelectedPlan, SelectedProduct, Step } from "./models/bundle";
import { SAVEDPLANS, SAVEDPRODUCTS } from "./constants/quantityActions";



function App() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );
  const [selectedPlans, setSelectedPlans] = useState<SelectedPlan[]>([]);

  useEffect(() => {
    fetch("/data/bundle-builder-data.json")
      .then((data) => data.json())
      .then((res) => {
        setSteps(res.steps);
      });
      getSavedData();
  }, []);

  const getSavedData = () => {
    const savedProducts = localStorage.getItem(SAVEDPRODUCTS);
    const savedPlans = localStorage.getItem(SAVEDPLANS);
    savedProducts && handleSelectedProducts(JSON.parse(savedProducts));
    savedPlans && handleSelectedPlans(JSON.parse(savedPlans));
  };

  const handleSelectedProducts = (products: SelectedProduct[]) => {
    setSelectedProducts(products);
  };

  const handleSelectedPlans = (plans: SelectedPlan[]) => {
    setSelectedPlans(plans);
  };

  return (
    <div className="bundle-builder">
      <BundleBuilder
        steps={steps}
        products={selectedProducts}
        plans={selectedPlans}
        selectProducts={handleSelectedProducts}
        updatePlans={handleSelectedPlans}
      />
      <BundleReview
        steps={steps}
        products={selectedProducts}
        updateProducts={handleSelectedProducts}
        plans={selectedPlans}
      />
    </div>
  );
}

export default App;
