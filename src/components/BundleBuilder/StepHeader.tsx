import camerasIcon from "../../assets/icons/cameras.svg";
import planIcon from "../../assets/icons/plans.svg";
import sensorsIcon from "../../assets/icons/sensors.svg";
import protectionIcon from "../../assets/icons/protection.svg";
import { SelectedPlan, SelectedProduct, Step } from "../../models/bundle";

interface StepHeaderProps {
  step: Step;
  selectedItems: any;
  currentStep: string;
  selectStep: (name: string) => void;
}

const StepHeader = ({
  step,
  selectedItems,
  currentStep,
  selectStep,
}: StepHeaderProps) => {
  const icons: Record<string, string> = {
    cameras: camerasIcon,
    plan: planIcon,
    sensors: sensorsIcon,
    accessories: protectionIcon,
  };

    const selectedItemsCount : number =  selectedItems.filter((item:SelectedPlan | SelectedProduct) => item.stepId == step.id).length;

  return (
    <div className="step-header">
      <div className="step">
        <img src={icons[step.name.toLowerCase()]} alt={step.name} />
        <h1>{step.title}</h1>
      </div>
      <div className="selection">
        {selectedItemsCount > 0 && <span>{selectedItemsCount} selected</span>}
        <div
          className="chevronHitArea"
          role="button"
          aria-label="Toggle step"
          aria-expanded={currentStep === step.name}
          onClick={() => selectStep(step.name)}
        >
          <div
            className={`chevron ${currentStep === step.name ? "upChevron" : "downChevron"}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StepHeader;
