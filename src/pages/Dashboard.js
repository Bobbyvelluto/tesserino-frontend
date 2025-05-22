import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { People as PeopleIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{
        p: 3,
        border: '4px solid #b5d8fa',
        boxShadow: '0 8px 32px #b5d8fa55',
        background: 'linear-gradient(135deg, #23272f 0%, #444950 100%)',
        borderRadius: 6
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
            sx={{ borderColor: '#a3b18a', color: '#588157', fontWeight: 600, ':hover': { borderColor: '#588157', background: '#e9f5db' } }}
          >
            Logout
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #d0f5df 0%, #a3e4b7 100%)',
                borderRadius: 4,
                boxShadow: '0 4px 16px #a3e4b744',
                border: '2px solid #a3e4b7',
                transition: 'transform 0.1s',
                ':hover': { transform: 'scale(1.03)', boxShadow: '0 8px 32px #a3e4b788' }
              }}
              onClick={() => navigate('/students')}
            >
              <PeopleIcon sx={{ fontSize: 60, color: '#588157', mb: 2, filter: 'drop-shadow(0 2px 8px #b5d8fa)' }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#588157', fontWeight: 700 }}>
                TESSERINI INDIVIDUALI
              </Typography>
              <Typography variant="body2" color="#588157" align="center">
                Visualizza e gestisci gli studenti e i loro tesserini
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #ffe29a 0%, #ffb347 100%)',
                borderRadius: 4,
                boxShadow: '0 4px 16px #ffb34744',
                border: '2px solid #ffb347',
                transition: 'transform 0.1s',
                ':hover': { transform: 'scale(1.03)', boxShadow: '0 8px 32px #ffb34788' }
              }}
              onClick={() => navigate('/student-archive')}
            >
              <PeopleIcon sx={{ fontSize: 60, color: '#b48a00', mb: 2, filter: 'drop-shadow(0 2px 8px #ffe29a)' }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#b48a00', fontWeight: 700, letterSpacing: 2 }}>
                ARCHIVIO TESSERINI
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Dashboard; 