/* eslint-disable @typescript-eslint/no-explicit-any */
export const calculateKPIs = (orders: any[] = []) => {
    const totalOrders = orders.length;

    const statusCount: Record<string, number> = {};
    orders.forEach(o => {
        statusCount[o.order_status] =
            (statusCount[o.order_status] || 0) + 1;
    });

    const completedOrders = orders.filter(
        o => o.order_status === "finished"
    ).length;

    const inProgressOrders = totalOrders - completedOrders;

    const totalDistance = orders.reduce(
        (sum, o) => sum + Number(o.total_distance || 0),
        0
    );

    const avgDistancePerTrip =
        totalOrders > 0 ? totalDistance / totalOrders : 0;

    const vehiclesUsed = new Set(
        orders.flatMap(o => o.allocated_vehicles || [])
    );

    const carrierOrders = orders.filter(o =>
        o.allocated_vehicles?.some((v: string) => v.startsWith("RES"))
    ).length;

    const ownFleetOrders = orders.filter(o =>
        o.allocated_vehicles?.some((v: string) => v.startsWith("VEH"))
    ).length;

    return {
        totalOrders,
        statusCount,
        completedOrders,
        inProgressOrders,
        totalDistance,
        avgDistancePerTrip,
        vehiclesUsed: vehiclesUsed.size,
        carrierOrders,
        ownFleetOrders,
    };
};
