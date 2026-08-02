# Bundle Builder

A step-by-step product bundle builder that lets customers choose cameras, sensors, a monitoring plan, and extra protection add-ons — before checking out.

## Overview

The app walks the user through a guided flow made up of sequential steps (for example: Choose your cameras, Choose your plan, Choose your sensors, Add extra protection). Each step presents a set of products, and the user builds their own bundle before heading to checkout.

## Features

- **Steps** — Products are grouped into steps (cameras, sensors, plans, protection)
- **Product selection** — Each product supports:
  - Adjusting **quantity** with +/- controls
  - Choosing a **color/variant** on some products (e.g. White, Grey, Black)
  - Live price updates, including discounted pricing where applicable
- **Cart and review** — Selected products across all steps are collected into a review summary showing what's been added (cameras, sensors, accessories, plan) before checkout.
- **Checkout** — Once the bundle is complete, the user can proceed to checkout with their selected items and plan, including the total price before and after discount.
- **Save my system for later** — Users can save their selected items so the saved items are retrieved automatically the next time they open the site.
- **Responsive design** — Layout adapts across desktop, tablet, and mobile screen sizes.

## Tech stack

- React with TypeScript
- CSS for styling
- Local JSON data source for product information

## Project structure

```text
public/
  data/                     # Local JSON data for steps and products
  images/                   # Product images referenced by the JSON data
src/  
  assets/                   # Fonts, SVG icons
  components/ 
    BundleBuilder/  
      BundleBuilder.tsx     # Top-level steps with products container
      ProductCard.tsx       # Individual product card showing details with quantity and variant selection
      StepHeader.tsx        # Step title, counter of selected products, and collapse/expand
    BundleReview/ 
      BundleReview.tsx      # Cart review summary before checkout
      Checkout.tsx          # Final checkout: total price before/after discount, save-for-later
    common/
      QuantitySelector.tsx  # Product quantity selection used in bundle builder and review
  constants/                # Shared constants like quantity actions and storage keys
  services/                 # Data-fetching services (e.g. productsService)
  models/                   # TypeScript interfaces (Step, Product, etc.)
  App.tsx
```

## Getting started

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/MayarMahrous/BundleBuilderTask
cd BundleBuilderTask
npm install
```

### Running locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for production

```bash
npm run build
```

## Data source

Steps and products data are loaded from a local JSON file (`public/data/bundle-builder-data.json`), structured as a list of steps, each containing its own list of products with pricing, discount, quantity, and variant information.

## Possible improvements

- **State management with Context and `useReducer`** — Selected products state is currently passed down through props. Since this state is needed across multiple sibling components (steps, review summary, checkout), introducing a `CartContext` with a `useReducer` would centralize the state updates (add product, update quantity, change variant) and make sharing data between components simpler and easier to maintain as the app grows.