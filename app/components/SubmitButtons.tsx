"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import React from 'react';

interface buttonProps {
    text: string;
    variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

export function SubmitButton({ text, variant }: buttonProps) {
    const { pending } = useFormStatus();
    return (
        <>
            {pending ? (
                <Button disabled variant={variant}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </Button>
            ) : (
                <Button variant={variant} type="submit">
                    {text}
                </Button>
            )}
        </>
    );
}

export function ShoppingBagButton() {
    const { pending } = useFormStatus();

    const searchParams = useSearchParams();
    const selectedSize = searchParams.get("selectedSize");
    const selectedColor = searchParams.get("selectedColor");

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = () => {
        if (!selectedSize || !selectedColor) {
            setErrorMessage("Please select a size and color");
        } else {
            setErrorMessage("");
        }
    };

    return (
        <>
            {
                pending ? (
                    <Button disabled size="lg" className="w-full mt-5">
                        <Loader2 className="mr-4 h-5 w-5 animate-spin" /> Please  Wait
                    </Button>
                ) : (
                    <Button size="lg" className="w-full mt-5" type="submit" onClick={handleSubmit}>
                        <ShoppingBag className="mr-4 h-5 w-5" /> Add to Cart
                    </Button>
                )
            }
            <p id="error-message" className="text-red-500 my-4">{errorMessage}</p>
        </>
    )
}

export function DeleteItem() {
    const { pending } = useFormStatus();

    return (
        <>
            {
                pending ? (
                    <button disabled className='font-medium text-primary text-end'>Removing...</button>
                ) : (
                    <button type="submit" className='font-medium text-primary text-end'>Delete</button>
                )
            }
        </>
    )
}

export function CheckoutButton() {
    const { pending } = useFormStatus();
    return (
        <>
            {
                pending ? (
                    <Button disabled size="lg" className='w-full mt-5'>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
                    </Button>
                ) : (
                    <Button type="submit" size="lg" className='w-full mt-5'>
                        Checkout
                    </Button>
                )
            }
        </>
    )
}


export function CardViewButton() {
    const { pending } = useFormStatus();
    return (
        <>
            {
                pending ? (
                    <Button disabled className="w-full mt-5">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
                    </Button>
                ) : (
                    <Button className="w-full mt-5">
                        View this!
                    </Button>
                )
            }
        </>
    )
}