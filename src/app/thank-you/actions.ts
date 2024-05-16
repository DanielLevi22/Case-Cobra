"use server"

import { db } from "@/db/prisma"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"



export async function getPaymentStatus({orderId}: {orderId: string}) {
 const  { getUser}  = getKindeServerSession()
 const user = await getUser()

 if(!user?.id || !user?.email){
  throw new Error('You need to be logged in to view this page.')
 }

 const order = await db.order.findFirst({
  where: {
    id: orderId,
    userId: user.id,
  },
  include: {
    shippingAddress: true,
    billingAddress: true,
    configuration: true,
    user: true,
  }
 })

 if(!order){
  throw new Error('Order not found')
 }

 if(order.isPaid){
  return order
 }else {
  return false
 }

 
}