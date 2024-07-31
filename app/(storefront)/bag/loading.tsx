import { Skeleton } from "@/components/ui/skeleton";

export default function BagLoadingRoute() {
    return (
        <div className='flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full'>
                <Skeleton className="w-10 h-10"/>
            </div>
            <Skeleton className="mt-6 w-20 h-12"/>
            <Skeleton className="mb-8 mt-2 max-w-sm mx-auto"/>
            <Skeleton className="w-10 h-12"/>
        </div>
    )
}
