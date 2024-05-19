import { db } from "@/db/prisma";
import { OrderStatus } from "@prisma/client";


export function changeOrderStatus({ id, newStatus }: { id: string, newStatus: OrderStatus }) {
  return db.order.update({
    where: { id },
    data: { status: newStatus },
  })
}