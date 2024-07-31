"use client";

import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from "recharts";

interface iAppProps {
    data: {
        date: string;
        revenue: number;
    }[];
}

const aggregateData = (data: any) => {
    const aggregated = data.reduce((acc: any, curr: any) => {
        if(acc[curr.data]) {
            acc[curr.data] += curr.revenue;
        } else {
            acc[curr.data] = curr.revenue;
        }
        return acc;
    }, {});

    return Object.keys(aggregated).map((data) => ({
        data,
        revenue: aggregated[data],
    }));
};

export function Chart({ data }: iAppProps) {
    const processedData = aggregateData(data);
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                    dataKey="revenue"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
