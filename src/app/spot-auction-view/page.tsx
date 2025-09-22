import { Suspense } from "react";
import OrderDetailedOverview from "./detailedOverview";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderDetailedOverview />
        </Suspense>
    );
}
