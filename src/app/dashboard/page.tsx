import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/db/prisma"
import { formatPrice } from "@/lib/utils"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound } from "next/navigation"

export  default async function Page() {

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL

  if(!user || user.email !== ADMIN_EMAIL) {
    return notFound()
  }


  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7))
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true,
      shippingAddress: true,
    }
  })

  const lasWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7))
      }
    },
    _sum: {
      amount: true
    }
  })

  const lasMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    },
    _sum: {
      amount: true
    }
  })

  const WEEKLY_GOAL = 500
  const MONTHLY_GOAL = 2500
  return (
    <div className="flex max-h-screen w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Week</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lasWeekSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent >
                <div className="text-sm text-muted-foreground">
                    of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={((lasWeekSum._sum.amount ?? 0 ) * 100) / WEEKLY_GOAL}/>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Week</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lasMonthSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent >
                <div className="text-sm text-muted-foreground">
                    of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={((lasMonthSum._sum.amount ?? 0 ) * 100) / MONTHLY_GOAL}/>
              </CardFooter>
            </Card>
          </div>  

          <h1 className="text-4xl font-bold tracking-tighter">Incoming orders</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHeader>Customer</TableHeader>
                <TableHeader className="hidden sm:table-cell">Status</TableHeader>
                <TableHeader className="hidden sm:table-cell">Purchase date</TableHeader>
                <TableHeader className="text-right">Amount</TableHeader>
              </TableRow>
            </TableHeader>
          </Table>

        </div>
      </div>
    </div>
  )
}
