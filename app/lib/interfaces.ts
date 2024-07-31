export type Cart = {
    userId: string;
    items: Array<{
        id: string;
        name: string;
        price: number;
        offerPrice: number;
        selectedSize: string;
        selectedColor: string;
        quantity: number;
        imageString: string;
    }>;
};