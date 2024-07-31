"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "../SubmitButtons";
import { type $Enums } from "@prisma/client";
import { useFormState } from "react-dom";
import { updateOrderDetails } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { orderSchema } from "@/app/lib/zodSchemas";

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
    data: {
        id: string;
        status: string;
        amount: number;
        createdAt: Date;
        orderItems: OrderItem[];
        User: {
            firstName: string;
            lastName: string;
            email: string;
            profileImage: string;
            UserDetails?: {
                phoneNumber: string;
                street: string;
                landmark?: string | null;
                city: string;
                state: string;
                zipCode: string;
                country: string;
            } | null;
        } | null;
        deliveryStatus: $Enums.DeliveryStatus;
        trackingId: string | null;
    };
}

const toPascalCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export function ViewOrderItem({ data }: ViewOrderItemProps) {
    const [lastResult, action] = useFormState(updateOrderDetails, undefined);
    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, { schema: orderSchema });
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    return (
        <>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/orders">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold tracking-tight">
                    View All Order Items
                </h1>
            </div>
            <form id={form.id} onSubmit={form.onSubmit} action={action}>
                <input type="hidden" name="orderId" value={data.id} />
                <Card className="my-5">
                    <CardHeader className="grid gap-y-3">
                        <CardTitle className="tracking-tight">User Details: </CardTitle>
                        <Separator />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mx-auto">
                            <div className="my-4 grid gap-y-2">
                                <h2 className="text-lg font-semibold">Order ID: {data.id}</h2>
                                <div className="grid grid-cols-3 gap-y-2">
                                    <p>Status:</p>
                                    <p className="col-span-2">{toPascalCase(data.status)}</p>
                                    <p>Amount:</p>
                                    <p className="col-span-2">
                                        &#x20b9;{" "}
                                        {new Intl.NumberFormat("en-IN").format(data.amount / 100)}
                                    </p>
                                    <p>Created At:</p>
                                    <p className="col-span-2">
                                        {new Intl.DateTimeFormat("en-IN").format(data.createdAt)}
                                    </p>
                                    <p>User Name:</p>
                                    <p className="col-span-2">{toPascalCase(data.User?.firstName + " " + data.User?.lastName)}</p>
                                    <p>User Email:</p>
                                    <p className="col-span-2">{data.User?.email}</p>
                                </div>
                            </div>
                            <div>
                                <p className="grid gap-2 font-semibold text-center">
                                    User Profile Image
                                    <img
                                        className="place-self-center rounded-lg"
                                        src={data.User?.profileImage}
                                        alt="Profile"
                                    />
                                </p>
                            </div>
                        </div>

                        {
                            data.User?.UserDetails && (
                                <div className="my-4 grid gap-y-2">
                                    <h2 className="text-lg font-semibold">User Details :-</h2>
                                    <div className="grid grid-cols-3 gap-y-2">
                                        <p>Phone Number:</p>
                                        <p className="col-span-2">{data.User.UserDetails.phoneNumber}</p>
                                        <p>Street:</p>
                                        <p className="col-span-2">{toPascalCase(data.User.UserDetails.street)}</p>
                                        <p>Landmark:</p>
                                        <p className="col-span-2">{data.User.UserDetails.landmark ?? 'N/A'}</p>
                                        <p>City:</p>
                                        <p className="col-span-2">{toPascalCase(data.User.UserDetails.city)}</p>
                                        <p>State:</p>
                                        <p className="col-span-2">{toPascalCase(data.User.UserDetails.state)}</p>
                                        <p>Zip Code:</p>
                                        <p className="col-span-2">{data.User.UserDetails.zipCode}</p>
                                        <p>Country:</p>
                                        <p className="col-span-2">{toPascalCase(data.User.UserDetails.country)}</p>
                                    </div>
                                </div>
                            )
                        }
                        <Separator className="mt-2 mb-8" />

                        <Label className="text-lg font-semibold text-current">
                            Order Items
                        </Label>
                        <Table>
                            <TableCaption>The list of Order Items.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead>Price ( &#x20b9; )</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-center">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.orderItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Image
                                                alt={item.name}
                                                src={item.imageString}
                                                height={120}
                                                width={120}
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="text-md font-medium">
                                            {toPascalCase(item.name)}
                                        </TableCell>
                                        <TableCell>{item.selectedSize}</TableCell>
                                        <TableCell>{toPascalCase(item.selectedColor)}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell className="text-center">
                                            {item.price * item.quantity}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={6}>Total</TableCell>
                                    <TableCell className="text-center">
                                        &#x20b9;{" "}
                                        {new Intl.NumberFormat("en-IN").format(data.amount / 100)}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                        <Separator className="my-6" />

                        <div className="grid gap-6">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Delivery Details:
                            </h2>
                            <div className="flex flex-col gap-3">
                                <Label>Delivery Status</Label>
                                <Select
                                    key={fields.deliveryStatus.key}
                                    name={fields.deliveryStatus.name}
                                    defaultValue={data.deliveryStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newOrdered">New Ordered</SelectItem>
                                        <SelectItem value="packingItem">Packing Item</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">
                                            Delivered To Customer
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-red-500">{fields.deliveryStatus.errors}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Tracking Id</Label>
                                <Input
                                    type="text"
                                    key={fields.trackingId?.key}
                                    name={fields.trackingId?.name}
                                    defaultValue={data.trackingId ?? ''}
                                    className="w-full"
                                    placeholder="Enter Delivery Id"
                                />
                                <p className="text-red-500">{fields.trackingId?.errors}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton text="Update Details" />
                    </CardFooter>
                </Card>
            </form>
        </>
    );
}
