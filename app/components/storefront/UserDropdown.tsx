import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "@/node_modules/next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { User, House, LayoutDashboard, ListOrdered, LogOut } from 'lucide-react';

interface iAppProps {
    email: string;
    name: string;
    userImage: string;
}

export function UserDropdown({ email, name, userImage }: iAppProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userImage} alt="User Image" />
                        <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="grid grid-flow-col justify-between">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                    <User className="w-5 text-gray-800" />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button variant="ghost" className="w-full">
                        <Link href="/" className="text-left w-full grid grid-flow-col justify-between">Home <House className="w-5 text-gray-800" /></Link>
                    </Button>
                </DropdownMenuItem>
                {
                    email !== "ds6483202@gmail.com" ? (
                        <></>
                    ) : (
                        <DropdownMenuItem asChild>
                            <Button variant="ghost" className="w-full">
                                <Link href="/dashboard" className="text-left w-full grid grid-flow-col justify-between">Dashboard <LayoutDashboard className="w-5 text-gray-800" /></Link>
                            </Button>
                        </DropdownMenuItem>
                    )
                }
                <DropdownMenuItem asChild>
                    <Button variant="ghost" className="w-full">
                        <Link href="/myOrder" className="text-left w-full grid grid-flow-col justify-between">My Order <ListOrdered className="w-5 text-gray-800" /></Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant="ghost" className="w-full">
                        <Link href="/myAccount" className="text-left w-full grid grid-flow-col justify-between">My Account <User className="w-5 text-gray-800" /></Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <LogoutLink className="cursor-pointer font-medium px-4 grid grid-flow-col justify-between">Log out <LogOut className="w-5 text-gray-800" /></LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
