'use client';
import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { LocalShipping, Warehouse, Settings, Route } from '@mui/icons-material';
import { useRouter } from 'next/navigation';


const TransportExecution = () => {
  const router = useRouter();
  const tiles = [
    {
      title: 'Transport order overview',
      icon: <LocalShipping sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => {
        router.push('/order-overview');
      }
    },
    { title: 'Dock management', icon: <Warehouse sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} /> },
    { title: 'Operations', icon: <Settings sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} /> },
    { title: 'Tracking', icon: <Route sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} /> },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#83214F', fontWeight: 'bold' }}>
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
                backgroundColor: '#FAF1F8',
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
  );
};

export default TransportExecution;
