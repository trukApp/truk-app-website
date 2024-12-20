"use client";

import { SessionProvider, useSession } from 'next-auth/react';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface Tokens {
    accessToken: string;
    refreshToken: string;
}
export const withAuthComponent = (WrappedComponent: React.FC,) => {
    const AuthWrapper: React.FC = (props) => {
        return (
            <SessionProvider>
                <AuthCheck {...props} />
            </SessionProvider>
        );
    };

    const AuthCheck: React.FC = (props) => {
        const { data: session, status } = useSession();
        const router = useRouter();
        console.log("server session :", session)
        localStorage.setItem("accessToken", session?.user?.accessToken);
        localStorage.setItem("refreshToken", session?.user?.refreshToken);

        useEffect(() => {
            if (status === 'unauthenticated') {
                router.push(`/login?callbackUrl=${encodeURIComponent(location.pathname)}`);
            }
        }, [status, router]);

        if (status === 'loading') {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            );
        }

        return session ? <WrappedComponent {...props} /> : null;
    };

    return AuthWrapper;
};
