import { prisma } from "@/lib/prisma";
import type { SourceApp, SyncStatus } from "@prisma/client";
import type { SourceFetchResults } from "./fetchers";

function reasonMessage(result: PromiseSettledResult<unknown>): string {
  if (result.status === "rejected") {
    return result.reason?.message ?? "Error desconocido";
  }
  return "";
}

async function markSyncStatus(app: SourceApp, status: SyncStatus, message?: string) {
  await prisma.apiSyncStatus.upsert({
    where: { app },
    update: { status, message: message ?? null },
    create: { app, status, message: message ?? null },
  });
}

export type SyncStatusSummary = {
  buyerOk: boolean;
  sellerOk: boolean;
  shippingOk: boolean;
  paymentsOk: boolean;
};

export async function evaluateAndPersistSyncStatus(results: SourceFetchResults): Promise<SyncStatusSummary> {
  const buyerOk = results.compradores.status === "fulfilled" && results.pedidos.status === "fulfilled";
  await markSyncStatus(
    "BUYER",
    buyerOk ? "OK" : "ERROR",
    buyerOk ? undefined : [reasonMessage(results.compradores), reasonMessage(results.pedidos)].filter(Boolean).join(" | ")
  );

  const sellerOk = results.ventas.status === "fulfilled";
  await markSyncStatus("SELLER", sellerOk ? "OK" : "ERROR", sellerOk ? undefined : reasonMessage(results.ventas));

  const shippingOk = results.envios.status === "fulfilled";
  await markSyncStatus("SHIPPING", shippingOk ? "OK" : "ERROR", shippingOk ? undefined : reasonMessage(results.envios));

  const paymentsOk = results.pagos.status === "fulfilled" && results.disputas.status === "fulfilled";
  await markSyncStatus(
    "PAYMENTS",
    paymentsOk ? "OK" : "ERROR",
    paymentsOk ? undefined : [reasonMessage(results.pagos), reasonMessage(results.disputas)].filter(Boolean).join(" | ")
  );

  return { buyerOk, sellerOk, shippingOk, paymentsOk };
}