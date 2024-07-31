"use client";

import * as React from "react";
import { ListOrdered, ChevronsUpDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { type $Enums } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
    imageString: string;
}

interface ViewOrderItemProps {
    orders: {
        id: string;
        amount: number;
        createdAt: Date;
        orderItems: OrderItem[];
        deliveryStatus: $Enums.DeliveryStatus;
        trackingId: string | null;
    }[];
}

const toPascalCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB').format(new Date(date));
};


export function OrderedItem({ orders }: ViewOrderItemProps) {
    const { toast } = useToast();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast({
                    description: "Tracking ID copied to clipboard!",
                    className: "bg-[#F1F5F9] font-medium",
                });
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    };

    return (
        <>
            <div className="max-w-5xl mx-auto mt-10 min-h-[60vh]">
                {orders.length === 0 || !orders ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <ListOrdered className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="mt-6 text-xl font-semibold">
                            Your order history is currently empty.
                        </h2>
                        <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                            Your order history is empty. It appears you haven&apos;t placed any
                            orders yet. When you do, you&apos;ll see your past orders and details
                            right here.
                        </p>
                        <Button asChild>
                            <Link href="/">Shop Now!</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <Tabs defaultValue="myOrder" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="myOrder">My Order</TabsTrigger>
                                <TabsTrigger value="Completed">Delivered</TabsTrigger>
                            </TabsList>
                            <TabsContent value="myOrder">
                                {orders
                                    .filter((order) => order.deliveryStatus !== "delivered")
                                    .map((order) => (
                                        <Collapsible
                                            key={order.id}
                                            className="w-full space-y-2"
                                        >
                                            <Card className="w-full my-4" key={order.id}>
                                                <CardHeader className="grid grid-flow-col justify-between">
                                                    <div>
                                                        <CardTitle className="text-xl">
                                                            Order Id: {order.id}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Order Date:{" "}
                                                            {formatDate(order.createdAt)}
                                                        </CardDescription>
                                                    </div>
                                                    <CollapsibleTrigger asChild>
                                                        <div className="grid grid-flow-row place-items-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="w-9 p-0"
                                                            >
                                                                <ChevronsUpDown className="h-4 w-4" />
                                                                <span className="sr-only">Toggle</span>
                                                            </Button>
                                                            <span className="text-[12px] font-medium">View Details</span>
                                                        </div>
                                                    </CollapsibleTrigger>
                                                </CardHeader>
                                                <Separator className="mb-2" />
                                                <CollapsibleContent>
                                                    <CardContent>
                                                        {order.orderItems.map((item) => (
                                                            <div key={item.id}>
                                                                <div className="flex items-center justify-between mx-auto">
                                                                    <div className="my-4 grid gap-y-2">
                                                                        <div className="grid grid-cols-2 gap-y-2">
                                                                            <p className="font-medium tracking-tight">
                                                                                Name:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                {item.name}
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                Price:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                &#x20b9; {item.price}
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                Size:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                {item.selectedSize}
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                Color:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                {item.selectedColor}
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                Quantity:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid gap-2 font-semibold w-36 md:w-44">
                                                                        <Image
                                                                            className="place-self-center rounded-lg object-cover"
                                                                            src={item.imageString}
                                                                            alt={item.name}
                                                                            width={200} // adjust as needed
                                                                            height={200} // adjust as needed
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                    <Separator />
                                                </CollapsibleContent>
                                                <CardFooter className="grid my-4 gap-y-2">
                                                    <div className="grid grid-cols-3 gap-y-2">
                                                        <h1 className="col-span-1">Delivery Status:</h1>
                                                        <h1 className="col-span-2">
                                                            {toPascalCase(order.deliveryStatus)}
                                                        </h1>
                                                        <h1 className="col-span-1">Tracking Id:</h1>
                                                        <h1 className="col-span-2 flex">
                                                            {order.trackingId === "0" ? "" : order.trackingId}
                                                        </h1>
                                                    </div>
                                                </CardFooter>

                                            </Card>
                                        </Collapsible>

                                    ))}
                            </TabsContent>
                            <TabsContent value="Completed">
                                {orders
                                    .filter((order) => order.deliveryStatus === "delivered")
                                    .map((order) => (
                                        <Collapsible
                                            key={order.id}
                                            className="w-full space-y-2"
                                        >
                                            <Card className="w-full my-4" key={order.id}>
                                                <CardHeader className="grid grid-flow-col justify-between">
                                                    <div>
                                                        <CardTitle className="text-xl">
                                                            Order Id: {order.id}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Order Date:{" "}
                                                            {formatDate(order.createdAt)}
                                                        </CardDescription>
                                                    </div>
                                                    <CollapsibleTrigger asChild>
                                                        <div className="grid grid-flow-row place-items-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="w-9 p-0"
                                                            >
                                                                <ChevronsUpDown className="h-4 w-4" />
                                                                <span className="sr-only">Toggle</span>
                                                            </Button>
                                                            <span className="text-[12px] font-medium">View Details</span>
                                                        </div>
                                                    </CollapsibleTrigger>
                                                </CardHeader>
                                                <Separator className="mb-2" />
                                                <CollapsibleContent>
                                                    <CardContent>
                                                        {order.orderItems.map((item) => (
                                                            <div key={item.id}>
                                                                <div className="flex items-center justify-between mx-auto">
                                                                    <div className="my-4 grid gap-y-2">
                                                                        <div className="grid grid-cols-2 gap-y-2">
                                                                            <p className="font-medium tracking-tight">
                                                                                Name:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                {item.name}
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                Price:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                &#x20b9; {item.price}
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                Size:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                {item.selectedSize}
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                Color:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                {item.selectedColor}
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                Quantity:
                                                                            </p>
                                                                            <p className="font-medium tracking-tight">
                                                                                {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid gap-2 font-semibold w-36 md:w-44">
                                                                        <Image
                                                                            className="place-self-center rounded-lg object-cover"
                                                                            src={item.imageString}
                                                                            alt={item.name}
                                                                            width={200} // adjust as needed
                                                                            height={200} // adjust as needed
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                    <Separator />
                                                </CollapsibleContent>
                                                <CardFooter className="grid my-4 gap-y-2">
                                                    <div className="grid grid-cols-3 gap-y-2">
                                                        <h1 className="col-span-1">Delivery Status:</h1>
                                                        <h1 className="col-span-2">
                                                            {toPascalCase(order.deliveryStatus)}
                                                        </h1>
                                                        <h1 className="col-span-1">Tracking Id:</h1>
                                                        <h1 className="col-span-2 flex">
                                                            {order.trackingId && order.trackingId !== "0" ? (
                                                                <>
                                                                    {order.trackingId}
                                                                    <Copy
                                                                        className="w-4 mx-2 cursor-pointer"
                                                                        onClick={() => copyToClipboard(order.trackingId!)} // Add non-null assertion operator here
                                                                    />
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </h1>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </Collapsible>
                                    ))}
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </div>
        </>
    );
}

