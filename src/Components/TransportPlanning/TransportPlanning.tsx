'use client';
import React, { useState } from 'react';
import { Box, Typography, Card, Backdrop, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GavelIcon from '@mui/icons-material/Gavel';
import { Inventory2 } from '@mui/icons-material';

const TransportPlanning = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path: string) => {
    setLoading(true);
    router.push(path);
  };

  const tiles = [
    {
      title: 'Transport Package Overview',
      icon: <Inventory2 sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
      // onClick: () => {
      //   router.push('/units-overview');
      // },
      onClick: () => handleNavigation('/units-overview'),
    },
    {
      title: 'Transport Order Planning',
      icon: <LocalShippingIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
      // onClick: () => {
      //   router.push('/createorder');
      // },
      onClick: () => handleNavigation('/createorder'),
    },

    {
      title: 'Spot Auction',
      icon: <GavelIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
      // onClick: () => {
      //   router.push('/spotauction');
      // },
      onClick: () => handleNavigation('/spotauction'),
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

export default TransportPlanning;
