# 🌱 Krishi Kendra

**A full-stack agricultural marketplace connecting farmers with agricultural product sellers.**

Krishi Kendra is a web-based marketplace where farmers can discover and purchase agricultural supplies, while sellers can publish product listings, manage inventory, and review orders for their products. The application is built with React and Vite on the frontend and Node.js, Express, and MongoDB on the backend.

<p align="center">
  <a href="https://krishi-kendra1.vercel.app/"><strong>🌐 Live Application</strong></a>
  ·
  <a href="https://github.com/sampatakumar/Krishi-Kendra"><strong>📦 Source Code</strong></a>
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [What the Project Solves](#-what-the-project-solves)
- [Features](#-features)
- [User Roles and Workflows](#-user-roles-and-workflows)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Deployment](#-deployment)
- [Current Limitations](#-current-limitations)
- [Future Enhancements](#-future-enhancements)
- [Security Notes](#-security-notes)
- [Contributing](#-contributing)
- [License](#-license)

## 🌾 Overview

Krishi Kendra provides a digital storefront for commonly used agricultural supplies. It supports two account roles:

- **Farmer:** browses available products, searches and filters the catalogue, manages a shopping cart, and places orders.
- **Seller:** publishes agricultural products, edits listings, updates stock, and views orders containing the seller's products.

The marketplace catalogue is organised into categories such as seeds, fertilizers, pesticides, machinery, tools, and other agricultural supplies. Product information includes a title, description, price, category, image, available stock, and seller reference.

> **Project scope:** The current codebase implements an agricultural e-commerce marketplace. It does not currently implement live mandi prices, weather forecasting, government-scheme discovery, crop diagnosis, or an AI farming assistant. Those are possible future modules, not existing features.

## 🎯 What the Project Solves

Agricultural buyers often need to search across different suppliers to find seeds, fertilizers, equipment, and other farm essentials. Krishi Kendra aims to bring product discovery and supplier-to-farmer ordering into one web application.

The project focuses on:

1. Providing a single catalogue for agricultural supplies.
2. Giving sellers a self-service interface to publish and maintain product listings.
3. Separating buyer and seller experiences through role-based backend authorization.
4. Supporting a cart and order workflow with stock checks.
5. Providing an online payment integration path through Razorpay, alongside a Cash on Delivery checkout option.

## ✨ Features

### 1. 🛍️ Agricultural Marketplace

- Landing page with a marketplace hero section and agricultural product category tiles.
- Product catalogue loaded from the backend API.
- Product search by title.
- Category filtering.
- Out-of-stock products are excluded from the public catalogue endpoint.
- Product cards link to an individual product detail page.
- Product prices are displayed in Indian Rupees (₹).

**Why it matters:** Farmers can discover multiple types of agricultural supplies from one place instead of navigating separate supplier catalogues.

### 2. 📦 Product Details

Each product detail page displays:

- Product title and image.
- Product description.
- Price.
- Product category.
- Seller/supplier name when available.
- Available stock quantity.
- Quantity selector.
- Add-to-cart action.

The backend provides a public endpoint to retrieve an individual product by its MongoDB ID.

### 3. 👨‍🌾 Farmer Accounts

- Farmer registration with full name, username, email, and password.
- Farmer and seller role selection during registration.
- Login using email and password.
- Password hashing using bcryptjs.
- JWT-based authentication.
- Logout endpoint.
- Farmer-only purchasing behaviour in the frontend.

The backend stores a hashed password rather than the submitted plain-text password.

### 4. 🧑‍💼 Seller Accounts and Dashboard

Sellers have a dedicated dashboard that provides:

- A list of the seller's own product listings.
- Add-product form.
- Product title, description, price, category, image URL, and stock fields.
- Product deletion.
- Stock quantity updates.
- Seller order listing.
- Summary values such as listed-product count and seller order revenue.

The backend checks that a seller owns a product before allowing that product to be updated or deleted.

### 5. 🛒 Shopping Cart

- Add products to the cart.
- Increase or decrease item quantities.
- Remove individual items.
- Clear the cart after a successful order.
- Calculate the cart subtotal.
- Persist cart contents in browser localStorage so the cart can survive a page refresh.
- Display the total item count in the navigation bar.

The cart is currently maintained on the client side. It is not stored as a server-side cart in MongoDB.

### 6. 🚚 Order Management

- Checkout requires a shipping address containing street, city, state, and postal code.
- Backend validates that order items exist.
- Backend checks that each product exists.
- Backend checks available stock before accepting an order.
- The order stores the buyer, product references, quantities, purchase-time item prices, total amount, and shipping address.
- Buyers can retrieve their own orders.
- Sellers can retrieve orders containing their products.
- Seller order responses filter the order items to the current seller's products and calculate a seller-specific total.

**Important:** The current implementation creates orders and reduces stock, but does not yet provide a complete order-status management workflow for sellers.

### 7. 💳 Payment Integration

The backend includes Razorpay integration endpoints for:

- Creating a Razorpay order in INR.
- Converting the supplied rupee amount to paise.
- Verifying a payment signature using HMAC-SHA256 and the Razorpay secret.

The cart page also includes a Cash on Delivery checkout path.

**Payment integration status:** Razorpay order creation and signature verification are present in the code. The complete payment-to-order lifecycle should be strengthened before production use. See [Current Limitations](#-current-limitations).

### 8. 📱 Responsive User Interface

- Responsive navigation with a mobile menu.
- Marketplace layouts for browsing product categories.
- Dedicated login and registration screens.
- Product detail, cart, and seller dashboard pages.
- Lucide icons.
- Tailwind CSS utility styling.

### 9. 🌱 Sample Agricultural Catalogue

The backend includes a product seeding script with sample agricultural inventory across the supported product categories. It can be used to populate a development database for demonstration and testing.

Seed data is sample data and should not be treated as verified supplier inventory or live commercial pricing.

---

## 👥 User Roles and Workflows

| Capability | Farmer | Seller |
|---|:---:|:---:|
| Register and log in | ✅ | ✅ |
| Browse product catalogue | ✅ | ✅ |
| Search and filter products | ✅ | ✅ |
| View product details | ✅ | ✅ |
| Add products to cart | ✅ | — |
| Place orders | ✅ | — |
| Manage own product listings | — | ✅ |
| Update own product stock | — | ✅ |
| View orders containing own products | — | ✅ |

### Farmer workflow

1. Create a farmer account.
2. Sign in to Krishi Kendra.
3. Browse or search the agricultural product catalogue.
4. Open a product to view its details and stock.
5. Add products to the cart and adjust quantities.
6. Enter a shipping address.
7. Choose the available checkout method.
8. Submit the order.

### Seller workflow

1. Create an account and select the seller role.
2. Sign in.
3. Open the Seller Dashboard.
4. Add a product with its description, category, price, image, and stock.
5. Update stock or remove a listing when required.
6. Review orders that contain the seller's products.

---

## 🧰 Technology Stack

| Layer | Technologies |
|---|---|
| Frontend framework | React 18 |
| Frontend tooling | Vite 5 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 4, PostCSS, Autoprefixer |
| Icons | Lucide React |
| HTTP client | Axios |
| Backend runtime | Node.js |
| Backend framework | Express 5 |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password security | bcryptjs |
| Payment gateway | Razorpay |
| Frontend hosting configuration | Vercel |
| Backend hosting configuration | Render |

---

## 🏗️ Architecture

Krishi Kendra follows a frontend/backend architecture.

```text
┌─────────────────────────────────────────────┐
│              React + Vite Client            │
│                                             │
│  Marketplace · Auth · Product Details       │
│  Cart · Checkout · Seller Dashboard         │
└──────────────────────┬──────────────────────┘
                       │ Axios / HTTP
                       │ JSON + credentials
                       ▼
┌─────────────────────────────────────────────┐
│              Express REST API               │
│                                             │
│  User Routes · Product Routes               │
│  Order Routes · Payment Routes              │
│                                             │
│  JWT Middleware · Seller Role Checks        │
└───────────────┬─────────────────┬───────────┘
                │                 │
                ▼                 ▼
       ┌────────────────┐  ┌─────────────────┐
       │    MongoDB     │  │    Razorpay     │
       │ Users          │  │ Order creation  │
       │ Products       │  │ Signature check │
       │ Orders         │  └─────────────────┘
       └────────────────┘
```

### Request flow

1. The React client sends requests through Axios.
2. Express routes direct requests to the relevant controller.
3. Protected routes run JWT verification middleware.
4. Seller-only product routes additionally check the authenticated user's role.
5. Mongoose reads or writes the MongoDB collections.
6. The API returns JSON responses to the frontend.

---

## 📁 Project Structure

```text
Krishi-Kendra/
│
├── agriHub-Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── order.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── product.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── db/
│   │   │   └── db.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── order.model.js
│   │   │   ├── product.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── order.route.js
│   │   │   ├── payment.route.js
│   │   │   ├── product.route.js
│   │   │   └── user.route.js
│   │   │
│   │   └── app.js
│   │
│   ├── .env.example
│   ├── package.json
│   ├── seedProducts.js
│   └── server.js
│
├── agrihub-frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Cart.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SellerDashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── render.yaml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Node.js (LTS recommended)
- npm
- MongoDB local instance or MongoDB Atlas database
- Git
- Razorpay test credentials (only if testing online payments)

### 1. Clone the repository

```bash
git clone https://github.com/sampatakumar/Krishi-Kendra.git
cd Krishi-Kendra
```

### 2. Configure the backend

```bash
cd agriHub-Backend
npm install
```

Create a `.env` file in the `agriHub-Backend/` directory using `.env.example` as a reference.

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/krishi_kendra
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
RAZER_KEY=your_razorpay_key_id
RAZER_SECRET=your_razorpay_key_secret
```

Start the backend:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:3000
```

Basic health endpoints:

- `GET /` — welcome message.
- `GET /api` — API status response.

### 3. Configure the frontend

Open a second terminal:

```bash
cd agrihub-frontend
npm install
```

Create `.env` in `agrihub-frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_RAZER_KEY=your_razorpay_key_id
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

### 4. Optional: Seed sample products

The backend contains a seed script named `seedProducts.js`. Review the script before running it, configure the backend environment, and then execute:

```bash
node seedProducts.js
```

The script creates or reuses a sample seller and inserts sample products. Re-running it can insert duplicate products, so use a clean development database or make the seeder idempotent first.

---

## 🔐 Environment Variables

### Backend — `agriHub-Backend/.env`

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the Express server |
| `MONGO_URI` | MongoDB connection URI |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `FRONTEND_URL` | Allowed frontend origin for CORS |
| `RAZER_KEY` | Razorpay key ID used by the backend |
| `RAZER_SECRET` | Razorpay secret used for order creation and signature verification |

### Frontend — `agrihub-frontend/.env`

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` | Base URL of the backend API |
| `VITE_RAZER_KEY` | Public Razorpay key ID used by the checkout UI |

The project currently uses the `RAZER_*` spelling in its environment variable names. Keep these names consistent with the code unless you update the backend and frontend references together.

**Never commit real environment files, database credentials, JWT secrets, or Razorpay secrets.** Only publish placeholder values in example files.

---

## 🔌 API Reference

Base URL for local development: `http://localhost:3000`

### Authentication and users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Register a farmer or seller |
| POST | `/api/users/login` | Public | Authenticate a user |
| GET | `/api/logout` | Public | Clear the authentication cookie |

Registration body:

```json
{
  "fullName": "Example Farmer",
  "username": "examplefarmer",
  "email": "farmer@example.com",
  "password": "replace-this-password",
  "role": "farmer"
}
```

The supported roles are `farmer` and `seller`.

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List in-stock products |
| GET | `/api/products?category=Seeds` | Public | Filter by category |
| GET | `/api/products?search=rice` | Public | Search product titles |
| GET | `/api/products/:id` | Public | Get product details |
| POST | `/api/products` | Seller | Create a product |
| GET | `/api/products/seller/myproducts` | Seller | List current seller's products |
| PUT | `/api/products/:id` | Seller/Owner | Update an owned product |
| DELETE | `/api/products/:id` | Seller/Owner | Delete an owned product |

Example product body:

```json
{
  "title": "Premium Paddy Seeds",
  "description": "Agricultural seed product description",
  "price": 850,
  "category": "Seeds",
  "image": "https://example.com/product-image.jpg",
  "stock": 25
}
```

Supported categories in the product schema:

- `Seeds`
- `Fertilizers`
- `Pesticides`
- `Machinery`
- `Tools`
- `Other`

### Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Authenticated | Create an order |
| GET | `/api/orders/myorders` | Authenticated | Get current buyer's orders |
| GET | `/api/orders/:id` | Authenticated | Get an order by ID (with authorization check) |
| GET | `/api/orders/seller/myorders` | Authenticated | Get orders containing current seller's products |

Example order body:

```json
{
  "items": [
    {
      "product": "MONGODB_PRODUCT_ID",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "12 Farm Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "zipCode": "560001"
  }
}
```

The backend calculates the order total from the current database product prices; clients should not be trusted to supply authoritative prices.

### Payments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payment/create-order` | Authenticated | Create a Razorpay order |
| POST | `/api/payment/verify-payment` | Authenticated | Verify Razorpay payment signature |

Payment creation body:

```json
{
  "amount": 1250
}
```

Payment verification body:

```json
{
  "razorpay_order_id": "order_id_from_razorpay",
  "razorpay_payment_id": "payment_id_from_razorpay",
  "razorpay_signature": "signature_from_checkout"
}
```

Protected endpoints accept the JWT through the authentication cookie or an `Authorization: Bearer <token>` header.

---

## 🗄️ Database Models

### User

| Field | Description |
|---|---|
| `fullName` | User's full name |
| `username` | Unique username |
| `email` | Unique email address |
| `password` | bcrypt password hash |
| `role` | `farmer` or `seller` |
| `timestamps` | Creation and update dates |

### Product

| Field | Description |
|---|---|
| `title` | Product name |
| `description` | Product information |
| `price` | Price in INR |
| `category` | One of the supported product categories |
| `image` | Product image URL |
| `stock` | Available quantity |
| `seller` | Reference to the seller's User document |
| `timestamps` | Creation and update dates |

### Order

| Field | Description |
|---|---|
| `buyer` | Reference to the buyer's User document |
| `items` | Product reference, quantity, and purchase-time price |
| `totalAmount` | Calculated order total |
| `shippingAddress` | Street, city, state, and postal code |
| `paymentMethod` | Payment method field (defaults to Cash on Delivery) |
| `razorpayOrderId` | Optional Razorpay order reference |
| `razorpayPaymentId` | Optional Razorpay payment reference |
| `razorpaySignature` | Optional payment signature |
| `status` | Pending, Processing, Shipped, Delivered, or Cancelled |
| `timestamps` | Creation and update dates |

---

## ☁️ Deployment

The repository contains deployment configuration for:

- **Frontend:** Vercel configuration in `agrihub-frontend/vercel.json`.
- **Backend:** Render configuration in the root `render.yaml`.

### Frontend deployment

1. Import the repository into Vercel.
2. Set the project root directory to `agrihub-frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Configure `VITE_BACKEND_URL` with the deployed backend URL.
6. Configure `VITE_RAZER_KEY` if enabling Razorpay checkout.
7. Deploy and verify the frontend-to-backend connection.

### Backend deployment

1. Create a Node.js web service on Render.
2. Set the root directory to `agriHub-Backend`.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Configure `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `RAZER_KEY`, and `RAZER_SECRET` as service environment variables.
5. Update the frontend's `VITE_BACKEND_URL` to the deployed API URL.
6. Confirm the CORS allowlist includes the exact deployed frontend origin.

The root Render blueprint currently declares the backend service. The frontend has its own Vercel configuration.

---

## ⚠️ Current Limitations

The following points are based on the current repository implementation and should be addressed before treating the application as production-ready:

1. **Order/payment lifecycle:** Payment signature verification is implemented, but the order controller does not yet persist the payment fields sent by the frontend. Payment verification and order creation should be tied together on the server.
2. **Stock consistency:** Stock is reduced one product at a time before the order document is saved. If a later item or order save fails, stock can become inconsistent. Use MongoDB transactions and atomic stock updates.
3. **Authentication state:** The frontend stores basic user information in localStorage. The backend sets an HTTP-only cookie, while the frontend also attempts to read a token from `document.cookie` in checkout code. HTTP-only cookies cannot be read by JavaScript. Standardise on secure cookie-based authentication or a carefully designed bearer-token flow.
4. **Logout cookie:** The logout route clears the cookie, but frontend state cleanup should run reliably even if the request fails.
5. **Role validation at registration:** The registration endpoint currently accepts a role from the request body. Validate roles server-side and do not allow users to self-assign privileged roles.
6. **Input validation:** Add schema-based request validation, stronger password rules, sanitisation, and consistent error responses.
7. **Seller order access:** The seller order endpoint filters seller-owned products, but the order detail authorization logic should be reviewed and made explicit for multi-seller orders.
8. **Order status updates:** The order schema has status values, but seller-facing status update routes and a complete fulfilment workflow are not present.
9. **Demo seed data:** The seeder contains a sample seller account and fixed demo credentials. Do not use those credentials in a public or production environment.
10. **Testing:** The backend package currently has a placeholder test script that exits with an error. Add real unit and integration tests.
11. **API configuration:** Confirm production CORS origins, cookie settings, HTTPS, and environment variables for each deployed environment.
12. **No admin console:** The current frontend routes do not include an administrator dashboard or moderation tools.

---

## 🔮 Future Enhancements

The following are proposed improvements, not features currently implemented.

### Priority 1 — Reliability, security, and production readiness

- [ ] Implement robust request validation with Zod, Joi, or express-validator.
- [ ] Add rate limiting and brute-force protection to authentication endpoints.
- [ ] Add email verification and password reset.
- [ ] Use secure, HTTP-only, same-site-aware cookies consistently.
- [ ] Prevent public self-assignment of privileged roles.
- [ ] Add MongoDB transactions or atomic inventory operations for checkout.
- [ ] Verify Razorpay payment and create the paid order in one trusted backend workflow.
- [ ] Add payment status, refund handling, and webhook verification.
- [ ] Add automated backend and frontend tests.
- [ ] Add structured logging and production error monitoring.

### Priority 2 — Better marketplace experience

- [ ] Product sorting by price, newest, popularity, and availability.
- [ ] Pagination or infinite scrolling for large catalogues.
- [ ] Advanced filters for price range, brand, crop, manufacturer, and seller.
- [ ] Product ratings and verified buyer reviews.
- [ ] Wishlist and saved products.
- [ ] Product comparison.
- [ ] Multiple product images and image upload/storage.
- [ ] Seller profile pages with business details and verification status.
- [ ] Product questions and answers.
- [ ] Recently viewed products and personalised recommendations.

### Priority 3 — Complete order and delivery management

- [ ] Buyer order history and detailed order tracking.
- [ ] Seller actions to accept, process, dispatch, and complete orders.
- [ ] Order status timeline and notifications.
- [ ] Invoice generation and downloadable receipts.
- [ ] Shipping provider integration and tracking IDs.
- [ ] Cancellation, return, and refund workflows.
- [ ] Delivery fee calculation by location and order weight.
- [ ] Support for multiple sellers in one cart with clear fulfilment per seller.

### Priority 4 — Farmer-focused capabilities

- [ ] Kannada, Hindi, and other regional language support.
- [ ] Voice search and voice-assisted navigation for accessibility.
- [ ] Low-bandwidth mode and installable Progressive Web App (PWA).
- [ ] WhatsApp/SMS order notifications.
- [ ] Local supplier discovery based on farmer location.
- [ ] Crop- and season-based product recommendations.
- [ ] Agricultural knowledge centre with reviewed farming guides.
- [ ] Government scheme directory with official source links.
- [ ] Mandi price dashboard using trusted government data sources.
- [ ] Weather forecasts and location-based weather advisories.

### Priority 5 — Intelligence and ecosystem integrations

- [ ] AI farming assistant for general agricultural questions, with cited and trusted sources.
- [ ] Crop disease identification from uploaded images, with clear confidence and expert-review guidance.
- [ ] Soil and crop recommendation workflows.
- [ ] Demand forecasting and inventory insights for sellers.
- [ ] Price trend analytics for agricultural products.
- [ ] Farm equipment rental marketplace.
- [ ] Direct farmer-to-buyer produce marketplace.
- [ ] IoT integration for soil moisture and irrigation monitoring.

### Priority 6 — Administration and platform operations

- [ ] Admin dashboard for users, sellers, products, orders, and platform metrics.
- [ ] Seller verification and product moderation.
- [ ] Report listing and dispute resolution workflows.
- [ ] Audit logs for sensitive actions.
- [ ] Role and permission management.
- [ ] Analytics for sales, order volume, popular categories, and active users.

---

## 🔒 Security Notes

- Keep `.env` files out of version control.
- Use a strong, randomly generated `JWT_SECRET`.
- Use Razorpay test mode during development.
- Never expose `RAZER_SECRET` to frontend code.
- Validate product IDs, quantities, prices, and shipping details on the backend.
- Recalculate all order totals using database prices.
- Verify payment signatures on the backend and validate webhook signatures before processing webhook events.
- Apply HTTPS in production.
- Restrict CORS to trusted frontend origins.
- Review the demo seller seeding logic before running it outside a local development database.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and test them locally.
4. Commit with a descriptive message:

   ```bash
   git commit -m "feat: describe your change"
   ```

5. Push your branch and open a Pull Request.

For substantial changes, consider opening an issue first to discuss the proposed implementation.

## 📄 License

No license file is currently present in this repository. Unless a license is added, the project should not be assumed to grant permission for reuse, modification, or redistribution. Add an appropriate license (for example, MIT) if you intend to make the project openly reusable.

---

<p align="center">
  <strong>🌱 Krishi Kendra — Bringing agricultural supplies closer to farmers.</strong>
  <br />
  Built with React, Node.js, Express, and MongoDB.
</p>
