'use client';
import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { useRouter } from 'next/navigation';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import StorageIcon from '@mui/icons-material/Storage';

const TransportManagement = () => {
  const router = useRouter();

  const tiles = [
    {
      title: 'Transport unit creation',
      icon: <SettingsIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => router.push('/createpackage'),
    },
    {
      title: 'Product master',
      icon: <InventoryIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => router.push('/productmaster'),
    },
    {
      title: 'Business partners',
      icon: <BusinessIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => router.push('/businesspartners'),
    },
    {
      title: 'Master Data',
      icon: <StorageIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      onClick: () => router.push('/masterdata'),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#83214F', fontWeight: 'bold' }}>
        Transport Management
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
            onClick={tile.onClick}
            key={index}
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
            <Box sx={{ mb: 2, }}>{tile.icon}</Box>
            <Typography variant="h6" sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' }, fontWeight: 'bold' }}>
              {tile.title}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TransportManagement;
