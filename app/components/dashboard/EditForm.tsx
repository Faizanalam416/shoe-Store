"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, XIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { SubmitButton } from "../SubmitButtons";
import { categories } from "@/app/lib/categories";
import { useState } from "react";
import { useFormState } from 'react-dom';
import { editProduct } from "@/app/actions";
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { productSchema } from "@/app/lib/zodSchemas";
import { type $Enums } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { productCategory } from "@/app/lib/productCategory";
import { subCategories } from "@/app/lib/subCategories";

interface iAppProps {
    data: {
        id: string;
        name: string;
        description: string;
        size: string;
        color: string;
        status: $Enums.ProductStatus;
        price: number;
        offerPrice: number;
        images: string[];
        category: $Enums.Category;
        subCategory: $Enums.SubCategory;
        productCategories: $Enums.ProductCategories;
        isFeatured: boolean;
    }
}

export function EditForm({ data }: iAppProps) {
    const [images, setImages] = useState<string[]>(data.images);
    const [lastResult, action] = useFormState(editProduct, undefined);
    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, { schema: productSchema });
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    const handleDelete = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <input type="hidden" name="productId" value={data.id}/>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/products">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold tracking-tight">Edit Product</h1>
            </div>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                        In this form you can update your product
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <Label>Name</Label>
                            <Input
                                type="text"
                                key={fields.name.key}
                                name={fields.name.name}
                                defaultValue={data.name}
                                className="w-full"
                                placeholder="Product Name"
                            />
                            <p className="text-red-500">{fields.name.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Description</Label>
                            <Textarea
                                key={fields.description.key}
                                name={fields.description.name}
                                defaultValue={data.description}
                                placeholder="Write your description right here..."
                            />
                            <p className="text-red-500">{fields.description.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row justify-between gap-3">
                                <div className="w-full">
                                    <Label>Price</Label>
                                    <Input
                                        key={fields.price.key}
                                        name={fields.price.name}
                                        defaultValue={data.price}
                                        type="number"
                                        placeholder="&#x20b9; 55"
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    />
                                    <p className="text-red-500">{fields.price.errors}</p>
                                </div>
                                <div className="w-full">
                                    <Label>Offer Price</Label>
                                    <Input
                                        key={fields.offerPrice?.key}
                                        name={fields.offerPrice?.name}
                                        defaultValue={data.offerPrice}
                                        type="number"
                                        placeholder="&#x20b9; 55"
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    />
                                    <p className="text-red-500">{fields.offerPrice?.errors}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Size</Label>
                            <Input
                                type="text"
                                key={fields.size.key}
                                name={fields.size.name}
                                defaultValue={data.size}
                                className="w-full"
                                placeholder="5, 6, 7, 8, ..."
                            />
                            <p className="text-red-500">{fields.size.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Color</Label>
                            <Input
                                type="text"
                                key={fields.color.key}
                                name={fields.color.name}
                                defaultValue={data.color}
                                className="w-full"
                                placeholder="Black, White, Gray, ..."
                            />
                            <p className="text-red-500">{fields.color.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Featured Product</Label>
                            <Switch
                                key={fields.isFeatured.key}
                                name={fields.isFeatured.name}
                                defaultChecked={data.isFeatured}
                            />
                            <p className="text-red-500">{fields.isFeatured.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Status</Label>
                            <Select
                                key={fields.status.key}
                                name={fields.status.name}
                                defaultValue={data.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-red-500">{fields.status.errors}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label>Category</Label>
                            <Select
                                key={fields.category.key}
                                name={fields.category.name}
                                defaultValue={data.category}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.name}
                                            >
                                                {category.title}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <p className="text-red-500">{fields.category.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Sub-Category</Label>
                            <Select
                                key={fields.subCategory.key}
                                name={fields.subCategory.name}
                                defaultValue={data.subCategory}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Sub-Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        subCategories.map((subCategory) => (
                                            <SelectItem
                                                key={subCategory.id}
                                                value={subCategory.name}
                                            >
                                                {subCategory.title}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <p className="text-red-500">{fields.category.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Product Category</Label>
                            <Select
                                key={fields.productCategories.key}
                                name={fields.productCategories.name}
                                defaultValue={data.productCategories}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Product Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-72 w-full rounded-md border">
                                        {
                                            productCategory.map((proCategory) => (
                                                <SelectItem
                                                    key={proCategory.id}
                                                    value={proCategory.name}
                                                >
                                                    {proCategory.title}
                                                </SelectItem>
                                            ))
                                        }
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                            <p className="text-red-500">{fields.category.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Images</Label>
                            <input
                                type="hidden"
                                value={images}
                                key={fields.images.key}
                                name={fields.images.name}
                                defaultValue={fields.images.initialValue as any}
                            />
                            {
                                images.length > 0 ? (
                                    <div className="flex gap-5">
                                        {
                                            images.map((image, index) => (
                                                <div key={index} className="relative w-[100px] h-[100px]">
                                                    <Image
                                                        height={100}
                                                        width={100}
                                                        src={image}
                                                        alt="Product Image"
                                                        className="w-full h-full object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        onClick={() => handleDelete(index)}
                                                        type="button"
                                                        className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white"
                                                    >
                                                        <XIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <UploadDropzone
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            setImages(res.map((r) => r.url))
                                        }}
                                        onUploadError={(error: Error) => {
                                            // Do something with the error.
                                            alert(`ERROR! ${error.message}`);
                                        }}
                                    />
                                )
                            }
                            <p className="text-red-500">{fields.images.errors}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton text="Edit Product" />
                </CardFooter>
            </Card>
        </form>
    );
}
