"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Textarea } from "@/components/ui/textarea";

export default function ContactRoute() {
    return (

        <div className="max-w-5xl mx-auto mt-10 min-h-[60vh]">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
            <form>
                <Card className="my-5">
                    <CardHeader className="grid gap-y-3">
                        <CardTitle className="tracking-tight">Contact Us</CardTitle>
                        <CardDescription className="tracking-tight grid gap-y-1 text-base">Have any questions or need assistance? We&apos;re here to help!<span>Our team is dedicated to providing you with the best support possible.</span></CardDescription>
                        <Separator />
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <h1 className="text-lg font-medium tracking-tight mb-3">Feel free to reach out to us directly here.</h1>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid grid-flow-row gap-3">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        className="w-full"
                                        placeholder="xyz@gmail.com"
                                    />
                                </div>
                                <div className="grid grid-flow-row gap-3">
                                    <Label>Mobile Number</Label>
                                    <Input
                                        type="number"
                                        className="w-full"
                                        placeholder="+91 1234567890"
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid grid-flow-row gap-3">
                                    <Label>First Name</Label>
                                    <Input
                                        type="text"
                                        className="w-full"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="grid grid-flow-row gap-3">
                                    <Label>Last Name</Label>
                                    <Input
                                        type="text"
                                        className="w-full"
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-flow-row gap-3">
                                <Label>Reason</Label>
                                <Input
                                    type="text"
                                    className="w-full"
                                    placeholder="Reason"
                                />
                            </div>
                            <div className="grid grid-flow-row gap-3">
                                <Label>Your Comment</Label>
                                <Textarea
                                    className="w-full"
                                    placeholder="Your Comment"
                                />
                            </div>
                            
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton text="Send Message" />
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}