"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function CommandSearch() {
    const router = useRouter();
    const [text, setText] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            if(text) {
                router.push(`?search=${encodeURIComponent(text)}`); 
            } else {
                router.push('?');
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [text, router]);

    return (
        <div className='relative rounded-md shadow-sm'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                />
            </div>
            <Input
                value={text}
                placeholder='Search Order...'
                onChange={e => setText(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
            />
        </div>
    );
}
