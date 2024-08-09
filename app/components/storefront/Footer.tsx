import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-16 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
                <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-x-28 justify-between text-left">
                    <div className="grid grid-flow-row gap-4 md:col-span-2">
                        <h1 className="text-black font-bold text-xl lg:text-3xl">
                            New Samaj <span className="text-primary">Footwear</span>
                        </h1>
                        <p className="tracking-tight text-gray-700 text-justify">Step into style with our premier footwear collection, offering the latest trends and unbeatable comfort. Shop now for a seamless and stylish shopping experience!</p>
                        <div className="grid gap-1">
                            <h2 className="font-semibold tracking-tight underline text-gray-600">Address:</h2>
                            <p>4FM9+G3R, Chandni Chowk</p>
                            <p>PHED Colony</p>
                            <p>Araria, Bihar</p>
                            <p>854311</p>
                        </div>
                        <Link href="/contact">
                            <Button className="w-40">Contact Us</Button>
                        </Link>
                    </div>
                    <div className="grid gap-4 items-center">
                        <ul className="max-w-md space-y-1 text-gray-500 list-none list-outside dark:text-gray-400">
                            <li><Link href="/termConditionPolicy" className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline">Terms & Conditions Policy</Link></li>
                            <li><Link href="/privacyPolicy" className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/disclaimer" className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline">Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>
                <Separator />
                <p className="text-xs leading-5 text-gray-700 mt-2">&copy; {new Date().getFullYear()} ShoeStore. All Rights Reserved.</p>
            </div>
        </footer>
    );
}