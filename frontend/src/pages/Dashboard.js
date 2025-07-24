// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Tab, Tabs, Box, Card, CardContent, CircularProgress } from '@mui/material';
import api from '../api/axios';
import dayjs from 'dayjs';

export default function Dashboard() {
  const [tab, setTab] = useState('received');
  const [kudos, setKudos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await api.get(`kudos/?type=${tab}`);
    setKudos(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [tab]);

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h5">My Kudos</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Received" value="received" />
          <Tab label="Sent"     value="sent" />
        </Tabs>

        {loading
          ? <Box textAlign="center" mt={4}><CircularProgress/></Box>
          : kudos.map(k => (
              <Card key={k.id} sx={{ mt: 2 }}>
                <CardContent>
                  <Typography>
                    <b>{tab==='received' ? 'From' : 'To'}:</b> {tab==='received' ? k.sender.username : k.receiver.username}
                  </Typography>
                  <Typography>{k.message}</Typography>
                  <Typography variant="caption">{dayjs(k.created_at).format('MMM D, YYYY h:mm A')}</Typography>
                </CardContent>
              </Card>
            ))
        }
      </Box>
    </Container>
  );
}
