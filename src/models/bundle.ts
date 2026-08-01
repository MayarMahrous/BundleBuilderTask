export interface Step {
  id: number,
  title: string,
  name: string,
  isPlan?: boolean
  products: Product[]
}
export interface Product {
  id: number,
  title: string,
  description: string,
  price: number,
  discount: number,
  image?: string,
  quantity?: number
  types?: ProductType[],
}
export interface ProductType {
  color: string,
  image: string,
  quantity: number
}
export interface SelectedProduct {
  id: string,
  stepId: number,
  productId: number,
  image: string,
  name: string,
  color: string,
  quantity: number,
  limitedQuantity: number,
  price: number,
  discount: number,
  beforeDiscount:number,
  afterDiscount: number
}

export interface SelectedPlan {
  id: string,
  stepId: number,
  productId: number,
  image: string,
  name: string,
  discount: number,
  beforeDiscount:number,
  afterDiscount: number
  isSelected: boolean
}

export interface CheckoutPrice{
  beforeDiscount: number, 
  afterDiscount: number
}