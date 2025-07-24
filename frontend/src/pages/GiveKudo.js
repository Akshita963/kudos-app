// src/pages/GiveKudo.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Box, Alert, CircularProgress } from '@mui/material';
import api from '../api/axios';

export default function GiveKudo() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ receiver: '', message: '' });
  const [status, setStatus] = useState({ success: '', error: '' });
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // fetch same‑org users
  useEffect(() => {
    api.get('users/').then(r => {
      setUsers(r.data.filter(u => u.id !== parseInt(localStorage.getItem('user_id'))));
      setLoadingUsers(false);
    });
  }, []);

  const send = async () => {
    setSubmitting(true);
    setStatus({ success: '', error: '' });
    try {
      await api.post('kudos/', form);
      setStatus({ success: 'Kudo sent!', error: '' });
      setForm({ receiver: '', message: '' });
    } catch (e) {
      console.log(e.response)
      setStatus({ success: '', error: e.response?.data?.detail || 'Cannot send kudos as your limit is reached or you are sending kudos to yourself.' });
    }
    setSubmitting(false);
  };

  if (loadingUsers) {
    return <Box textAlign="center" mt={4}><CircularProgress/></Box>;
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5">Give Kudos</Typography>

        {status.success && <Alert severity="success" sx={{ mb:2 }}>{status.success}</Alert>}
        {status.error   && <Alert severity="error"   sx={{ mb:2 }}>{status.error}</Alert>}

        <TextField
          select
          label="Recipient"
          fullWidth
          margin="normal"
          required
          value={form.receiver}
          onChange={e => setForm(f => ({ ...f, receiver: e.target.value }))}
        >
          {users.map(u => (
            <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Message"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          required
          inputProps={{ maxLength: 500 }}
          helperText={`${form.message.length}/500`}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        />

        <Button
          variant="contained"
          onClick={send}
          disabled={!form.receiver || !form.message || submitting}
          sx={{ mt: 2 }}
        >
          {submitting ? <CircularProgress size={24}/> : 'Send'}
        </Button>
      </Box>
    </Container>
  );
}
