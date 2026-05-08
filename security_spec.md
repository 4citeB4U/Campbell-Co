# Security Specification for Campbell & Co.

## Data Invariants
1. A product must have a price > 0.
2. A product's status must be one of: draft, preview, live, unavailable, archived.
3. Only authenticated users (admins) can create/update/delete products, orders, categories, homepage, or avo_knowledge.
4. Customers (unauthenticated or unverified) can only READ products if status is 'live' or 'unavailable'. They cannot read 'draft', 'preview', or 'archived' items.
5. Customers can only READ categories and homepage config.
6. Customers can CREATE orders, but cannot update or delete them once created.
7. Orders must include customer details and a total > 0.

## The "Dirty Dozen" Payloads
1. **Identity Spoofing**: Attempt to update a product as an unauthenticated user.
2. **State Shortcutting**: Attempt to set a product status to 'live' without required fields.
3. **Price Poisoning**: Attempt to set a product price to 0 or negative.
4. **Illegal status change**: Attempt to change an order status from 'delivered' back to 'pending'.
5. **PII Leak**: Attempt to read all orders as a customer.
6. **Data Injection**: Attempt to inject 1MB string into product title.
7. **Draft Exposure**: Attempt to list products with status 'draft' as a customer.
8. **Malicious Delete**: Attempt to delete a category as a customer.
9. **Settings Hijack**: Attempt to update store settings as a customer.
10. **Order Modification**: Attempt to update a verified order's total as a customer.
11. **AVO Knowledge Corruption**: Attempt to update AI knowledge as a customer.
12. **SKU Collision**: Attempt to create a product without a SKU.

## Validation Helpers
- `isValidProduct(data)`: Enforces schema and price > 0.
- `isAdmin()`: Checks if authenticated (for now, any auth for simplicity of demo, but should ideally check a list).

---

# firestore.rules.test.ts

(To be implemented if environment allowed testing, but I will simulate the logic in the rules).
