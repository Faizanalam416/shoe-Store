import prisma from "@/app/lib/db";
import { redis } from "@/app/lib/redis";
import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import { Stripe } from "stripe";
import { DeliveryStatus } from "@prisma/client";
import { Cart } from "@/app/lib/interfaces";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_SECRET_WEBHOOK as string
        );
    } catch (error: unknown) {
        console.error("Webhook error:", error);
        return new Response("Webhook Error", { status: 400 });
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;

            if (!userId) {
                console.error("User ID is missing in session metadata.");
                return new Response("User ID missing", { status: 400 });
            }

            try {

                // Fetch cart data from Redis
                let cart: Cart | null = await redis.get(`cart-${userId}`);
            
                if (cart) {
                        // Create the order with associated order items
                        const createdOrder = await prisma.order.create({
                            data: {
                                amount: session.amount_total as number,
                                status: "completed",
                                userId: userId,
                                deliveryStatus: DeliveryStatus.newOrdered,
                                trackingId: "",
                                orderItems: {
                                    create: cart.items.map((item: any) => ({
                                        name: item.name,
                                        price: item.offerPrice !== 0 ? item.offerPrice : item.price,
                                        selectedSize: item.selectedSize,
                                        selectedColor: item.selectedColor,
                                        quantity: item.quantity,
                                        imageString: item.imageString,
                                    })),
                                },
                            },
                        });

                        // Clear the cart in Redis after successful order creation
                        await redis.del(`cart-${userId}`);
                } else {
                    console.error("Cart data not found in Redis.");
                }
            } catch (error) {
                console.error("Error processing checkout:", error);
                return new Response("Internal Server Error", { status: 500 });
            }

            break;
        }
        default: {
            console.log("Unhandled event type:", event.type);
            break;
        }
    }

    return new Response(null, { status: 200 });
}
