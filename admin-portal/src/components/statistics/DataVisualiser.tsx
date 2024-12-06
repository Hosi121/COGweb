'use client';

import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { BarChart as BarChartIcon } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const MOCK_DATA = [
    { month: '4月', value: 2400, category: '申請件数' },
    { month: '5月', value: 1398, category: '申請件数' },
    { month: '6月', value: 9800, category: '申請件数' },
    { month: '7月', value: 3908, category: '申請件数' },
    { month: '8月', value: 4800, category: '申請件数' },
    { month: '9月', value: 3800, category: '申請件数' },
];

export const DataVisualizer: FC = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-orange-700">
                <BarChartIcon className="h-5 w-5" />
                統計情報
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_DATA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#f97316" name="件数" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
);