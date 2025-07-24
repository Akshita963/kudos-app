// src/pages/Login.js
import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login({ setToken }) {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("token/", creds);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setToken(data.access);
      navigate("/", { replace: true });
    } catch (e) {
      return setError("Invalid username or password");
    }

    navigate("/");
  };

  return (
    <Container maxWidth="xs">
      <Box mt={12}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            required
            margin="normal"
            value={creds.username}
            onChange={(e) =>
              setCreds((c) => ({ ...c, username: e.target.value }))
            }
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={creds.password}
            onChange={(e) =>
              setCreds((c) => ({ ...c, password: e.target.value }))
            }
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
