# E-Commerce Full Stack

![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?logo=redux&logoColor=white)
![PayPal](https://img.shields.io/badge/PayPal-Sandbox-00457C?logo=paypal&logoColor=white)

A full-stack fashion store with a customer shop and an admin panel. Shoppers browse and filter products, search, fill a cart, save addresses, pay with PayPal (sandbox) or a demo payment, follow their orders and review what they bought. Admins manage products, home page banners and order statuses.

## Features

**Shop**

- Home page with a banner slider (managed by admins), shop-by-category, shop-by-brand and featured products.
- Product listing with category and brand filters and sorting, all kept in the URL.
- Live search by name, brand or category.
- Product details with stock warnings and customer reviews.
- Cart that is saved on the server for each account.
- Checkout with an address book (up to 3 addresses) and two payment options:
  - **PayPal**: real PayPal sandbox checkout when PayPal keys are set;
  - **Demo payment**: pays instantly without money, so the app works with no PayPal account.
- Account page with order history and order details.
- Reviews are only allowed after buying the product, one per customer.

**Admin** (`/admin`)

- Dashboard with store numbers and home page banner management.
- Create, edit and delete products, with Cloudinary image upload or an image URL.
- See every order and update its status (confirmed, in process, shipped, delivered, rejected).

**Security**

- Passwords hashed with bcrypt, session in an `httpOnly` cookie, rate-limited sign in.
- Every cart, address and order is tied to the signed-in user, so users cannot read or change each other's data.
- Prices and totals are always computed on the server from the catalog. The browser cannot change what it pays.
- Stock is reserved atomically when an order is paid, and PayPal captures are checked against the order total.
- All input validated with zod, security headers with Helmet, and no secrets in the code (see `server/.env.example`).

## Tech Stack

| Area     | Tools                                                                                     |
| -------- | ----------------------------------------------------------------------------------------- |
| Client   | React 19, TypeScript, Vite 8, Redux Toolkit + RTK Query, React Router 7, Tailwind CSS 4   |
| UI       | Radix UI primitives (shadcn style), lucide-react, sonner toasts, react-hook-form + zod    |
| Server   | Node.js, Express 5, TypeScript, Mongoose 9, zod, jsonwebtoken, Helmet, express-rate-limit |
| Payments | PayPal REST API v2 (Orders), plus a demo payment mode                                     |
| Uploads  | Multer + Cloudinary (optional)                                                            |
| Testing  | Vitest, Supertest, mongodb-memory-server, Testing Library, axe-core                       |

## Project Structure

The folders follow the same conventions as the ADEyesV2 project: one folder per feature, thin pages, a typed API layer and shared UI.

```
e-commerce-full-stack/
├── client/                        React app
│   ├── public/banners/            default home page banners
│   ├── src/
│   │   ├── api/                   api.client.ts + one <resource>.api.ts per resource (RTK Query)
│   │   ├── app/                   routes.tsx, layouts, thin pages (each renders one module root)
│   │   ├── lib/                   store, providers, cn()
│   │   ├── modules/
│   │   │   ├── auth/              login, register, route guards, auth slice
│   │   │   ├── products/          home, listing, search, product details, reviews
│   │   │   ├── cart/              cart sheet and hook
│   │   │   ├── checkout/          checkout, PayPal return, payment success
│   │   │   ├── account/           orders and address book
│   │   │   └── admin/             dashboard, products, orders, admin layout
│   │   ├── shared/                components (Button, Dialog, Sheet, ...), constants, hooks, utils
│   │   └── types/                 one folder per domain (productTypes, orderTypes, ...)
│   └── __tests__/unit/            page, utility and accessibility tests
└── server/                        REST API
    ├── src/
    │   ├── auth/ users/ products/ cart/ addresses/ orders/ reviews/ features/ uploads/ payments/
    │   │   └── each with dto/, schema/, types/, consts/ and <module>.routes|controller|service.ts
    │   ├── common/                errors, middleware (auth, roles, error handler), utils
    │   ├── config/env.ts          validated environment variables
    │   ├── seed/                  demo users, products and banners
    │   ├── app.ts                 Express app
    │   ├── main.ts                start with your MongoDB
    │   └── demo.ts                start with an in-memory MongoDB
    └── test/                      one folder per module
```

## Getting Started

Requirements: Node.js 20.19+ (or 22.13+) and npm.

### 1. Install

```bash
npm install
```

### 2. Quick start: demo mode (no setup needed)

```bash
npm run dev:demo
```

This starts the API with an **in-memory database** filled with demo products, plus the React app. Open http://localhost:5173. The data is lost when you stop the server.

| Role     | Email               | Password     |
| -------- | ------------------- | ------------ |
| Admin    | admin@example.com   | Admin12345   |
| Customer | shopper@example.com | Shopper12345 |

### 3. Run with your own MongoDB

```bash
cp server/.env.example server/.env
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # paste the output into JWT_SECRET
npm run seed    # optional: adds the demo accounts, products and banners (keeps existing data)
npm run dev
```

## Environment Variables

All variables live in `server/.env`. The client needs none: in development Vite forwards `/api` to the server.

| Variable                                                               | Required | Description                                                  |
| ---------------------------------------------------------------------- | -------- | ------------------------------------------------------------ |
| `MONGODB_URI`                                                          | yes      | MongoDB connection string                                    |
| `JWT_SECRET`                                                           | yes      | At least 32 random characters, used to sign sessions         |
| `CLIENT_URL`                                                           | yes      | Address of the React app, used for PayPal return links       |
| `PORT`, `JWT_EXPIRES_IN`, `AUTH_RATE_LIMIT_MAX`                        | no       | Server port, session length, sign-in attempts per 15 minutes |
| `ENABLE_DEMO_PAYMENTS`                                                 | no       | `true` by default, except in production                      |
| `PAYPAL_MODE`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`              | no       | Turns on PayPal checkout (use `sandbox` for testing)         |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | no       | Turns on image uploads in the admin panel                    |

### Testing PayPal

1. Create a free account on [developer.paypal.com](https://developer.paypal.com) and open **Apps & Credentials** in **Sandbox** mode.
2. Copy the client id and secret into `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`.
3. Restart the server. Checkout now offers **PayPal**. Pay with a sandbox _personal_ account from **Testing Tools → Sandbox Accounts**.

## Scripts

Run from the project root:

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev:demo`  | API with in-memory database + React app                   |
| `npm run dev`       | API with your MongoDB + React app                         |
| `npm run seed`      | Add demo data to your MongoDB                             |
| `npm run build`     | Compile the server and build the client                   |
| `npm start`         | Run the compiled server (serves the client in production) |
| `npm run lint`      | ESLint on both apps                                       |
| `npm run typecheck` | TypeScript on both apps                                   |
| `npm run format`    | Format the code with Prettier                             |
| `npm run test:unit` | All tests                                                 |

## API Overview

| Method                      | Path                                                        | Access         |
| --------------------------- | ----------------------------------------------------------- | -------------- |
| POST                        | `/api/auth/register`, `/login`, `/logout`                   | public         |
| GET                         | `/api/auth/me`                                              | signed in      |
| GET                         | `/api/products?category=&brand=&sortBy=&search=`            | public         |
| GET                         | `/api/products/:id`, `/api/products/:id/reviews`            | public         |
| POST / PUT / DELETE         | `/api/products`, `/api/products/:id`                        | admin          |
| POST                        | `/api/products/:id/reviews`                                 | buyers         |
| GET / POST / PATCH / DELETE | `/api/cart`, `/api/cart/items/:productId`                   | signed in      |
| GET / POST / PUT / DELETE   | `/api/addresses`, `/api/addresses/:id`                      | signed in      |
| GET / POST                  | `/api/orders`, `/api/orders/:id`, `/api/orders/:id/capture` | signed in      |
| GET / PATCH                 | `/api/admin/orders`, `/api/admin/orders/:id/status`         | admin          |
| GET / POST / DELETE         | `/api/features`                                             | public / admin |
| POST                        | `/api/uploads/images`                                       | admin          |
| GET                         | `/api/config`, `/api/health`                                | public         |

## Testing

`npm run test:unit` runs 52 tests:

- **Server (30):** real HTTP requests against an in-memory MongoDB. They cover sign up and sign in, admin-only routes, filters and safe search, cart limits and stock, private carts, addresses and orders, server-side totals, demo payments, PayPal create and capture (with a mocked PayPal API, including a wrong-amount capture), and reviews only after purchase.
- **Client (22):** real pages rendered with a fake API. They cover filters in the URL, add to cart, search, login and register errors, route guards, the demo checkout, the PayPal return page, and axe accessibility checks on five pages.

GitHub Actions runs audit, lint, format check, type check, tests and build on every push and pull request.

## License

[MIT](LICENSE) © Hamdi Werhani
