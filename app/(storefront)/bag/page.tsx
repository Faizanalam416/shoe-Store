import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redis } from '@/app/lib/redis';
import { Cart } from '@/app/lib/interfaces';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { checkOut, delItem } from "@/app/actions"
// import { CheckoutButton, DeleteItem } from '@/app/components/SubmitButtons';
// import { ShoppingBag } from 'lucide-react';
// import Link from 'next/link';
import { BagContent } from '@/app/components/storefront/BagContent';
import prisma from '@/app/lib/db';

export default async function BagRoute() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    const cart: Cart | null = await redis.get(`cart-${user.id}`);

    let totalPrice = 0;

    cart?.items.forEach((item) => {
        const  itemPrice = item.offerPrice !== 0 ? item.offerPrice : item.price;
        totalPrice += itemPrice * item.quantity;
    });

    const userDetail = await prisma.userDetail.findUnique({
        where: {
            userId: user.id,
        },
    });
    

    return (
        // <div className='max-w-2xl mx-auto mt-10 min-h-[60vh]'>
        //     {
        //         (cart?.items.length === 0) || (!cart || !cart.items) ? (
        //             <div className='flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20'>
        //                 <div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
        //                     <ShoppingBag className="w-10 h-10 text-primary" />
        //                 </div>
        //                 <h2 className='mt-6 text-xl font-semibold'>You do not have any products in your Bag</h2>
        //                 <p className='mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto'>
        //                     You currently do not have any products in your shopping bag. Please add some so that you can see them right here.
        //                 </p>
        //                 <Button asChild>
        //                     <Link href="/">Shop Now!</Link>
        //                 </Button>
        //             </div>
        //         ) : (
        //             <div className='flex flex-col gap-y-10'>
        //                 {
        //                     cart?.items.map((item) => (
        //                         <div key={item.id} className="flex">
        //                             <div className='w-24 h-24 sm:w-32 sm:h-32 relative'>
        //                                 <Image
        //                                     fill
        //                                     src={item.imageString}
        //                                     alt="Product image"
        //                                     className="rounded-md object-cover"
        //                                     sizes="100vh"
        //                                 />
        //                             </div>
        //                             <div className='ml-5 flex justify-between w-full font-medium'>
        //                                 <div>
        //                                     <p>{item.name}</p>
        //                                     <h3>Size: <span>{item.selectedSize}</span></h3>
        //                                     <h3>Color: <span>{item.selectedColor}</span></h3>
        //                                 </div>
        //                                 <div className='flex flex-col h-full justify-between'>
        //                                     <div className='flex items-center gap-x-2'>
        //                                         <p>{item.quantity} x</p>
        //                                         <p>&#x20b9; {item.price}</p>
        //                                     </div>
        //                                     <form action={delItem} className="text-end">
        //                                         <input type="hidden" name="productId" value={item.id} />
        //                                         <DeleteItem />
        //                                     </form>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     ))
        //                 }
        //                 <div className='mt-10'>
        //                     <div className='flex items-center justify-between font-medium'>
        //                         <p>Subtotal</p>
        //                         <p>&#x20b9; {new Intl.NumberFormat("en-IN").format(totalPrice)}</p>
        //                     </div>

        //                     <form action={checkOut}>
        //                         <CheckoutButton />
        //                     </form>
        //                 </div>
        //             </div>
        //         )
        //     }
        // </div>
        <BagContent cart={cart} totalPrice={totalPrice} userDetail={userDetail}/>
    );
}
