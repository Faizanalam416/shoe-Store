import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface iAppProps {
    item: {
        id: string;
        name: string;
        description: string;
        price: number;
        offerPrice: number;
        images: string[];
    };
}

export function ProductCard({ item }: iAppProps) {
    return (
        <div className="rounded-lg">
            <Carousel className="w-full mx-auto">
                <CarouselContent>
                    {item.images.map((item, index) => (
                        <CarouselItem key={index}>
                            <div className="relative h-[330px]">
                                <Image
                                    src={item}
                                    alt="Product Image"
                                    className="object-cover object-center w-full h-full rounded-lg"
                                    fill
                                    sizes="100vh"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-16" />
                <CarouselNext className="mr-16" />
            </Carousel>

            <div className="flex justify-between items-center mt-2">
                <h1 className="font-semibold text-xl">{item.name}</h1>
                <div className="flex flex-row gap-2">
                    {
                        item.offerPrice === 0 ? (
                            <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/10">&#x20b9; {item.price}</h3>
                        ) : (
                            <>
                                <h3 className="inline-flex items-center rounded-md bg-gray-800/10 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-800/10 line-through">&#x20b9; {item.price}</h3>
                                <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/10">&#x20b9; {item.offerPrice}</h3>
                            </>
                        )
                    }
                </div>
            </div>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>
            <Link href={`/product/${item.id}`}>
                <Button className="w-full mt-5">
                    View this!
                </Button>
            </Link>
        </div>
    );
}

export function LoadingProductCard() {
    return (
        <div className="flex flex-col">
            <Skeleton className="w-full h-[330px]" />
            <div className="flex flex-col mt-2 gap-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="w-full h-10 mt-5" />
        </div>
    );
}
