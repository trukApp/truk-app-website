'use client';
import React from 'react';
import { Box, Typography, Card, CardMedia } from '@mui/material';
import { useRouter } from 'next/navigation';

const TransportPlanning = () => {
  const router = useRouter();

  const tiles = [
    {
      title: 'Transport order planning',
      image: 'https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png',
      onClick: () => {
        console.log('Navigating to Transport Order Planning');
        router.push('/createorder');
      },
    },
    {
      title: 'Spot auction',
      image: 'https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png',
      onClick: () => {
        console.log('Navigating to Spot Auction');
        router.push('/spotauction');
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{mt:4,marginBottom:'1px',color: 'primary.main', fontWeight: 'bold' }}>
        Transport Planning
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
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: '#e3efff',
              boxShadow: 3,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
                backgroundColor: '#c7ddfb',
              },
            }}
          >
            <CardMedia
              component="img"
              src={tile.image}
              alt={tile.title}
              sx={{
                width: { xs: 60, sm: 80, md: 100 },
                height: { xs: 60, sm: 80, md: 100 },
                objectFit: 'contain',
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '14px', sm: '16px', md: '18px' },
                fontWeight: 'bold',
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

export default TransportPlanning;
