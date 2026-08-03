import { useEffect, useState } from "react";
import {
  Product,
  ProductType,
  SelectedPlan,
  SelectedProduct,
  Step,
} from "../../models/bundle";
import camUnlimitedIcon from "../../assets/icons/cam-unlimited.svg";
import { BUILDERACTION, DECREMENT, INCREMENT, REVIEWACTION } from "../../constants/quantityActions";
import QuantitySelector from "../common/QuantitySelector";

interface ProductCardProps {
  step: Step;
  product: Product;
  selectedProducts: SelectedProduct[];
  selectedPlans: SelectedPlan[];
  action: string;
  updateProduct: (
    action: string,
    step: Step,
    selectedProduct: Product,
    selectedType?: ProductType,
  ) => void;
  updatePlan: (step:Step, product: Product, isChecked: boolean) => void;
}

const ProductCard = ({
  step,
  product,
  selectedProducts,
  selectedPlans,
  updateProduct,
  updatePlan,
  action
}: ProductCardProps) => {
  const icons: Record<string, string> = {
    camunlimited: camUnlimitedIcon,
  };
  const [selectedProductColor, setSelectedProductColor] = useState<ProductType>(
    { color: "", image: "", quantity: 0 },
  );
  const isColorSelected = !!selectedProductColor.color;
  const [counter, setCounter] = useState<number>(0);
  const [planChecked, setPlanChecked] = useState<boolean>(false);

  useEffect(() => {
    const productExist = selectedProducts.filter(
      (item: SelectedProduct) =>
        item.stepId === step.id && item.productId === product.id,
    );
    if (!!productExist.length) {
      setSelectedProductColor({
        color: productExist[0].color,
        quantity: productExist[0].limitedQuantity,
        image: productExist[0].image,
      });
      setCounter(productExist[0].quantity);
    }

    const planExist = selectedPlans.find((item:SelectedPlan) => item.stepId === step.id && item.productId === product.id);
    if(planExist){
      setPlanChecked(planExist.isSelected);
      updatePlan(step,product,planExist.isSelected);
    }
  }, []);

  useEffect(() => {
    const productCustomId = `${product.id}-${product.title.toLowerCase().replaceAll(" ", "-")}${selectedProductColor.color ? "-" + selectedProductColor.color : ""}`;
    //reset counter and color selection on removing product from review
    if (selectedProducts.length == 0) {
      setCounter(0);
      setSelectedProductColor({ color: "", image: "", quantity: 0 });
    }
    const productExist = selectedProducts.find(
      (item: SelectedProduct) => item.id === productCustomId);
    const productWithDifferentColor = selectedProducts.filter(
      (item: SelectedProduct) => item.stepId === step.id && item.productId === product.id);
    if (productExist) {
      setCounter(productExist?.quantity);
      productExist.color && setSelectedProductColor({ color: productExist.color, image: productExist.image, quantity: productExist.limitedQuantity });
    }else{
      if(action === BUILDERACTION){
        return;
      }
      //if I unselect item from review remove it from builder
      if(!!productWithDifferentColor.length){
        setCounter(productWithDifferentColor[0].quantity);
        setSelectedProductColor({ color: productWithDifferentColor[0].color, image: productWithDifferentColor[0].image, quantity: productWithDifferentColor[0].limitedQuantity });
        return;
      }
      setCounter(0);
      setSelectedProductColor({ color: "", image: "", quantity: 0 });
    }
  }, [selectedProducts]);

  const handleColorSelection = (
    selectedProduct: Product,
    selectedColor: ProductType,
  ) => {
    setSelectedProductColor((prev) =>
      prev.color === selectedColor.color
        ? { color: "", image: "", quantity: 0 }
        : selectedColor,
    );
    const productCustomId = `${selectedProduct.id}-${selectedProduct.title.toLowerCase().replaceAll(" ", "-")}-${selectedColor.color}`;
    const productAlreadyExist = selectedProducts.find(
      (item) => item.id === productCustomId,
    );
    productAlreadyExist
      ? setCounter(productAlreadyExist.quantity)
      : setCounter(0);
  };

  const handleQuantityIncrement = () => {
    if (
      counter ===
      (!product.types?.length
        ? product.quantity
        : selectedProductColor.quantity)
    ) {
      return;
    }
    setCounter((prev) => prev + 1);
    !!product.types?.length
      ? updateProduct(INCREMENT, step, product, selectedProductColor)
      : updateProduct(INCREMENT, step, product);
  };

  const handleQuantityDecrement = () => {
    if (counter === 0) {
      return;
    }
    setCounter((prev) => prev - 1);
    !!product.types?.length
      ? updateProduct(DECREMENT, step, product, selectedProductColor)
      : updateProduct(DECREMENT, step, product);
  };

  const handlePlanSelection = (event:React.ChangeEvent<HTMLInputElement>) => {
    setPlanChecked(prevChecked => !prevChecked);
    updatePlan(step,product,event.target.checked);
  }

  const productAfterDiscount =
    product.discount === 100.0
      ? "FREE"
      : `$${(product.price - product.price * (product.discount / 100)).toFixed(2)}`;

  return (
    <div
      className={`${counter > 0 || planChecked ? "productCard selected" : "productCard"}`}
      key={`${step.id}-${product.id}`}
    >
      <div className="productThumbnail">
        {product.discount !== 0.0 && (
          <span className="discount">Save {Number(product.discount)}%</span>
        )}
        {product.types && product.types.length > 0 ? (
          <img src={product.types[0].image} alt={product.title} />
        ) : (
          <img
            src={
              product.image ||
              `${icons[product.title.toLowerCase().replaceAll(" ", "")]}`
            }
            alt={product.title}
          />
        )}
      </div>
      <div className="productInfo">
        <h1>{product.title}</h1>
        <p>
          {product.description} <a href="#">Learn More</a>
        </p>
        <div className="productTypes">
          {product.types &&
            product.types.length > 0 &&
            product.types.map((type: ProductType) => (
              <div
                className={`${isColorSelected && selectedProductColor?.color === type.color ? "sample selected" : "sample"}`}
                onClick={() => handleColorSelection(product, type)}
                key={`${step.id}-${product.id}-${type.color}`}
              >
                <img src={type.image} alt={`${type.color}-${product.title}`} />
                <span>{type.color}</span>
              </div>
            ))}
        </div>

        <div className="productFooter">
          {((!product.types?.length && !step.isPlan) ||
            (!!product.types?.length && isColorSelected)) && (
            <QuantitySelector
              counter={counter}
              disabledDecrementBtn={counter === 0}
              disabledIncrementBtn={
                counter ===
                (!product.types?.length
                  ? product.quantity
                  : selectedProductColor.quantity)
              }
              increaseQuantity={handleQuantityIncrement}
              decreaseQuantity={handleQuantityDecrement}
            />
          )}
          {step.isPlan && (
            <div>
              <input type="checkbox" name={product.title} checked={planChecked} onChange={(event) => handlePlanSelection(event)} />
            </div>
          )}
          <div className="price">
            <span className={product.discount > 0 ? "beforeDiscount" : ""}>
              ${product.price}
            </span>
            {product.discount > 0 && <span>{productAfterDiscount}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
