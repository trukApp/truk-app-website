'use client'
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
    CheckCircle, AddCircle
    // Cancel,
} from '@mui/icons-material';

interface ERPConnection {
  name: string;
  status: 'connected' | 'disconnected';
  lastSynced: string | null;
}

const demoERPConnections: ERPConnection[] = [
  {
    name: 'SAP',
    status: 'connected',
    lastSynced: '2025-04-20 14:22',
  },
  {
    name: 'Oracle NetSuite',
    status: 'disconnected',
    lastSynced: null,
  },
  {
    name: 'Zoho Inventory',
    status: 'connected',
    lastSynced: '2025-04-21 09:15',
  },
  {
    name: 'Microsoft Dynamics',
    status: 'disconnected',
    lastSynced: null,
  },
  {
    name: 'Tally ERP',
    status: 'disconnected',
    lastSynced: null,
  },
];

const SystemConections: React.FC = () => {
  const connected = demoERPConnections.filter((e) => e.status === 'connected');
  const disconnected = demoERPConnections.filter((e) => e.status === 'disconnected');

  return (
    <Box p={4}>

      {/* Connected Systems */}

        <Typography
          variant="h5"
          color="primary"
          fontWeight="bold" 
          gutterBottom
        >
         ERP Connections
        </Typography>

        {/* Page Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          mb={5}
        >
          Manage and monitor your ERP integrations. View connected systems and easily connect new ones to streamline your business operations.
      </Typography>
            <Typography variant="h6" gutterBottom>
        ✅ Connected Systems
      </Typography>
      <Grid container spacing={3}>
        {connected.map((erp, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={3}>
              <CardHeader
                title={erp.name}
                titleTypographyProps={{ sx: { fontSize: '16px', fontWeight: 500 } }}
                action={
                  <Chip
                    label="Connected"
                    color="success"
                    icon={<CheckCircle fontSize="small" />}
                    size="small"
                  />
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Last Synced: {erp.lastSynced}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Available to Connect */}
      <Typography variant="h6" gutterBottom>
        🔌 Available to Connect
      </Typography>
      <Grid container spacing={3}>
        {disconnected.map((erp, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={3}>
              <CardHeader
                title={erp.name}
                titleTypographyProps={{ sx: { fontSize: '16px', fontWeight: 500 } }}
                // action={
                //   <Chip
                //     label="Disconnected"
                //     color="error"
                //     icon={<Cancel fontSize="small" />}
                //     size="small"
                //   />
                // }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Not synced yet
                </Typography>
                <Stack mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle />}
                    fullWidth
                  >
                    Connect Now
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SystemConections;
