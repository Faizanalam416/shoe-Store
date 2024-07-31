import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";
import { OrderedItem } from "@/app/components/storefront/OrderedItem";


export default async function MyOrderRoute() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: user.id,
        },
        include: {
            orderItems: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <>
            <OrderedItem orders={orders}/>
        </>
    );
}
