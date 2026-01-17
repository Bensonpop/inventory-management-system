📦 Inventory Management System (Backend)
📌 Overview

This project is a backend system built to manage inventory with configurable stock outflow strategies.
Each business can define how inventory is consumed during a sale using one of the following strategies:

FIFO – First In, First Out

FEFO – First Expiry, First Out

BATCH – Explicit batch-wise deduction

The system ensures:

Correct inventory deduction

Transactional safety

Auditability of stock movement

Easy extensibility for future strategies (e.g., LIFO)

🛠 Tech Stack

Backend Framework: NestJS

ORM: TypeORM

Database: PostgreSQL

Language: TypeScript

API Documentation: Swagger

Testing: Jest

🚀 Setup Instructions
1️⃣ Clone the Repository
git clone <repository-url>
cd inventory-management

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=inventory_db

4️⃣ Run Database Migrations (if applicable)
npm run typeorm migration:run

5️⃣ Start the Application
npm run start:dev


Application runs at:

http://localhost:3000


Swagger UI:

http://localhost:3000/api/docs

🗄 Database Schema / Models
🏢 Business
Column	Description
id	UUID
name	Business name
out_mode	FIFO / FEFO / BATCH

Defines how inventory is deducted during sales.

📦 Product
Column	Description
id	UUID
product_code	Unique product identifier
name	Product name
created_at	Created timestamp
updated_at	Updated timestamp
📥 Inventory Batches
Column	Description
id	UUID
business_id	Business owning the stock
product_id	Product reference
batch_no	Batch identifier (unique per product)
quantity	Available stock
purchase_date	Stock inward date
expiry_date	Expiry date (nullable)
🛒 Sales
Column	Description
id	UUID
business_id	Business
product_id	Product
quantity	Total sold quantity
sale_reference	Unique reference (idempotency)
created_at	Sale timestamp
📊 Sale Deductions (Audit)
Column	Description
sale_id	Sale reference
batch_id	Batch deducted
batch_no	Batch number
quantity	Quantity deducted

Provides full audit trail of inventory movement.

🔁 Inventory Outflow Logic
1️⃣ FIFO (First In, First Out)

Stock is deducted from the oldest batch (by purchase_date)

If one batch is insufficient, deduction continues to the next batch

📌 Example:

Batch A (10 units)
Batch B (10 units)
Sale = 15 units
→ Batch A = 10
→ Batch B = 5

2️⃣ FEFO (First Expiry, First Out)

Stock with the earliest expiry date is deducted first

Batches with NULL expiry are treated as last priority

📌 This prevents wastage of expiring stock.

3️⃣ BATCH Mode

Stock is deducted only from the specified batch

If the batch does not have enough stock → sale fails

No partial deduction across batches

📌 Ensures strict batch-level control.

🔐 Transaction & Data Integrity

Sale creation and inventory deduction happen inside a single database transaction

If stock is insufficient → transaction is rolled back

Prevents partial or inconsistent stock updates

♻️ Idempotent Sale API

Each sale request requires a saleReference

Duplicate requests with the same reference:

Do not deduct stock again

Return the original sale response

This protects against:

Network retries

Duplicate API calls

🧪 How to Test the APIs
➕ Create Product

POST /products

{
  "productCode": "PROD-001",
  "name": "Laptop"
}

➕ Add Inventory (Batch)

POST /inventory/batches

{
  "businessId": "uuid",
  "productId": "uuid",
  "batchNo": "BATCH-01",
  "quantity": 20,
  "purchaseDate": "2025-01-01",
  "expiryDate": "2025-06-01"
}

🛒 Create Sale

POST /sales

{
  "businessId": "uuid",
  "productId": "uuid",
  "quantity": 15,
  "saleReference": "ORDER-123"
}


Response

{
  "sale_id": "uuid",
  "deductions": [
    { "batch_no": "BATCH-01", "quantity": 10 },
    { "batch_no": "BATCH-02", "quantity": 5 }
  ]
}

📊 Stock Summary

GET /inventory/summary/{businessId}/{productId}

Returns:

Total available quantity

Batch-wise stock details

🧠 Assumptions Made

product_code is globally unique

batch_no is unique per product

Batches with NULL expiry are sold last in FEFO

Stock cannot go negative

Sale without sufficient stock always fails

Inventory deduction happens only via Sale API

🧪 Testing

Unit tests written for sale logic using Jest

Strategy pattern allows mocking FIFO / FEFO / BATCH behavior

Edge cases covered:

Insufficient stock

Duplicate sale requests

Missing batch in BATCH mode

✅ Key Design Highlights

Strategy Pattern for inventory outflow

Transaction-safe sale processing

Audit-friendly deduction records

Clean, extensible architecture

Easy to add new strategies (e.g., LIFO)

🏁 Conclusion

This system demonstrates:

Real-world backend design

Correct inventory handling

Clean architecture principles

Production-ready API practices