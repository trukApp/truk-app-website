'use client';
import React, { useState } from 'react';
import { Box, Typography, Card, Backdrop, CircularProgress } from '@mui/material';
import { Settings, Build, Notifications, Link } from '@mui/icons-material';
import { useRouter } from 'next/navigation';


const SettingsComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path: string) => {
    setLoading(true);
    router.push(path);
  };
  const tiles = [
    { title: 'User Settings', icon: <Settings sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} /> },
    {
      title: 'Config Settings',
      icon: <Build sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} />,
      // onClick: () => router.push('/configsettings'),
      onClick: () => handleNavigation('/configsettings'),
    },
    { title: 'Notification Settings', icon: <Notifications sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} /> },
    { title: 'System Connections', icon: <Link sx={{ fontSize: { xs: 40, sm: 50, md: 60, lg: 70 } }} /> },
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
        <Typography variant="h6" sx={{ marginBottom: '1px', color: '#83214F', fontWeight: 'bold' }}>
          Settings
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
              onClick={tile.onClick}
            >
              <Box sx={{ mb: 2 }}>{tile.icon}</Box>
              <Typography variant="h6" sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' }, fontWeight: 'bold' }}>
                {tile.title}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default SettingsComponent;
