import { prisma } from "@/lib/prisma";
import type { DashboardMetrics, OrderStatusCount, AppMetric } from "./metrics";
import type {
  DailyRevenueSnapshotData,
  TopSellerSnapshotData,
  TopProductSnapshotData,
  NewBuyersSnapshotData,
} from "./aggregate";

export async function persistDashboardSnapshot(date: Date, metrics: DashboardMetrics) {
  await prisma.dashboardSnapshot.upsert({
    where: { date },
    update: {
      gmv: metrics.gmv,
      orders: metrics.totalOrders,
      pendingShipping: metrics.pendingShipping,
      settled: metrics.settled,
      activeUsers: metrics.activeUsers,
    },
    create: {
      date,
      gmv: metrics.gmv,
      orders: metrics.totalOrders,
      pendingShipping: metrics.pendingShipping,
      settled: metrics.settled,
      activeUsers: metrics.activeUsers,
    },
  });
}

export async function persistOrderStatusSnapshots(date: Date, counts: OrderStatusCount[]) {
  for (const { status, count } of counts) {
    await prisma.orderStatusSnapshot.upsert({
      where: { date_status: { date, status } },
      update: { count },
      create: { date, status, count },
    });
  }
}

export async function persistAppSummarySnapshots(date: Date, metrics: AppMetric[]) {
  for (const { app, metric, value } of metrics) {
    await prisma.appSummarySnapshot.upsert({
      where: { app_date_metric: { app, date, metric } },
      update: { value },
      create: { app, date, metric, value },
    });
  }
}

export async function persistDailyRevenueSnapshot(data: DailyRevenueSnapshotData) {
  await prisma.dailyRevenueSnapshot.upsert({
    where: { date: data.date },
    update: {
      revenueProductos: data.revenueProductos,
      revenueEnvio: data.revenueEnvio,
      revenueTotal: data.revenueTotal,
      ordersCount: data.ordersCount,
      ticketPromedio: data.ticketPromedio,
    },
    create: {
      date: data.date,
      revenueProductos: data.revenueProductos,
      revenueEnvio: data.revenueEnvio,
      revenueTotal: data.revenueTotal,
      ordersCount: data.ordersCount,
      ticketPromedio: data.ticketPromedio,
    },
  });
}

export async function persistTopSellerSnapshots(sellers: TopSellerSnapshotData[]) {
  for (const seller of sellers) {
    await prisma.topSellerSnapshot.upsert({
      where: { date_sellerId: { date: seller.date, sellerId: seller.sellerId } },
      update: { sellerName: seller.sellerName, orders: seller.orders, revenue: seller.revenue },
      create: {
        date: seller.date,
        sellerId: seller.sellerId,
        sellerName: seller.sellerName,
        orders: seller.orders,
        revenue: seller.revenue,
      },
    });
  }
}

export async function persistTopProductSnapshots(products: TopProductSnapshotData[]) {
  for (const product of products) {
    await prisma.topProductSnapshot.upsert({
      where: { date_productId: { date: product.date, productId: product.productId } },
      update: { productName: product.productName, quantity: product.quantity },
      create: {
        date: product.date,
        productId: product.productId,
        productName: product.productName,
        quantity: product.quantity,
      },
    });
  }
}

export async function persistNewBuyersSnapshot(data: NewBuyersSnapshotData) {
  await prisma.newBuyersSnapshot.upsert({
    where: { date: data.date },
    update: { count: data.count },
    create: { date: data.date, count: data.count },
  });
}