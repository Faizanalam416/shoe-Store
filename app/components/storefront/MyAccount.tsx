"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Check, ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormState } from 'react-dom';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { updateUserDetails } from "@/app/actions";
import { addressSchema } from "@/app/lib/zodSchemas";
import { SubmitButton } from "../SubmitButtons";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { states } from "@/app/lib/states";
import { countries } from "@/app/lib/countries";



// interface UserDetail {
//     id: string;
//     phoneNumber: string;
//     street: string;
//     landmark: string | null;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
// }

interface iAppProps {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profileImage: string;
        // userDetail: UserDetail | null;
        UserDetails: {
            id: string;
            phoneNumber: string;
            street: string;
            landmark: string | null;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        } | null
    };
}

const toPascalCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export function MyAccount({ user }: iAppProps) {
    const userDetails = user.UserDetails ?? {
        id: '',
        phoneNumber: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    };

    const [openState, setOpenState] = React.useState(false);
    const [valueState, setValueState] = React.useState(userDetails.state || "");

    const [openCountry, setOpenCountry] = React.useState(false);
    const [valueCountry, setValueCountry] = React.useState(userDetails.country || "");

    const [lastResult, action] = useFormState(updateUserDetails, undefined);
    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, { schema: addressSchema });
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });


    return (<>
        <div className="max-w-5xl mx-auto mt-10 min-h-[60vh]">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/bag">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
            <form id={form.id} onSubmit={form.onSubmit} action={action}>
                <input type="hidden" name="userId" value={user.id} />
                <Card className="my-5">
                    <CardHeader className="grid gap-y-3">
                        <CardTitle className="tracking-tight">My Account Details: </CardTitle>
                        <CardDescription className="tracking-tight grid">You can view and update your details, <span>Please fill in all the details correctly so that your order can reach you.</span></CardDescription>
                        <Separator />
                    </CardHeader>
                    <CardContent>
                        <div className="text-center grid grid-flow-row place-items-center gap-1">
                            <h1 className="text-lg font-medium tracking-tight mb-3">My Account</h1>
                            <Label className="text-muted-foreground">Profile</Label>
                            <img
                                className="rounded-full w-20"
                                src={user.profileImage}
                                alt="Profile"
                            />
                            <h3 className="font-medium tracking-tight">{toPascalCase(user.firstName)} {toPascalCase(user.lastName)}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Separator className="my-5" />
                        <div className="grid gap-4">
                            <h1 className="text-lg font-medium tracking-tight mb-3">My Details:</h1>
                            <div className="grid grid-flow-row gap-3">
                                <Label>Mobile Number</Label>
                                <Input
                                    type="number"
                                    key={fields.phoneNumber?.key}
                                    name={fields.phoneNumber?.name}
                                    defaultValue={userDetails.phoneNumber}
                                    className="w-full"
                                    placeholder="+91 1234567890"
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                />
                                <p className="text-red-500">{fields.phoneNumber?.errors}</p>
                            </div>
                            <div className="grid grid-flow-row gap-3">
                                <Label>Street</Label>
                                <Input
                                    type="text"
                                    key={fields.street?.key}
                                    name={fields.street?.name}
                                    defaultValue={userDetails.street}
                                    className="w-full"
                                    placeholder="Enter Street"
                                />
                                <p className="text-red-500">{fields.street?.errors}</p>
                            </div>
                            <div className="grid grid-flow-row gap-3">
                                <Label>Landmark</Label>
                                <Input
                                    type="text"
                                    key={fields.landmark?.key}
                                    name={fields.landmark?.name}
                                    defaultValue={userDetails.landmark || ""}
                                    className="w-full"
                                    placeholder="Enter Landmark"
                                />
                                <p className="text-red-500">{fields.landmark?.errors}</p>
                            </div>
                            <div className="grid grid-flow-row gap-3">
                                <Label>City</Label>
                                <Input
                                    type="text"
                                    key={fields.city?.key}
                                    name={fields.city?.name}
                                    defaultValue={userDetails.city}
                                    className="w-full"
                                    placeholder="Enter City"
                                />
                                <p className="text-red-500">{fields.city?.errors}</p>
                            </div>
                            <div className="grid grid-flow-row gap-3">
                                <Label>State</Label>
                                {/* <Input
                                    type="text"
                                    key={fields.state?.key}
                                    name={fields.state?.name}
                                    defaultValue={userDetails.state}
                                    className="w-full"
                                    placeholder="Enter State"
                                /> */}
                                <Popover open={openState} onOpenChange={setOpenState}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openState}
                                            className="w-full justify-between"
                                        >
                                            {valueState
                                                ? states.find((state) => state.value === valueState)?.label
                                                : "Select state..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command className="w-full">
                                            <CommandInput placeholder="Search state..." />
                                            <CommandEmpty>No state found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandList className="w-full">
                                                    {states.map((state) => (
                                                        <CommandItem
                                                            key={state.value}
                                                            value={state.value}
                                                            onSelect={(currentValue) => {
                                                                setValueState(currentValue === valueState ? "" : currentValue);
                                                                setOpenState(false);
                                                            }}
                                                            className="w-full"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    valueState === state.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {state.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandList>
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <input
                                    type="hidden"
                                    key={fields.state?.key}
                                    name={fields.state?.name}
                                    value={valueState}
                                />
                                <p className="text-red-500">{fields.state?.errors}</p>
                            </div>
                            <div className="grid grid-flow-row gap-3">
                                <Label>Country</Label>
                                {/* <Input
                                    type="text"
                                    key={fields.country?.key}
                                    name={fields.country?.name}
                                    defaultValue={userDetails.country}
                                    className="w-full"
                                    placeholder="Enter Country"
                                /> */}
                                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCountry}
                                            className="w-full justify-between"
                                        >
                                            {valueCountry
                                                ? countries.find((country) => country.value === valueCountry)?.label
                                                : "Select Country..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command className="w-full">
                                            <CommandInput placeholder="Search country..." />
                                            <CommandEmpty>No country found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandList className="w-full">
                                                    {countries.map((country) => (
                                                        <CommandItem
                                                            key={country.value}
                                                            value={country.value}
                                                            onSelect={(currentValue) => {
                                                                setValueCountry(currentValue === valueCountry ? "" : currentValue);
                                                                setOpenCountry(false);
                                                            }}
                                                            className="w-full"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    valueCountry === country.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {country.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandList>
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <input
                                    type="hidden"
                                    key={fields.country?.key}
                                    name={fields.country?.name}
                                    value={valueCountry}
                                />
                                <p className="text-red-500">{fields.country?.errors}</p>
                            </div>
                            <div className="grid grid-flow-row gap-3">
                                <Label>Zip Code</Label>
                                <Input
                                    type="number"
                                    key={fields.zipCode?.key}
                                    name={fields.zipCode?.name}
                                    defaultValue={userDetails.zipCode}
                                    className="w-full"
                                    placeholder="Enter Zip Code"
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                />
                                <p className="text-red-500">{fields.zipCode?.errors}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton text="Save Details" />
                    </CardFooter>
                </Card>
            </form>
        </div>
    </>
    )
}