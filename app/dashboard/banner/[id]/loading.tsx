import { Skeleton } from "@/components/ui/skeleton";

export default function DeleteBannerLoadingRoute() {
    return(
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Skeleton className="max-w-xl"/>
        </div>
    )
}