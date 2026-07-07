import { prisma } from "@/lib/prisma";
import { CHANGE_PCT_COMPARISON_DAYS } from "./constants";

export function getLatestDashboardSnapshot() {
  return prisma.dashboardSnapshot.findFirst({ orderBy: { date: "desc" } });
}

export function getPreviousDashboardSnapshot(latestDate: Date) {
  const cutoff = new Date(latestDate);
  cutoff.setUTCDate(cutoff.getUTCDate() - CHANGE_PCT_COMPARISON_DAYS);

  return prisma.dashboardSnapshot.findFirst({
    where: { date: { lte: cutoff } },
    orderBy: { date: "desc" },
  });
}

export async function getTrendSnapshots(days: number) {
  const rows = await prisma.dashboardSnapshot.findMany({
    orderBy: { date: "desc" },
    take: days,
  });
  return rows.reverse();
}

export async function getLatestOrderStatusSnapshots() {
  const latest = await prisma.orderStatusSnapshot.findFirst({ orderBy: { date: "desc" } });
  if (!latest) return [];

  return prisma.orderStatusSnapshot.findMany({ where: { date: latest.date } });
}

export function getApiSyncStatuses() {
  return prisma.apiSyncStatus.findMany();
}

export async function getLatestAppSummarySnapshots() {
  const latest = await prisma.appSummarySnapshot.findFirst({ orderBy: { date: "desc" } });
  if (!latest) return [];

  return prisma.appSummarySnapshot.findMany({ where: { date: latest.date } });
}