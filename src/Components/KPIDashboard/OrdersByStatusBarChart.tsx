"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

interface Props {
    statusCount: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
    "assignment pending": "#FB8C00", // orange
    "self assigned": "#1E88E5",      // blue
    "finished": "#43A047",           // green
};

const OrdersByStatusBarChart: React.FC<Props> = ({ statusCount }) => {
    const data = Object.keys(statusCount).map(status => ({
        status,
        orders: statusCount[status],
        color: STATUS_COLORS[status] || "#8E24AA", // fallback purple
    }));

    return (
        <Card sx={{ height: 360 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Orders by Status
                </Typography>

                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />

                        <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default OrdersByStatusBarChart;
