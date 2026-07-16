-- CreateTable
CREATE TABLE "daily_revenue_snapshots" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "revenueProductos" DECIMAL(14,2) NOT NULL,
    "revenueEnvio" DECIMAL(14,2) NOT NULL,
    "revenueTotal" DECIMAL(14,2) NOT NULL,
    "ordersCount" INTEGER NOT NULL,
    "ticketPromedio" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_revenue_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_seller_snapshots" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "sellerId" TEXT NOT NULL,
    "sellerName" TEXT,
    "orders" INTEGER NOT NULL,
    "revenue" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "top_seller_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_product_snapshots" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "top_product_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "new_buyers_snapshots" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "new_buyers_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_revenue_snapshots_date_key" ON "daily_revenue_snapshots"("date");

-- CreateIndex
CREATE UNIQUE INDEX "top_seller_snapshots_date_sellerId_key" ON "top_seller_snapshots"("date", "sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "top_product_snapshots_date_productId_key" ON "top_product_snapshots"("date", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "new_buyers_snapshots_date_key" ON "new_buyers_snapshots"("date");
