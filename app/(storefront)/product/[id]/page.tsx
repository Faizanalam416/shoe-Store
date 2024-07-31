import { ImageSlider } from "@/app/components/storefront/ImageSlider";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { StarIcon } from "lucide-react";
import { FeaturedProducts } from "@/app/components/storefront/FeaturedProducts";
import { addItem } from "@/app/actions";
import { ShoppingBagButton } from "@/app/components/SubmitButtons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Color, Size } from "@/app/components/storefront/SelectSizeColor";
import React from "react";
import { unstable_noStore as noStore } from 'next/cache';

async function getData(productId: string) {
    const data = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            size: true,
            color: true,
            price: true,
            offerPrice: true,
            images: true,
            category: true,
            subCategory: true,
            productCategories: true,
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export default async function ProductIdRoute({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    noStore();
    const data = await getData(params.id);
    // Ensure selectedSize is of type string or handle the case when searchParams is undefined
    const selectedSize: string = (
        searchParams?.selectedSize
            ? Array.isArray(searchParams.selectedSize)
                ? searchParams.selectedSize[0]
                : searchParams.selectedSize
            : ""
    ) as string;

    // Ensure selectedColor is of type string or handle the case when searchParams is undefined
    const selectedColor: string = (
        searchParams?.selectedColor
            ? Array.isArray(searchParams.selectedColor)
                ? searchParams.selectedColor[0]
                : searchParams.selectedColor
            : ""
    ) as string;

    // const selectedSize = searchParams?.selectedSize ?? "";
    // const selectedColor = searchParams?.selectedColor ?? "";

    const addProducttoShoppingCart = addItem.bind(
        null,
        data.id,
        selectedSize,
        selectedColor
    );
    console.log(data);

    const size = data.size.split(", ");
    const color = data.color.split(", ");
    console.log(size);
    console.log(color);

    console.log("Selected Size:", selectedSize);
    console.log("Selected Color:", selectedColor);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
                <ImageSlider images={data.images} />
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        {data.name}
                    </h1>
                    {data.offerPrice === 0 ? (
                        <p className="text-3xl mt-2 text-primary">&#x20b9; {data.price}</p>
                    ) : (
                        <div className="flex flex-row gap-5">
                            <p className="text-3xl mt-2 text-gray-500">
                                MRP <span className="line-through">&#x20b9; {data.price}</span>
                            </p>
                            <p className="text-3xl mt-2 text-primary">
                                &#x20b9; {data.offerPrice}
                            </p>
                            <p className="text-[20px] mt-2 text-primary/70">
                                -
                                {(((data.price - data.offerPrice) / data.price) * 100).toFixed(
                                    1
                                )}{" "}
                                off
                            </p>
                        </div>
                    )}

                    {/* <div className="mt-3 flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div> */}

                    <Size size={size} />

                    <Color color={color} />

                    <p className="text-base text-gray-700 mt-6">{data.description}</p>

                    <form
                        action={addProducttoShoppingCart}
                    >
                        <ShoppingBagButton />
                    </form>
                </div>
            </div>

            <div className="mt-16">
                <FeaturedProducts />
            </div>
        </>
    );
}
