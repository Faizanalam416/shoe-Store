"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { addressSchema, bannerSchema, orderSchema, productSchema } from "./lib/zodSchemas";
import prisma from "./lib/db";
import { redis } from "./lib/redis";
import { Cart } from "./lib/interfaces";
import { revalidatePath } from "next/cache";
import { stripe } from "./lib/stripe";
import Stripe from "stripe";
import { DeliveryStatus } from "@prisma/client";

export async function CreateProduct(prevState: unknown, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== "ds6483202@gmail.com") {
        return redirect("/");
    }

    const submission = parseWithZod(formData, {
        schema: productSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const flattenUrls = submission.value.images.flatMap((urlString) =>
        urlString.split(",").map((url) => url.trim())
    );

    await prisma.product.create({
        data: {
            name: submission.value.name,
            description: submission.value.description,
            size: submission.value.size,
            color: submission.value.color,
            status: submission.value.status,
            price: submission.value.price,
            offerPrice: submission.value.offerPrice,
            images: flattenUrls,
            category: submission.value.category,
            subCategory: submission.value.subCategory,
            productCategories: submission.value.productCategories,
            isFeatured: submission.value.isFeatured === true ? true : false,
        },
    });

    redirect("/dashboard/products");
}

export async function editProduct(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== "ds6483202@gmail.com") {
        return redirect("/");
    }

    const submission = parseWithZod(formData, {
        schema: productSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const flattenUrls = submission.value.images.flatMap((urlString) =>
        urlString.split(",").map((url) => url.trim())
    );

    const productId = formData.get("productId") as string;
    await prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            name: submission.value.name,
            description: submission.value.description,
            size: submission.value.size,
            color: submission.value.color,
            category: submission.value.category,
            subCategory: submission.value.subCategory,
            productCategories: submission.value.productCategories,
            price: submission.value.price,
            offerPrice: submission.value.offerPrice,
            isFeatured: submission.value.isFeatured === true ? true : false,
            status: submission.value.status,
            images: flattenUrls,
        },
    });

    redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== "ds6483202@gmail.com") {
        return redirect("/");
    }

    await prisma.product.delete({
        where: {
            id: formData.get("productId") as string,
        },
    });

    redirect("/dashboard/products");
}

export async function createBanner(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== "ds6483202@gmail.com") {
        return redirect("/");
    }

    const submission = parseWithZod(formData, {
        schema: bannerSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    await prisma.banner.create({
        data: {
            title: submission.value.title,
            imageString: submission.value.imageString,
        },
    });

    redirect("/dashboard/banner");
}

export async function deleteBanner(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== "ds6483202@gmail.com") {
        return redirect("/");
    }

    await prisma.banner.delete({
        where: {
            id: formData.get("bannerId") as string,
        },
    });

    redirect("/dashboard/banner");
}

export async function addItem(
    productId: string,
    selectedSize: string,
    selectedColor: string
) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/");
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`);

    const selectedProduct = await prisma.product.findUnique({
        select: {
            id: true,
            name: true,
            size: true,
            color: true,
            price: true,
            offerPrice: true,
            images: true,
        },
        where: {
            id: productId,
        },
    });

    if (!selectedProduct) {
        throw new Error("No product with this id");
    }

    let myCart = {} as Cart;

    if (!cart || !cart.items) {
        myCart = {
            userId: user.id,
            items: [
                {
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    offerPrice: selectedProduct.offerPrice,
                    selectedSize: selectedSize,
                    selectedColor: selectedColor,
                    imageString: selectedProduct.images[0],
                    quantity: 1,
                },
            ],
        };
    } else {
        let itemFound = false;

        myCart.items = cart.items.map((item) => {
            if (item.id === productId) {
                itemFound = true;

                if (
                    item.selectedSize === selectedSize &&
                    item.selectedColor === selectedColor
                ) {
                    item.quantity += 1;
                } else {
                    item.selectedSize = selectedSize;
                    item.selectedColor = selectedColor;
                }
            }

            return item;
        });

        if (!itemFound) {
            myCart.items.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                offerPrice: selectedProduct.offerPrice,
                selectedSize: selectedSize,
                selectedColor: selectedColor,
                imageString: selectedProduct.images[0],
                quantity: 1,
            });
        }
    }

    await redis.set(`cart-${user.id}`, myCart);
    console.log(myCart.items);

    revalidatePath("/", "layout");
}

export async function delItem(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/");
    }

    const productId = formData.get("productId");

    let cart: Cart | null = await redis.get(`cart-${user.id}`);

    if (cart && cart.items) {
        const updateCart: Cart = {
            userId: user.id,
            items: cart.items.filter((item) => item.id !== productId),
        };

        await redis.set(`cart-${user.id}`, updateCart);
    }

    revalidatePath("/bag");
}

export async function checkOut(): Promise<{ url: string }> {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/");
    }

    const userDetail = await prisma.userDetail.findUnique({
        where: { userId: user.id },
    });

    if (!userDetail) {
        throw new Error("User detail not found");
    }

    // Ensure the user exists in the database
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
    });

    if (!dbUser) {
        throw new Error("User not found in the database");
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`);

    if (cart && cart.items) {
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
            cart.items.map((item) => ({
                price_data: {
                    currency: "inr",
                    unit_amount: (item.offerPrice !== 0 ? item.offerPrice : item.price ) * 100,
                    product_data: {
                        name: item.name,
                        images: [item.imageString],
                        metadata: {
                            size: item.selectedSize,
                            color: item.selectedColor,
                        },
                    },
                },
                quantity: item.quantity,
            }));

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: "http://localhost:3000/payment/success",
            cancel_url: "http://localhost:3000/payment/cancel",
            metadata: {
                userId: user.id,
            },
        });

        if (session.url) {
            return {url: session.url};
        } else {
            throw new Error("Checkout session URL is undefined");
        }

        // return redirect(session.url as string);
    }
    throw new Error("Cart is empty or undefined");
}

export async function updateOrderDetails(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== "ds6483202@gmail.com") {
        return redirect("/");
    }

    const submission = parseWithZod(formData, {
        schema: orderSchema
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const orderId = formData.get("orderId") as string;

    await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            trackingId: submission.value.trackingId || null,
            deliveryStatus: submission.value.deliveryStatus,
        }
    });

    redirect("/dashboard/orders");
}

export async function updateUserDetails(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== "ds6483202@gmail.com") {
        return redirect("/");
    }

    const submission = parseWithZod(formData, {
        schema: addressSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const userId = user.id;

    const existingUserDetail = await prisma.userDetail.findUnique({
        where: {
            userId: userId,
        },
    });

    if (existingUserDetail) {
        await prisma.userDetail.update({
            where: {
                userId: userId,
            },
            data: {
                phoneNumber: submission.value.phoneNumber,
                street: submission.value.street,
                landmark: submission.value.landmark || null,
                city: submission.value.city,
                state: submission.value.state,
                zipCode: submission.value.zipCode,
                country: submission.value.country,
            },
        });
    } else {
        await prisma.userDetail.create({
            data: {
                phoneNumber: submission.value.phoneNumber,
                street: submission.value.street,
                landmark: submission.value.landmark,
                city: submission.value.city,
                state: submission.value.state,
                zipCode: submission.value.zipCode,
                country: submission.value.country,
                userId: userId,
            },
        });
    }

    redirect("/");
}