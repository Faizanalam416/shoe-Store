"use client";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface iAppProps {
    allSubCategory: string[];
    allProductCategories: string[];
}

const toPascalCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export function FilterProducts({ allSubCategory, allProductCategories }: iAppProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    

    const handleItemClick = (item: string) => {
        const current = new URLSearchParams(searchParams);

        if (item === "All") {
            router.push(pathname);
        } else {
            if (!item) {
                current.delete("selectedItem");
            } else {
                current.set("selectedItem", item);
            }

            const search = current.toString();
            const query = search ? `?${search}` : "";

            router.push(`${pathname}${query}`);
        }
    };

    return (
        <>
            <div className="flex flex-row gap-6 my-6 w-[500px]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">View By Category <Filter className="w-4 ml-1 text-muted-foreground" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Filter the product by:</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {allSubCategory.length > 0
                                ? allSubCategory.map((category, index) => (
                                    <DropdownMenuSub key={index}>
                                        <DropdownMenuSubTrigger>
                                            {toPascalCase(category)}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => handleItemClick("All")}>
                                                    All
                                                </DropdownMenuItem>
                                                {allProductCategories.length > 0
                                                    ? allProductCategories.map((pCategory, index) => (
                                                        <DropdownMenuItem
                                                            key={index}
                                                            onClick={() => handleItemClick(pCategory)}
                                                        >
                                                            {toPascalCase(pCategory)}
                                                        </DropdownMenuItem>
                                                    ))
                                                    : "Not available any product category"}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                ))
                                : "Not available any sub category"}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
