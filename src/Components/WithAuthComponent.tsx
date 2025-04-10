"use client";

import { SessionProvider, useSession } from 'next-auth/react';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';


export const withAuthComponent = (WrappedComponent: React.FC): React.FC => {
  const AuthWrapper: React.FC = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    console.log("session from withAUth:", session)
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
  return AuthWrapper

};
