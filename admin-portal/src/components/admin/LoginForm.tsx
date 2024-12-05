'use client';

import { FC, FormEvent, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const LoginForm: FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
    };

    return (
        <Card className="max-w-md mx-auto border-none shadow-xl bg-white/70 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
                    管理者ログイン
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">ユーザーID</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <button className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg transition-all">
                        ログイン
                    </button>
                </form>
            </CardContent>
        </Card>
    );
};