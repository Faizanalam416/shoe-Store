import { z } from "zod";

export const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    size: z.string(),
    color: z.string(),
    status: z.enum(["draft", "published", "archived"]),
    price: z.number().min(0),
    offerPrice: z.number().min(0),
    images: z.array(z.string()).min(1, "At least one image is required"),
    category: z.enum(["men", "women", "kids"]),
    subCategory: z.enum([
        "shoes",
        "sandals",
        "bags",
        "accessories"
    ]),
    productCategories: z.enum([
        "casualShoes",
        "chappals",
        "flipFlops",
        "sportShoes",
        "DrPadsSandalsJuti",
        "flatHeels",
        "pencilHeels",
        "blockHeels",
        "causalSandals",
        "handBags",
        "collageBags",
        "purseOfVariety",
        "clutches",
        "beltsLeather",
        "formalShoes",
        "formalShoesLeather",
        "loafers",
        "sandals",
        "belts",
        "wallets",
        "boys",
        "girls",
        "infants",
        "schools",
    ]),
    isFeatured: z.boolean().optional(),
});

export const bannerSchema = z.object({
    title: z.string(),
    imageString: z.string(),
});

export const orderSchema = z.object({
    trackingId: z.string().optional(),
    deliveryStatus: z.enum([
        "newOrdered",
        "packingItem",
        "shipped",
        "delivered",
    ]),
});

export const addressSchema = z.object({
    phoneNumber: z.string(),
    street: z.string(),
    landmark: z.string().optional(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
})