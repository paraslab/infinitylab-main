                           
                                                                                

● I'll explore the Laravel project structure thoroughly before writing the
  summary.

● Explore(Laravel codebase exploration)
  ⎿  Done (55 tool uses · 95.2k tokens · 1m 20s)
  (ctrl+o to expand)

● Now I have a complete picture. Let me write the full summary.

  ---
  Laravel Store Admin Dashboard — Complete Summary

  1. Project Overview

  Project: InfinityLibrary — Electrical/Industrial product B2B platform
  Purpose: Admin panel to manage product catalog, receive customer quotation
  requests, and process purchase orders
  Stack: Laravel (Blade + Tailwind CSS) backend panel + separate React frontend
  (existing)
  Guard: Custom store.admin.auth middleware (role = admin, is_active = true)

  Current Modules

  ┌─────────────────────────────┬────────────────────────────────┐
  │           Module            │             Status             │
  ├─────────────────────────────┼────────────────────────────────┤
  │ Auth (Login/Logout)         │ Complete                       │
  ├─────────────────────────────┼────────────────────────────────┤
  │ Dashboard (Stats + Recents) │ Complete                       │
  ├─────────────────────────────┼────────────────────────────────┤
  │ Store Categories            │ Full CRUD                      │
  ├─────────────────────────────┼────────────────────────────────┤
  │ Store Products              │ Full CRUD + 3 images + filters │
  ├─────────────────────────────┼────────────────────────────────┤
  │ Quotations                  │ View + PDF Download            │
  ├─────────────────────────────┼────────────────────────────────┤
  │ Purchase Orders             │ View + Status Update           │
  └─────────────────────────────┴────────────────────────────────┘

  ---
  2. Store Product Module Flow

  Product List (/store-admin/products)

  - Filters: text search (name/model), category dropdown, status
  (active/inactive), featured (yes/no)
  - Active filter chips shown above table, each individually removable
  - Table columns: thumbnail, name, category, price (₹), model, status toggle,
  featured toggle, edit/delete
  - Pagination: custom Tailwind paginator
  - Status/Featured toggles are AJAX (no page reload)

  Add Product (/store-admin/products/create)

  4 numbered sections:
  1. Basic Info — name (auto-slugged), category (dropdown), description
  (textarea)
  2. Pricing — price (₹), GST % → computed price_with_gst and gst_amount
  3. Technical Specs — model number, VA rating, voltage
  4. Images — 3 independent file uploads (image_1, image_2, image_3), drag-drop
  with preview

  Edit Product (/store-admin/products/{id}/edit)

  - Same 4 sections, pre-filled
  - Each image slot shows current image + option to replace or remove (sets to
  null)
  - Slug is read-only

  Delete Product

  - Confirmation modal before delete
  - On delete: removes all 3 images from storage, deletes DB record

  Status Toggle (POST /store-admin/products/{id}/toggle-status)

  - Returns JSON {success, status, message}
  - UI updates button color in-place

  Featured Toggle (POST /store-admin/products/{id}/toggle-featured)

  - Same pattern as status toggle

  Search

  - ?search=term — queries name and model columns (LIKE)

  Filters

  - ?category_id=X — filter by category
  - ?status=1|0 — active or inactive
  - ?featured=1|0 — featured or not
  - All filters combine (chained when() clauses in controller)

  Pagination

  - Laravel paginator with appends(request()->query()) to preserve filters
  across pages
  - Default: 15 per page

  Image Upload System

  - Disk: public (storage/app/public)
  - Path: store-products/{year}/{month}/{random}.{ext}
  - On update: old image deleted from disk before saving new one
  - On delete product: all 3 images deleted from disk
  - Validation: image|mimes:jpeg,png,jpg,gif,webp|max:2048 (2MB limit)
  - URLs generated with Storage::url()

  ---
  3. Database Structure

  users

  ┌─────────────────────────┬────────────────────┬──────────────────────────┐
  │         Column          │        Type        │          Notes           │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ id                      │ bigint PK          │                          │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ name                    │ string             │                          │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ email                   │ string unique      │                          │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ password                │ string             │                          │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ phone                   │ string nullable    │                          │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ role                    │ enum               │ admin, manager, customer │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ is_active               │ boolean            │ default true             │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ last_login_at           │ timestamp nullable │                          │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ email_verified_at       │ timestamp nullable │                          │
  ├─────────────────────────┼────────────────────┼──────────────────────────┤
  │ created_at / updated_at │ timestamps         │                          │
  └─────────────────────────┴────────────────────┴──────────────────────────┘

  customer_addresses

  ┌─────────────────────────────────┬────────────────┬─────────────────────┐
  │             Column              │      Type      │        Notes        │
  ├─────────────────────────────────┼────────────────┼─────────────────────┤
  │ id                              │ bigint PK      │                     │
  ├─────────────────────────────────┼────────────────┼─────────────────────┤
  │ user_id                         │ FK → users     │                     │
  ├─────────────────────────────────┼────────────────┼─────────────────────┤
  │ label                           │ string         │ e.g. "Home",        │
  │                                 │                │ "Office"            │
  ├─────────────────────────────────┼────────────────┼─────────────────────┤
  │ name, phone                     │ string         │                     │
  ├─────────────────────────────────┼────────────────┼─────────────────────┤
  │ address, city, state, pin,      │ string         │                     │
  │ country                         │                │                     │
  ├─────────────────────────────────┼────────────────┼─────────────────────┤
  │ gst_number                      │ string         │ B2B                 │
  │                                 │ nullable       │                     │
  ├─────────────────────────────────┼────────────────┼─────────────────────┤
  │ is_default                      │ boolean        │                     │
  └─────────────────────────────────┴────────────────┴─────────────────────┘

  store_categories

  ┌────────┬─────────────────┬────────────────┐
  │ Column │      Type       │     Notes      │
  ├────────┼─────────────────┼────────────────┤
  │ id     │ bigint PK       │                │
  ├────────┼─────────────────┼────────────────┤
  │ name   │ string          │                │
  ├────────┼─────────────────┼────────────────┤
  │ slug   │ string unique   │ auto-generated │
  ├────────┼─────────────────┼────────────────┤
  │ image  │ string nullable │                │
  ├────────┼─────────────────┼────────────────┤
  │ status │ boolean         │ default true   │
  └────────┴─────────────────┴────────────────┘

  store_products

  ┌───────────────────────────┬───────────────────────┬────────────────────┐
  │          Column           │         Type          │       Notes        │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ id                        │ bigint PK             │                    │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ category_id               │ FK → store_categories │                    │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ name                      │ string                │                    │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ slug                      │ string unique         │ auto-generated     │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ price                     │ decimal(12,2)         │                    │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ gst_percent               │ decimal(5,2)          │                    │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ description               │ text nullable         │                    │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ va                        │ string nullable       │ Volt-Ampere rating │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ voltage                   │ string nullable       │                    │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ model                     │ string nullable       │                    │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ image_1, image_2, image_3 │ string nullable       │ storage paths      │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ status                    │ boolean               │ default true       │
  ├───────────────────────────┼───────────────────────┼────────────────────┤
  │ featured                  │ boolean               │ default false      │
  └───────────────────────────┴───────────────────────┴────────────────────┘

  Indexes: (status, featured), category_id
  Computed (Model): price_with_gst, gst_amount

  quote_carts

  ┌──────────────────┬────────────────────────────────┬────────────────┐
  │      Column      │              Type              │     Notes      │
  ├──────────────────┼────────────────────────────────┼────────────────┤
  │ id               │ bigint PK                      │                │
  ├──────────────────┼────────────────────────────────┼────────────────┤
  │ session_id       │ string(64)                     │ anonymous cart │
  ├──────────────────┼────────────────────────────────┼────────────────┤
  │ store_product_id │ FK → store_products            │                │
  ├──────────────────┼────────────────────────────────┼────────────────┤
  │ qty              │ integer                        │                │
  ├──────────────────┼────────────────────────────────┼────────────────┤
  │ Unique           │ (session_id, store_product_id) │                │
  └──────────────────┴────────────────────────────────┴────────────────┘

  quotations

  ┌──────────────────────────────────┬─────────────────┬─────────────────────┐
  │              Column              │      Type       │        Notes        │
  ├──────────────────────────────────┼─────────────────┼─────────────────────┤
  │ id                               │ bigint PK       │                     │
  ├──────────────────────────────────┼─────────────────┼─────────────────────┤
  │ quote_no                         │ string unique   │ e.g. Q-2025-001     │
  ├──────────────────────────────────┼─────────────────┼─────────────────────┤
  │ name, company, email, phone      │ string          │                     │
  ├──────────────────────────────────┼─────────────────┼─────────────────────┤
  │ address                          │ text            │                     │
  ├──────────────────────────────────┼─────────────────┼─────────────────────┤
  │ items_json                       │ JSON            │ array of cart items │
  ├──────────────────────────────────┼─────────────────┼─────────────────────┤
  │ subtotal, gst_total, grand_total │ decimal(12,2)   │                     │
  ├──────────────────────────────────┼─────────────────┼─────────────────────┤
  │ pdf_path                         │ string nullable │ storage path        │
  └──────────────────────────────────┴─────────────────┴─────────────────────┘

  purchase_orders

  ┌──────────────┬────────────┬─────────────────────────────────────────────┐
  │    Column    │    Type    │                    Notes                    │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ id           │ bigint PK  │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │              │ FK →       │                                             │
  │ quotation_id │ quotations │                                             │
  │              │  nullable  │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ order_no     │ string     │                                             │
  │              │ unique     │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ first_name,  │ string     │                                             │
  │ last_name    │            │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ company,     │ string     │                                             │
  │ designation  │ nullable   │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ email, phone │ string     │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ delivery_add │ text       │                                             │
  │ ress         │            │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ gst_number,  │ string     │                                             │
  │ pan_number   │ nullable   │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ notes        │ text       │ customer notes                              │
  │              │ nullable   │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ admin_notes  │ text       │ internal notes                              │
  │              │ nullable   │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ payment_meth │ string     │ bank_transfer, cheque, upi, cod, neft, rtgs │
  │ od           │            │                                             │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ status       │ string     │ pending→confirmed→processing→shipped→delive │
  │              │            │ red→cancelled                               │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ items_json   │ JSON       │ snapshot of order items                     │
  ├──────────────┼────────────┼─────────────────────────────────────────────┤
  │ subtotal,    │ decimal(12 │                                             │
  │ gst_total,   │ ,2)        │                                             │
  │ grand_total  │            │                                             │
  └──────────────┴────────────┴─────────────────────────────────────────────┘

  Relationships Summary

  User → hasMany CustomerAddress
  StoreCategory → hasMany StoreProduct
  StoreProduct → belongsTo StoreCategory
  StoreProduct → hasMany QuoteCart items
  Quotation → hasMany PurchaseOrder
  PurchaseOrder → belongsTo Quotation

  ---
  4. Routes Summary

  Web Routes (Store Admin)

  ┌─────┬────────────────────────────┬───────────────────────────┬─────────┐
  │ Met │            URL             │           Name            │ Purpose │
  │ hod │                            │                           │         │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │     │                            │                           │ Show    │
  │ GET │ /store-admin/login         │ store-admin.login         │ login   │
  │     │                            │                           │ form    │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ POS │ /store-admin/login         │ store-admin.login.post    │ Authent │
  │ T   │                            │                           │ icate   │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ POS │ /store-admin/logout        │ store-admin.logout        │ Logout  │
  │ T   │                            │                           │         │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/dashboard     │ store-admin.dashboard     │ Dashboa │
  │     │                            │                           │ rd home │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/categories    │ store-admin.categories.in │ Categor │
  │     │                            │ dex                       │ y list  │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/categories/cr │ store-admin.categories.cr │ Create  │
  │     │ eate                       │ eate                      │ form    │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ POS │ /store-admin/categories    │ store-admin.categories.st │ Save ca │
  │ T   │                            │ ore                       │ tegory  │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/categories/{i │ store-admin.categories.ed │ Edit    │
  │     │ d}/edit                    │ it                        │ form    │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │     │ /store-admin/categories/{i │ store-admin.categories.up │ Update  │
  │ PUT │ d}                         │ date                      │ categor │
  │     │                            │                           │ y       │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ DEL │ /store-admin/categories/{i │ store-admin.categories.de │ Delete  │
  │ ETE │ d}                         │ stroy                     │ categor │
  │     │                            │                           │ y       │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ POS │ /store-admin/categories/{i │ store-admin.categories.to │ Toggle  │
  │ T   │ d}/toggle-status           │ ggle-status               │ active  │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │     │                            │                           │ Product │
  │ GET │ /store-admin/products      │ store-admin.products.inde │  list + │
  │     │                            │ x                         │         │
  │     │                            │                           │ filters │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/products/crea │ store-admin.products.crea │ Create  │
  │     │ te                         │ te                        │ form    │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ POS │ /store-admin/products      │ store-admin.products.stor │ Save    │
  │ T   │                            │ e                         │ product │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/products/{id} │ store-admin.products.edit │ Edit    │
  │     │ /edit                      │                           │ form    │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ PUT │ /store-admin/products/{id} │ store-admin.products.upda │ Update  │
  │     │                            │ te                        │ product │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ DEL │ /store-admin/products/{id} │ store-admin.products.dest │ Delete  │
  │ ETE │                            │ roy                       │ product │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ POS │ /store-admin/products/{id} │ store-admin.products.togg │ Toggle  │
  │ T   │ /toggle-status             │ le-status                 │ active  │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ POS │ /store-admin/products/{id} │ store-admin.products.togg │ Toggle  │
  │ T   │ /toggle-featured           │ le-featured               │ feature │
  │     │                            │                           │ d       │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/quotations    │ store-admin.quotations.in │ Quotati │
  │     │                            │ dex                       │ on list │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │     │ /store-admin/quotations/{i │ store-admin.quotations.sh │ Quotati │
  │ GET │ d}                         │ ow                        │ on      │
  │     │                            │                           │ detail  │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/quotations/{i │ store-admin.quotations.do │ Downloa │
  │     │ d}/download                │ wnload                    │ d PDF   │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/purchase-orde │ store-admin.purchase-orde │ Order   │
  │     │ rs                         │ rs.index                  │ list    │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ GET │ /store-admin/purchase-orde │ store-admin.purchase-orde │ Order   │
  │     │ rs/{id}                    │ rs.show                   │ detail  │
  ├─────┼────────────────────────────┼───────────────────────────┼─────────┤
  │ POS │ /store-admin/purchase-orde │ store-admin.purchase-orde │ Update  │
  │ T   │ rs/{id}/status             │ rs.update-status          │ status  │
  └─────┴────────────────────────────┴───────────────────────────┴─────────┘

  API Routes (Public / Customer-facing)

  GET  /api/products          → product listing (active, filterable)
  GET  /api/products/{slug}   → single product detail
  GET  /api/categories        → active categories
  POST /api/quotations        → submit quotation request
  POST /api/purchase-orders   → place purchase order
  GET  /api/testimonials      → testimonials
  GET  /api/catalogs          → catalogs
  POST /api/inquiries         → contact inquiry
  (Full API route details depend on api.php — confirm with actual file)

  ---
  5. Controller Summary

  AuthController

  ┌─────────────┬───────────┬─────────────┬─────────────────────────────────┐
  │   Method    │   Input   │ Validation  │            Response             │
  ├─────────────┼───────────┼─────────────┼─────────────────────────────────┤
  │ showLogin() │ —         │ —           │ Renders store-admin.auth.login  │
  ├─────────────┼───────────┼─────────────┼─────────────────────────────────┤
  │             │ email,    │ required,   │ Checks role=admin + is_active;  │
  │ login()     │ password  │ email       │ sets session; redirects to      │
  │             │           │ format      │ dashboard or back with error    │
  ├─────────────┼───────────┼─────────────┼─────────────────────────────────┤
  │ logout()    │ —         │ —           │ Flushes session; redirects to   │
  │             │           │             │ login                           │
  └─────────────┴───────────┴─────────────┴─────────────────────────────────┘

  DashboardController

  ┌─────────┬─────────────────────────────────────────────┬─────────────────┐
  │ Method  │                    Logic                    │    Response     │
  ├─────────┼─────────────────────────────────────────────┼─────────────────┤
  │         │ Cached (300s): counts of categories,        │ Renders         │
  │ index() │ products, quotations, orders; last 5 of     │ dashboard view  │
  │         │ each                                        │                 │
  └─────────┴─────────────────────────────────────────────┴─────────────────┘

  StoreCategoryController

  Method: index()
  Input: ?search=
  Validation: —
  Response: Filtered, paginated list
  ────────────────────────────────────────
  Method: store()
  Input: name, image, status
  Validation: name required/max:255; image optional/2MB
  Response: Saves with auto-slug; redirects to index
  ────────────────────────────────────────
  Method: update()
  Input: name, image, status
  Validation: same
  Response: Regenerates slug only if name changed; deletes old image if replaced
  ────────────────────────────────────────
  Method: destroy()
  Input: —
  Validation: Checks products_count == 0
  Response: Deletes image + record; error if has products
  ────────────────────────────────────────
  Method: toggleStatus()
  Input: —
  Validation: —
  Response: JSON {success, status, message}

  StoreProductController

  Method: index()
  Input: search, category_id, status, featured
  Validation: —
  Response: Filtered+paginated list
  ────────────────────────────────────────
  Method: store()
  Input: name, category_id, price, gst_percent, description, va, voltage, model,

    image_1/2/3, status, featured
  Validation: name/category/price required; gst 0-100; images 2MB
  Response: Saves product + images
  ────────────────────────────────────────
  Method: update()
  Input: same + remove_image_1/2/3
  Validation: same as store
  Response: Updates fields; replaces or removes images
  ────────────────────────────────────────
  Method: destroy()
  Input: —
  Validation: —
  Response: Deletes all 3 images + record
  ────────────────────────────────────────
  Method: toggleStatus()
  Input: —
  Validation: —
  Response: JSON response
  ────────────────────────────────────────
  Method: toggleFeatured()
  Input: —
  Validation: —
  Response: JSON response

  QuotationController

  ┌──────────────┬──────────────────────────────────┬───────────┬──────────┐
  │    Method    │              Input               │ Validatio │ Response │
  │              │                                  │     n     │          │
  ├──────────────┼──────────────────────────────────┼───────────┼──────────┤
  │ index()      │ search (quote_no/name/email/phon │ —         │ Paginate │
  │              │ e/company)                       │           │ d list   │
  ├──────────────┼──────────────────────────────────┼───────────┼──────────┤
  │              │                                  │           │ Quotatio │
  │ show()       │ —                                │ —         │ n detail │
  │              │                                  │           │  view    │
  ├──────────────┼──────────────────────────────────┼───────────┼──────────┤
  │              │                                  │ Checks    │ Stream   │
  │ downloadPdf( │ —                                │ pdf_path  │ PDF file │
  │ )            │                                  │ exists    │          │
  │              │                                  │           │ download │
  └──────────────┴──────────────────────────────────┴───────────┴──────────┘

  PurchaseOrderController

  ┌────────────────┬───────────────┬─────────────────────┬──────────────────┐
  │     Method     │     Input     │     Validation      │     Response     │
  ├────────────────┼───────────────┼─────────────────────┼──────────────────┤
  │ index()        │ search,       │ —                   │ Paginated list   │
  │                │ status filter │                     │                  │
  ├────────────────┼───────────────┼─────────────────────┼──────────────────┤
  │                │               │                     │ Order detail     │
  │ show()         │ —             │ —                   │ with linked      │
  │                │               │                     │ quotation        │
  ├────────────────┼───────────────┼─────────────────────┼──────────────────┤
  │                │               │ status required/in  │ Updates order;   │
  │ updateStatus() │ status,       │ valid list;         │ redirects back   │
  │                │ admin_notes   │ admin_notes         │ with success     │
  │                │               │ max:1000            │                  │
  └────────────────┴───────────────┴─────────────────────┴──────────────────┘

  ---
  6. Blade UI Summary

  Master Layout (layouts/app.blade.php)

  ┌─────────────────────────────────────────────┐
  │  SIDEBAR (slate-900, fixed)                 │
  │  • Logo / Brand                             │
  │  • Nav groups: Main, Catalog, Orders        │
  │  • Active link highlight (blue-500)         │
  │  • User email + Logout button               │
  ├─────────────────────────────────────────────┤
  │  HEADER                                     │
  │  • Mobile hamburger menu                    │
  │  • Page title (slot or @yield)              │
  │  • Breadcrumbs optional                     │
  ├─────────────────────────────────────────────┤
  │  MAIN CONTENT (@yield('content'))           │
  │  Flash messages (green/red banners)         │
  ├─────────────────────────────────────────────┤
  │  FOOTER (simple)                            │
  └─────────────────────────────────────────────┘

  Reusable Partials

  - partials/pagination.blade.php — shows "X–Y of Z", prev/next, page numbers
  - partials/empty-state.blade.php — icon + title + message + optional CTA
  button; icons: document, package, search
  - partials/confirm-modal.blade.php — generic confirmation modal; escape +
  click-outside close; custom title/message/button text via Blade params

  Tables Pattern

  All list pages use the same structure:
  [Search/Filter bar]
  [Active filter chips]
  [Results count text]
  <table>
    <thead> fixed columns </thead>
    <tbody @forelse>
      <tr> ... </tr>
    @empty
      <empty-state component>
    </tbody>
  </table>
  [Pagination component]

  Form Pattern

  All create/edit forms use:
  - 2-column layout (left: main form, right: sidebar with meta/tips)
  - Numbered <section> blocks
  - Error display under each field via @error
  - Image preview via JS FileReader
  - Status/Featured as styled checkboxes

  ---
  7. React Conversion Plan

  Pages to Build

  /admin/products — Product List Page

  State: filters {search, category_id, status, featured}, page, data[], meta
  Components:
  - <FilterBar> — inputs + dropdowns + clear button
  - <ActiveFilterChips> — shows active filters, click to remove
  - <ProductTable> — sortable columns
  - <StatusToggle> / <FeaturedToggle> — calls POST 
  /api/admin/products/{id}/toggle-status
  - <ConfirmDeleteModal>
  - <Pagination>

  /admin/products/create and /admin/products/:id/edit — Product Form

  State: form fields, image previews, errors, loading
  Sections (match Laravel):
  1. Basic Info
  2. Pricing (live GST calculation display)
  3. Technical Specs
  4. Images

  Key Components:
  - <ImageUploadSlot> — single slot: preview existing, replace, remove
  - <GstCalculator> — shows computed price_with_gst as user types
  - <CategorySelect> — fetches active categories on mount

  /admin/categories — Category List + Modals

  Same patterns as products, simpler (1 image, fewer fields)

  /admin/dashboard — Dashboard Cards

  - <StatCard icon title value subtitle> — 4 cards
  - <RecentTable> — shared for quotations + orders recent lists

  /admin/quotations and /admin/purchase-orders

  Read-only list + detail pages, plus status update form on PO detail

  Reusable Components

  components/
    ui/
      StatCard.tsx
      DataTable.tsx          ← columns config, renders rows
      Pagination.tsx         ← takes {current_page, last_page, total}
      EmptyState.tsx         ← icon, title, message, actionLabel, onAction
      ConfirmModal.tsx       ← open/close via ref or zustand
      FilterBar.tsx          ← generic filter row
      ActiveFilterChips.tsx
      StatusBadge.tsx        ← maps status string → color
      ImageUploadSlot.tsx    ← preview + replace + remove
      GstCalculator.tsx
    layout/
      AdminLayout.tsx        ← sidebar + header
      Sidebar.tsx

  API Layer

  api/
    products.ts    → getProducts(filters), getProduct(id), createProduct,
  updateProduct, deleteProduct, toggleStatus, toggleFeatured
    categories.ts  → getCategories, createCategory, updateCategory,
  deleteCategory, toggleStatus
    quotations.ts  → getQuotations, getQuotation, downloadPdf
    orders.ts      → getOrders, getOrder, updateStatus
    dashboard.ts   → getStats

  All calls use FormData for image uploads. Token via Authorization: Bearer 
  {token} header using Laravel Sanctum.

  Image Upload Component Design

  <ImageUploadSlot
    label="Image 1"
    currentUrl={product.image_1_url}     // from API
    onFile={(file) => setImage1(file)}    // new upload
    onRemove={() => setRemoveImage1(true)} // send remove_image_1=1
  />

  ---
  8. Missing / Pending Work

  Missing APIs (need to be created in Laravel)

  ┌─────────────────────────────────────────────┬───────────────────────────┐
  │                     API                     │        Why needed         │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ GET /api/admin/products                     │ React product list with   │
  │                                             │ filters + pagination      │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ GET /api/admin/products/{id}                │ React edit form pre-fill  │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ POST /api/admin/products                    │ React create              │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ PUT /api/admin/products/{id}                │ React update              │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ DELETE /api/admin/products/{id}             │ React delete              │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ POST /api/admin/products/{id}/toggle-status │ Already exists as web     │
  │                                             │ route — needs API version │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ POST                                        │ Same                      │
  │ /api/admin/products/{id}/toggle-featured    │                           │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ GET /api/admin/categories                   │ Dropdown in product form  │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ Same full CRUD for categories, quotations,  │                           │
  │ orders                                      │                           │
  ├─────────────────────────────────────────────┼───────────────────────────┤
  │ GET /api/admin/dashboard/stats              │ Dashboard cards           │
  └─────────────────────────────────────────────┴───────────────────────────┘

  All admin API routes need Sanctum auth + role:admin middleware.

  Missing Validations

  - Product price should have a min value (currently just required|numeric)
  - No max on image count — if a product has no images, there is no placeholder
  fallback URL
  - purchase_order.status transitions are not validated (any status → any status
   allowed)
  - Category cannot be deleted if it has products — but no soft-delete safety
  net if cascade happens

  Repeated Code to DRY Up

  - storeImage() and deleteImage() exist in both StoreCategoryController and
  StoreProductController — extract to a trait (ImageUploadTrait) or a
  ImageService
  - Slug generation boot method is duplicated across StoreCategory and
  StoreProduct models — extract to a HasSlug trait
  - Pagination + filtering patterns are repeated in every controller — a
  Filterable trait or base controller method would reduce boilerplate

  Improvement Ideas

  ┌───────────────┬─────────────────────────────────────────────────────────┐
  │     Area      │                       Suggestion                        │
  ├───────────────┼─────────────────────────────────────────────────────────┤
  │ Images        │ Use spatie/laravel-medialibrary for cleaner multi-image │
  │               │  management with conversions/thumbnails                 │
  ├───────────────┼─────────────────────────────────────────────────────────┤
  │ API Resources │ Add StoreProductResource and StoreCategoryResource      │
  │               │ (Laravel API Resources) for consistent JSON shape       │
  ├───────────────┼─────────────────────────────────────────────────────────┤
  │ Product API   │ Include image_1_url, image_2_url, image_3_url as full   │
  │ response      │ URLs (not raw storage paths)                            │
  ├───────────────┼─────────────────────────────────────────────────────────┤
  │ Auth          │ Switch to Sanctum token auth for React — POST           │
  │               │ /api/admin/login → returns token                        │
  ├───────────────┼─────────────────────────────────────────────────────────┤
  │ GST           │ Currently only computed in Model accessors — expose via │
  │ calculation   │  API so React can use same values                       │
  ├───────────────┼─────────────────────────────────────────────────────────┤
  │ Order status  │ Add a status transition machine                         │
  │ flow          │ (pending→confirmed→processing→...) to prevent invalid   │
  │               │ jumps                                                   │
  ├───────────────┼─────────────────────────────────────────────────────────┤
  │ PDF           │ downloadPdf reads from storage — if pdf_path is null it │
  │ generation    │  will error; add null check                             │
  ├───────────────┼─────────────────────────────────────────────────────────┤
  │ Dashboard     │ 300s cache is good but cache key should include         │
  │ cache         │ user/store scope if multi-tenant in future              │
  └───────────────┴─────────────────────────────────────────────────────────┘

  Better React Structure Suggestions

  src/
    pages/
      admin/
        Dashboard.tsx
        products/
          ProductList.tsx
          ProductForm.tsx      ← shared for create + edit
        categories/
          CategoryList.tsx
          CategoryForm.tsx
        quotations/
          QuotationList.tsx
          QuotationDetail.tsx
        orders/
          OrderList.tsx
          OrderDetail.tsx
    components/
      ui/                      ← generic reusables (see section 7)
      admin/                   ← admin-specific composites
    hooks/
      useProducts.ts           ← data fetching + mutation hooks
      useCategories.ts
      useToast.ts
    api/                       ← axios/fetch wrappers
    store/                     ← Zustand or React Query cache
  Use React Query (TanStack Query) for server state — handles caching, loading
  states, refetch after mutation automatically. This eliminates most manual
  useEffect + useState data fetching boilerplate.

  ---
  This summary covers everything in the current Laravel Store Admin codebase.
  You can now build each React page against the API contracts described above
  without touching the backend until the API routes are ready.

✻ Crunched for 2m 51s

❯ /export                                                                       
  ⎿  Conversation copied to clipboard