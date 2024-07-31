import prisma from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
    noStore();
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user || user === null || !user.id) {
            throw new Error("Something went wrong...");
        }

        let dbUser = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });

        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    id: user.id,
                    firstName: user.given_name ?? "",
                    lastName: user.family_name ?? "",
                    email: user.email ?? "",
                    profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
                },
            });
        }

        return NextResponse.redirect(
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000/"
                : 'https://shoe-store-pied.vercel.app/'
        );
    } catch (error) {
        console.error("Error occurred in /api/auth/creation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    // const { getUser } = getKindeServerSession();
    // const user = await getUser();

    // if (!user || user === null || !user.id) {
    //     throw new Error("Something went wrong...");
    // }

    // let dbUser = await prisma.user.findUnique({
    //     where: {
    //         id: user.id,
    //     },
    // });

    // if (!dbUser) {
    //     dbUser = await prisma.user.create({
    //         data: {
    //             id: user.id,
    //             firstName: user.given_name ?? "",
    //             lastName: user.family_name ?? "",
    //             email: user.email ?? "",
    //             profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
    //         },
    //     });
    // }

    // return NextResponse.redirect('http://localhost:3000/');
}