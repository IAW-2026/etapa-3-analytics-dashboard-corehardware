-- CreateEnum
CREATE TYPE "SourceApp" AS ENUM ('BUYER', 'SELLER', 'SHIPPING', 'PAYMENTS');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('OK', 'DEGRADED', 'ERROR');

-- CreateTable
CREATE TABLE "api_sync_status" (
    "id" TEXT NOT NULL,
    "app" "SourceApp" NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT,

    CONSTRAINT "api_sync_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_snapshots" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "gmv" DECIMAL(14,2) NOT NULL,
    "orders" INTEGER NOT NULL,
    "pendingShipping" INTEGER NOT NULL,
    "settled" DECIMAL(14,2) NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_snapshots" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "order_status_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_summary_snapshots" (
    "id" TEXT NOT NULL,
    "app" "SourceApp" NOT NULL,
    "date" DATE NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "app_summary_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_sync_status_app_key" ON "api_sync_status"("app");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_snapshots_date_key" ON "dashboard_snapshots"("date");

-- CreateIndex
CREATE UNIQUE INDEX "order_status_snapshots_date_status_key" ON "order_status_snapshots"("date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "app_summary_snapshots_app_date_metric_key" ON "app_summary_snapshots"("app", "date", "metric");
