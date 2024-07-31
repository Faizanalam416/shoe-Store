"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const navbarLinks = [
    {
        id: 0,
        name: "Home",
        href: "/",
    },
    {
        id: 1,
        name: "All Products",
        href: "/products/all",
    },
    {
        id: 2,
        name: "Men",
        href: "/products/men",
    },
    {
        id: 3,
        name: "Women",
        href: "/products/women",
    },
    {
        id: 4,
        name: "kids",
        href: "/products/kid",
    },
];

export function NavbarLinks() {
    const location = usePathname();
    return (
        <>
            {
                navbarLinks.map((item) => (
                    <Link
                        href={item.href}
                        key={item.id}
                        className={cn(
                            location === item.href
                                ? "bg-muted"
                                : "hover:bg-muted hover:bg-opacity-75",
                            "group p-2 font-medium rounded-md"
                        )}
                    >
                        {item.name}
                    </Link>
                ))
            }
        </>
    )
}