"use client";

import { useSession } from 'next-auth/react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';


export const withAuthComponent = (WrappedComponent: React.FC): React.FC => {
  const AuthWrapper: React.FC = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter(); 
    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push(`/login?callbackUrl=${encodeURIComponent(location.pathname)}`);
      }
    }, [status, router]);
        if (status === 'loading') {
      return ( 
                    <Backdrop
                        sx={{
                            color: "#ffffff",
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }} open={true}
                    >
          <CircularProgress color="inherit" />
           <Typography sx={{ ml: 2 }}>Checking session...</Typography>
                    </Backdrop>
      );
    }
    //  return session ? <WrappedComponent {...props} /> : null;
        if (status === 'authenticated' && session) {
            return <WrappedComponent {...props} />;
          }
    return null;
  };
  return AuthWrapper

};
