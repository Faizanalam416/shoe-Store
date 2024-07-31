import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import CommandSearch from "@/app/components/dashboard/CommandSearch";

async function getData(search: string) {
    const data = await prisma.order.findMany({
        where: search ? {
            id: {
                startsWith: search
            }
        } : {},
        select: {
            amount: true,
            createdAt: true,
            status: true,
            id: true,
            deliveryStatus: true,
            User: {
                select: {
                    firstName: true,
                    email: true,
                    profileImage: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return data;
}

export default async function OrdersPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined}
}) {
    const search = searchParams?.search || '';
    const data = await getData(search as string);
    return (
        <>
            <div className="flex items-center justify-end">
                {/* <Button asChild className="flex items-center gap-x-2">
                    <Link href={"/dashboard/products/create"}>
                        <span>Add Product</span>
                    </Link>
                </Button> */}
                <CommandSearch/>
            </div>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Recent orders from your store!</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Delivery Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <p className="font-medium">{item.User?.firstName}</p>
                                        <p className="hidden md:flex text-sm text-muted-foreground">
                                            {item.User?.email}
                                        </p>
                                    </TableCell>
                                    <TableCell>Order</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat("en-IN").format(item.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        &#x20b9;{" "}
                                        {new Intl.NumberFormat("en-IN").format(item.amount / 100)}
                                    </TableCell>
                                    <TableCell>{item.deliveryStatus}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/orders/${item.id}`}>
                                                        View Order
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
