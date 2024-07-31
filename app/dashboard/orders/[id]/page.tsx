import { ViewOrderItem } from "@/app/components/dashboard/ViewOrderItem";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";

async function getData(orderId: string) {
    const data = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            orderItems: true,
            User: {
                include: {
                    UserDetails: true,
                },
            },
            
        },
    });

    if (!data) {
        return notFound();
    }

    return {
        ...data,
        User: data.User || {
            firstName: "",
            lastName: "",
            email: "",
            profileImage: "",
            UserDetails: {
                phoneNumber: "",
                street: "",
                landmark: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
            },
        },
    };
}

export default async function OrderItemRoute({
    params,
}: {
    params: { id: string };
}) {
    const data = await getData(params.id);
    console.log(data);

    return <ViewOrderItem data={data} />;
}
