import { FilterProducts } from "@/app/components/storefront/FilterProduct";
import { ProductCard } from "@/app/components/storefront/ProductCard";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";

async function getData(productCategory: string) {
    switch (productCategory) {
        case "all": {
            const data = await prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    offerPrice: true,
                    images: true,
                    category: true,
                    subCategory: true,
                    productCategories: true,
                },
                where: {
                    status: "published",
                },
            });

            return {
                title: "All Products",
                data: data,
            };
        }
        case "men": {
            const data = await prisma.product.findMany({
                where: {
                    status: "published",
                    category: "men",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    offerPrice: true,
                    images: true,
                    category: true,
                    subCategory: true,
                    productCategories: true,
                },
            });

            return {
                title: "Products for Men",
                data: data,
            };
        }
        case "women": {
            const data = await prisma.product.findMany({
                where: {
                    status: "published",
                    category: "women",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    offerPrice: true,
                    images: true,
                    category: true,
                    subCategory: true,
                    productCategories: true,
                },
            });

            return {
                title: "Products for Women",
                data: data,
            };
        }
        case "kid": {
            const data = await prisma.product.findMany({
                where: {
                    status: "published",
                    category: "kids",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    offerPrice: true,
                    images: true,
                    category: true,
                    subCategory: true,
                    productCategories: true,
                },
            });

            return {
                title: "Products for Kids",
                data: data,
            };
        }
        default: {
            return notFound();
        }
    }
}

export default async function CategoriesPage({
    params,
    searchParams,
}: {
    params: { name: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const { data, title } = await getData(params.name);

    // const allCategory =  data.map(product => product.category);
    // console.log(allCategory);

    const allSubCategory = data.map((product) => product.subCategory);
    // console.log(allSubCategory);

    const allProductCategories = data.map((product) => product.productCategories);
    // console.log(allProductCategories);

    const selectedItem = searchParams?.selectedItem ?? "";
    // console.log(selectedItem);

    // const uniqueAllSubCategory = allSubCategory.filter((item, i, array) => array.indexOf(item) === i);
    // console.log(uniqueAllSubCategory);

    // const uniqueAllProductCategories = allProductCategories.filter((item, i, array) => array.indexOf(item) === i);
    // console.log(uniqueAllProductCategories);

    const uniqueAllSubCategory = [...new Set(allSubCategory)];
    const uniqueAllProductCategories = [...new Set(allProductCategories)];

    const filteredProducts = selectedItem
        ? data.filter(
            (product) =>
                product.subCategory === selectedItem ||
                product.productCategories === selectedItem
        )
        : data;

    return (
        <section>
            <h1 className="font-semibold text-3xl my-5">{title}</h1>
            <FilterProducts
                allSubCategory={uniqueAllSubCategory as string[]}
                allProductCategories={uniqueAllProductCategories as string[]}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
