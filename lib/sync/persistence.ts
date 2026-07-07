import { prisma } from "@/lib/prisma";
import type { DashboardMetrics, OrderStatusCount, AppMetric } from "./metrics";

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