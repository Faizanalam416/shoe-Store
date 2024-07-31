"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { checkOut, delItem } from "@/app/actions";
import { CheckoutButton, DeleteItem } from "@/app/components/SubmitButtons";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Cart } from "@/app/lib/interfaces";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface iAppProps {
    cart: Cart | null;
    totalPrice: number;
    userDetail: any;
}

const toPascalCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export function BagContent({ cart, totalPrice, userDetail }: iAppProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        if (userDetail) {
            setIsDialogOpen(true);
        }
    };

    const handleConfirmCheckout = async () => {
        setIsDialogOpen(false);
        setIsLoading(true);

        try {
            const { url } =  await checkOut();
            window.location.href = url;
        } catch (error) {
            console.error("Checkout failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 min-h-[60vh]">
            {cart?.items.length === 0 || !cart || !cart.items ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <ShoppingBag className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold">
                        You do not have any products in your Bag
                    </h2>
                    <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                        You currently do not have any products in your shopping bag. Please
                        add some so that you can see them right here.
                    </p>
                    <Button asChild>
                        <Link href="/">Shop Now!</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-y-10">
                    {cart?.items.map((item) => (
                        <div key={item.id} className="flex">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                                <Image
                                    fill
                                    src={item.imageString}
                                    alt="Product image"
                                    className="rounded-md object-cover"
                                    sizes="100vh"
                                />
                            </div>
                            <div className="ml-5 flex justify-between w-full font-medium">
                                <div>
                                    <p>{item.name}</p>
                                    <h3>
                                        Size: <span>{item.selectedSize}</span>
                                    </h3>
                                    <h3>
                                        Color: <span>{item.selectedColor}</span>
                                    </h3>
                                </div>
                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex items-center gap-x-2">
                                        <p>{item.quantity} x</p>
                                        <p>&#x20b9; {item.offerPrice !== 0 ? item.offerPrice : item.price}</p>
                                    </div>
                                    <form action={delItem} className="text-end">
                                        <input type="hidden" name="productId" value={item.id} />
                                        <DeleteItem />
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-10">
                        <div className="flex items-center justify-between font-medium">
                            <p>Subtotal</p>
                            <p>
                                &#x20b9; {new Intl.NumberFormat("en-IN").format(totalPrice)}
                            </p>
                        </div>

                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    onClick={handleCheckout}
                                    className="w-full p-0 h-0 mt-6"
                                    variant="ghost"
                                >
                                    <CheckoutButton />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{userDetail ? 'Do you want to deliver your order to this address?' : 'There is no saved delivery address.'}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {userDetail ? 'If you want to change the address, please change it before checkout.' : 'Provide your address so that you can receive your order.'}
                                    </AlertDialogDescription>
                                    {
                                        userDetail ? (
                                            <div className="grid grid-cols-3">
                                                <p>Mobile Number:</p>
                                                <p className="col-span-2">{userDetail.phoneNumber}</p>
                                                <p>Street:</p>
                                                <p className="col-span-2">{toPascalCase(userDetail.street)}</p>
                                                <p>Landmark:</p>
                                                <p className="col-span-2">{toPascalCase(userDetail.landmark)}</p>
                                                <p>City:</p>
                                                <p className="col-span-2">{toPascalCase(userDetail.city)}</p>
                                                <p>State:</p>
                                                <p className="col-span-2">{toPascalCase(userDetail.state)}</p>
                                                <p>Country:</p>
                                                <p className="col-span-2">{toPascalCase(userDetail.country)}</p>
                                                <p>Zip-Code:</p>
                                                <p className="col-span-2">{userDetail.zipCode}</p>
                                            </div>
                                        ) : (
                                            <p className="tracking-tight text-center p-5 text-gray-700">Please fill out the details.</p>
                                        )
                                    }
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <Link href="/myAccount">
                                        <AlertDialogAction>
                                            {!userDetail ? "Fill Address" : "Change Address"}
                                        </AlertDialogAction>
                                    </Link>
                                    {
                                        userDetail && (
                                            <AlertDialogAction onClick={handleConfirmCheckout}>
                                                Checkout
                                            </AlertDialogAction>
                                        )
                                    }
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        {isLoading && (
                            <div className="grid grid-rows-1 justify-center mt-8">
                                <div role="status">
                                    <svg
                                        aria-hidden="true"
                                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
