import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MyAccount } from "@/app/components/storefront/MyAccount";
import prisma from "@/app/lib/db";


export default async function MyAccountRoute() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    const userDetails = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        include: {
            UserDetails: true,
        },
    });
    

    if (!userDetails) {
        redirect("/");
    }
    

    return (
        <>
            <MyAccount user={userDetails} />
        </>
    );
}
