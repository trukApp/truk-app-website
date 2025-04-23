'use client';
import React, { useState } from 'react';
import { Box, Typography, Card, Backdrop, CircularProgress } from '@mui/material';
import { LocalShipping, Warehouse, Route } from '@mui/icons-material';
// import BuildIcon from '@mui/icons-material/Build';
import EngineeringIcon from '@mui/icons-material/Engineering';


import { useRouter } from 'next/navigation';


const TransportExecution = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const handleNavigation = (path: string) => {
    setLoading(true);
    router.push(path);
  };


  const tiles = [
    {
      title: 'Transport order overview',
      icon: <LocalShipping sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => handleNavigation('/order-overview'),
    },
    { title: 'Dock management', icon: <Warehouse sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} /> },
    { title: 'Operations', icon: <EngineeringIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} /> },
    {
      title: 'Tracking', icon: <Route sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => handleNavigation('/tracking'),
    },
    {
      title: 'Order bidding',
      icon: <LocalShipping sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => handleNavigation('/order-bidding'),
    },
    {
      title: 'Order requests',
      icon: <LocalShipping sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => handleNavigation('/order-requests'),
    },
  ];

  return (
    <>
      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box>
        <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#F08C24', fontWeight: 'bold' }}>
          Transport Execution
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(6, 1fr)',
              lg: 'repeat(8, 1fr)',
            },
          }}
        >
          {tiles.map((tile, index) => (
            <Card
              key={index}
              onClick={tile.onClick}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                boxShadow: 3,
                borderRadius: 5,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                  backgroundColor: '#FCF0DE',
                },
                cursor: 'pointer'
              }}
            >
              {tile.icon}
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '14px', sm: '16px', md: '18px' },
                  fontWeight: 'bold',
                  mt: 1,
                }}
              >
                {tile.title}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>
    </>

  );
};

export default TransportExecution;
