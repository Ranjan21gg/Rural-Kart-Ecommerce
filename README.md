# 🌾 RuralKart

### A digital marketplace for local and rural products

Rural-Kart is a full-stack e-commerce web application designed to help local artisans, rural sellers, and small businesses showcase and sell their products online.

The application provides product management, product search, shopping cart, independent direct buying, checkout, online payments, order management, transactional email notifications, and an AI-powered shopping assistant.

## 🔗 Links

- 🌐 **Live Application:** [https://rural-kart-ecommerce.vercel.app](https://rural-kart-ecommerce.vercel.app/)
- 🔧 **Backend API:** https://rural-kart-ecommerce.onrender.com
- 📦 **GitHub Repository:** (https://github.com/Ranjan21gg/Rural-Kart-Ecommerce)

- ## 📸 Screenshots

### Home Page

![Rural-Kart Home](docs/screenshots/home.png)

### Product Listing

![Product Listing](docs/screenshots/products.png)

### Product Details

![Product Details](docs/screenshots/product-details.png)

### Shopping Cart

![Shopping Cart](docs/screenshots/cart.png)

### Checkout

![Checkout](docs/screenshots/checkout.png)

### Admin Dashboard

![Admin Dashboard](docs/screenshots/admin-dashboard.png)


# 🎯 Project Goal

The goal of Rural-Kart is to provide a simple digital marketplace where local and rural sellers can showcase their products and customers can discover and purchase those products online.

The application brings the main parts of an e-commerce workflow into one platform:

- Product management
- Product discovery
- Shopping cart
- Direct product purchase
- Checkout
- Online payments
- Order management
- Customer notifications
- AI-assisted shopping

# 💡 Problem

Local artisans, rural vendors, and small sellers often depend on physical markets, local stores, or social media to sell their products.

This can make it difficult to:

- Reach customers outside their local area
- Maintain an organized product catalog
- Manage product inventory
- Handle customer orders
- Accept online payments
- Provide a structured checkout experience
- Keep customers informed about their orders

Rural-Kart addresses these problems by providing a centralized e-commerce platform for managing products and handling the customer purchase journey digitally.


# ✨ Features

## 👤 Customer Features

- User registration and login
- JWT authentication
- Automatic access-token refresh
- Customer profile
- Saved shipping address
- Browse products
- Search products
- Category filtering
- Product details
- Product availability
- Shopping cart
- Direct Buy
- Checkout
- Razorpay payment
- Order history
- Order details
- Order confirmation emails
- AI shopping assistant

  ## ⚡ Independent Direct Buy

Rural-Kart provides two separate ways to purchase a product:

1. **Add to Cart** – for normal multi-product shopping
2. **Buy Now** – for purchasing a product directly

The important part is that the **Direct Buy flow is completely independent from the shopping cart**.

A customer can purchase a product immediately without adding it to their existing cart.

```text
                    Product
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
         Add to Cart         Buy Now
              │                 │
              ▼                 ▼
             Cart         Direct Checkout
              │                 │
              ▼                 ▼
           Checkout        Order Creation
```

### Example

If a customer already has:

```text
Cart
├── Product A
└── Product B
```

and decides to immediately purchase Product C using **Buy Now**, Product C is not added to the existing cart.

The customer can complete the purchase while the original cart remains unchanged.

This keeps the two purchase flows separate:

```text
Shopping Cart
→ Multi-product shopping

Direct Buy
→ Immediate purchase of a selected product
```

## 🤖 AI Shopping Assistant

Rural-Kart includes an AI-powered chat assistant to help customers interact with the marketplace through a conversational interface.

The assistant can help with common shopping-related questions such as:

```text
"Help me find a product."

"Tell me about this product."

"How do I place an order?"

"How does checkout work?"

"How can I check my order?"
```

The goal of the assistant is to make product discovery and general shopping guidance easier without requiring the customer to navigate through every part of the application manually.

The AI assistant is integrated into the Rural-Kart shopping experience rather than being a separate application.


## 🟢 Product Availability

Products have an active/inactive status.

```text
Active
  ↓
Visible in the customer marketplace

Inactive
  ↓
Hidden from customers
but available in admin inventory
```

Administrators can temporarily deactivate a product without deleting it.

When the product is activated again, it becomes visible in the general product listing.

This allows product availability to be managed without removing the product and its associated information from the system.



## 🛠️ Admin Features

Administrators can manage the marketplace through the admin interface.

### Product Management

- Create products
- Edit products
- Delete products
- Upload product images
- Set product prices
- Manage stock quantity
- Assign categories
- Activate or deactivate products

### Category Management

- Create categories
- Edit categories
- Delete categories
- Manage category images

### Order Management

- View customer orders
- View order details
- Monitor order information

### Inventory Management

- View product inventory
- Manage stock quantities
- Control product availability

# 💳 Online Payments

Rural-Kart uses **Razorpay** for online payments.

The payment flow is:

```text
Checkout
   ↓
Create Order
   ↓
Create Razorpay Order
   ↓
Razorpay Checkout
   ↓
Customer Payment
   ↓
Backend Payment Verification
   ↓
Payment Confirmed
```

The backend verifies the payment information before confirming the transaction.

Razorpay webhook support is also used to handle payment events.



# 📧 Order Confirmation Email

Rural-Kart uses **Celery** and **Brevo SMTP** to handle transactional order confirmation emails.

After successful payment processing, the customer can receive an email containing:

- Order number
- Payment status
- Ordered products
- Product images
- Quantity
- Price
- Total amount
- Shipping address
- Link to view the order

The email processing flow is:

```text
Successful Payment
       ↓
Create Background Task
       ↓
Celery Worker
       ↓
Brevo SMTP
       ↓
Customer Email
```

Using a background task keeps email processing separate from the main application request.


# 🔐 Authentication

Rural-Kart uses JWT-based authentication with Django REST Framework and SimpleJWT.

The authentication flow is:

```text
Login
  ↓
Access Token + Refresh Token
  ↓
Frontend
  ↓
Authenticated API Request
  ↓
Django REST API
```

When the access token expires, the frontend uses the refresh token to request a new access token.

The application also uses role-based access to separate customer and administrator functionality.


# 🧰 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| JavaScript | Frontend logic |
| Vite | Build tool |
| React Router | Client-side routing |
| Axios | API communication |
| Tailwind CSS | Styling |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| Django | Web framework |
| Django REST Framework | REST API |
| SimpleJWT | JWT authentication |
| Django Filter | API filtering |
| Django ORM | Database interaction |

## Database & Background Processing

| Technology | Purpose |
|---|---|
| PostgreSQL | Production database |
| SQLite | Local development |
| Redis | Message broker |
| Celery | Background tasks |
| Celery Beat | Scheduled tasks |

## External Services

| Service | Purpose |
|---|---|
| Razorpay | Online payments |
| Cloudinary | Image storage |
| Brevo SMTP | Transactional emails |
| AI API | AI chat assistant |

## Development & Deployment

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Local development |
| Git | Version control |
| GitHub Actions | CI |
| Vercel | Frontend deployment |
| Render | Backend deployment |



# 🏗️ Architecture

```text
                         Customer
                            │
                            ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    │     Vercel      │
                    └────────┬────────┘
                             │
                          REST API
                             │
                             ▼
                    ┌─────────────────┐
                    │ Django REST API │
                    │     Render      │
                    └───────┬─────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
        PostgreSQL        Redis       Cloudinary
                            │
                            ▼
                         Celery
                            │
                            ▼
                         Brevo

                            │
                            ▼
                         Razorpay
```

The frontend communicates with the Django REST API through HTTP requests.

Django handles authentication, products, carts, orders, payments, and business logic.

PostgreSQL stores application data, Redis is used for background task processing, and Celery handles asynchronous jobs such as transactional emails.


# 📁 Project Structure

```text
Rural-Kart/
│
├── backend/
│   ├── config/
│   ├── users/
│   ├── products/
│   ├── orders/
│   ├── templates/
│   │   └── emails/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```


# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Python
- Node.js
- Docker
- Docker Compose
- Git

## Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>

cd Rural-Kart
```

## Start Backend Services

```bash
docker compose up --build
```

Run database migrations:

```bash
docker compose exec backend python manage.py migrate
```

Create an admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

## Start Frontend

```bash
cd frontend

npm install

npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```


# 🔑 Environment Variables

The application uses environment variables for configuration and sensitive credentials.

Example backend configuration:

```env
SECRET_KEY=your-secret-key
DEBUG=True

DATABASE_URL=your-database-url

REDIS_URL=redis://redis:6379/0

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret

BREVO_SMTP_LOGIN=your-login
BREVO_SMTP_KEY=your-key

DEFAULT_FROM_EMAIL=your-email

RURAL_KART_FRONTEND_URL=http://localhost:5173
```

Frontend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

> Never commit real credentials or `.env` files to GitHub.


# 🔌 API Overview

The backend REST API is organized into different application areas.

```text
/api/auth/
/api/products/
/api/categories/
/api/orders/
```

### Authentication

```http
POST /api/auth/register/
POST /api/auth/token/
POST /api/auth/token/refresh/
GET  /api/auth/me/
```

### Products

```http
GET /api/products/
GET /api/products/{slug}/
GET /api/products/admin/
POST /api/products/
PATCH /api/products/{slug}/
DELETE /api/products/{slug}/
```

### Categories

```http
GET /api/categories/
```

### Orders

```http
GET /api/orders/
GET /api/orders/{id}/
```

> API endpoints may change as the project evolves.

# 🧪 Testing

Django tests can be run using:

```bash
docker compose exec backend python manage.py test
```

Django system checks:

```bash
docker compose exec backend python manage.py check
```

---

# 🔄 Continuous Integration

GitHub Actions is used to automate backend checks.

The CI workflow can:

```text
Install dependencies
       ↓
Start PostgreSQL
       ↓
Start Redis
       ↓
Run Django checks
       ↓
Run tests
```

This helps catch issues before changes are merged into the main branch.


# ☁️ Deployment

The current deployment setup is:

```text
React Frontend
      ↓
   Vercel

Django REST API
      ↓
   Render

PostgreSQL
      ↓
Production Database

Redis + Celery
      ↓
Background Processing

Cloudinary
      ↓
Image Storage

Razorpay
      ↓
Payment Processing

Brevo
      ↓
Transactional Email
```

### Production URLs

**Frontend:**  
https://rural-kart-ecommerce.vercel.app

**Backend:**  
https://rural-kart-ecommerce.onrender.com


# ⭐ Key Implementation Highlights

Rural-Kart includes several features that go beyond a basic product CRUD application.

### 1. Independent Direct Buy Flow

The Buy Now flow is separated from the persistent shopping cart.

Customers can purchase a product immediately without modifying their existing cart.

### 2. Active / Inactive Product Management

Products can be hidden from customers without being deleted from the admin inventory.

### 3. Backend Payment Verification

Payment confirmation is handled on the backend instead of relying only on the frontend payment response.

### 4. Stock Validation During Checkout

The backend validates product stock during checkout before completing the order.

### 5. Asynchronous Transactional Emails

Order confirmation emails are handled using Celery and Redis so email processing is separated from the main application request.

### 6. AI Shopping Assistant

Customers can interact with an AI assistant for product and shopping-related guidance directly within the application.



# 🔮 Future Improvements

Possible future improvements include:

- Seller/vendor accounts
- Vendor dashboard
- Product reviews and ratings
- Wishlist
- Coupons and discounts
- Delivery tracking
- Sales analytics
- AI product recommendations
- AI-based sales forecasting
- Logistics integration


# 👨‍💻 Author

**Ranjan**

Full-Stack Developer

### Built With

`Python` · `Django` · `Django REST Framework` · `React` · `PostgreSQL` · `Redis` · `Celery` · `Docker`

---

## 🌾 Rural-Kart

**Local • Authentic • Yours**


🌾 Rural-Kart
│
├── Short description
│
├── 🔗 Links
│
├── 📸 Screenshots
│
├── 🎯 Project Goal
│
├── 💡 Problem
│
├── ✨ Features
│   ├── Customer Features
│   ├── ⚡ Independent Direct Buy
│   ├── 🤖 AI Shopping Assistant
│   ├── 🟢 Product Availability
│   └── 🛠️ Admin Features
│
├── 💳 Online Payments
├── 📧 Order Confirmation Email
├── 🔐 Authentication
│
├── 🧰 Technology Stack
│
├── 🏗️ Architecture
├── 📁 Project Structure
│
├── 🚀 Getting Started
├── 🔑 Environment Variables
├── 🔌 API Overview
│
├── 🧪 Testing
├── 🔄 Continuous Integration
├── ☁️ Deployment
│
├── ⭐ Key Implementation Highlights
├── 🔮 Future Improvements
│
└── 👨‍💻 Author


