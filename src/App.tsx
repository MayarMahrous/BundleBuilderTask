import { useEffect, useState } from "react";
import "./App.css";
import "./assets/fonts/fonts.css";
import BundleBuilder from "./components/BundleBuilder/BundleBuilder";
import BundleReview from "./components/BundleReview/BundleReview";
import { SelectedPlan, SelectedProduct, Step } from "./models/bundle";
import { BUILDERACTION, REVIEWACTION, SAVEDPLANS, SAVEDPRODUCTS } from "./constants/quantityActions";
import { productsService } from "./services/productsService";



function App() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );
  const [selectedPlans, setSelectedPlans] = useState<SelectedPlan[]>([]);
  const [action, setAction] = useState<string>("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data : { steps: Step[] } = await productsService.getAll();
        setSteps(data.steps);
        getSavedData();
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    loadProducts();
    getSavedData();
  }, []);

  const getSavedData = () => {
    const savedProducts = localStorage.getItem(SAVEDPRODUCTS);
    const savedPlans = localStorage.getItem(SAVEDPLANS);
    savedProducts && handleSelectedProducts(JSON.parse(savedProducts));
    savedPlans && handleSelectedPlans(JSON.parse(savedPlans));
  };

  const handleSelectedProducts = (products: SelectedProduct[],action?: string) => {
    setSelectedProducts(products);
    if(action){
      setAction(action);
    }
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
        selectProducts={(products : SelectedProduct[]) => handleSelectedProducts(products, BUILDERACTION)}
        action={action}
        updatePlans={handleSelectedPlans}
      />
      <BundleReview
        steps={steps}
        products={selectedProducts}
        updateProducts={(products : SelectedProduct[]) => handleSelectedProducts(products, REVIEWACTION)}
        plans={selectedPlans}
      />
    </div>
  );
}

export default App;
