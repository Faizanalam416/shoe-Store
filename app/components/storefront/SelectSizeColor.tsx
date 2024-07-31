"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSearchParams, useRouter } from "next/navigation";


interface iAppSizeProps {
    size: string[];
}

interface iAppColorProps {
    color: string[];
}

export function Size({ size }: iAppSizeProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSizeChange = (size: string) => {
        const current = new URLSearchParams(searchParams);
        if (!size) {
            current.delete("selectedSize");
        } else {
            current.set("selectedSize", size);
        }
        const query = current.toString();
        router.replace(`?${query}`, { scroll: false });
    };

    return (
        <>
            <div className="justify-start mx-auto">
                <ToggleGroup size={"lg"} type="single" variant="outline" className="justify-start mx-auto my-5 gap-4">
                    {
                        size.map((size, index) => (
                            <ToggleGroupItem key={index} value={size} onClick={() => handleSizeChange(size)}>
                                {size}
                            </ToggleGroupItem>
                        ))
                    }
                </ToggleGroup>
            </div>
        </>
    )
}


export function Color({ color }: iAppColorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleColorChange = (color: string) => {
        const current = new URLSearchParams(searchParams);
        if (!color) {
            current.delete("selectedColor");
        } else {
            current.set("selectedColor", color);
        }
        const query = current.toString();
        router.replace(`?${query}`, { scroll: false });
    };
    return (
        <>
            <div className="justify-start mx-auto">
                        <ToggleGroup size={"lg"} type="single" variant="outline" className="justify-start mx-auto my-5 gap-4">
                            {
                                color.map((color, index) => (
                                    <ToggleGroupItem key={index} value={color} onClick={() => handleColorChange(color)}>
                                        {color}
                                    </ToggleGroupItem>
                                ))
                            }
                        </ToggleGroup>
                    </div>
        </>
    )
}