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
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            Dashboard
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
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
              }}
              onClick={() => navigate('/students')}
            >
              <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Gestione Studenti
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
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
                bgcolor: '#ff9800',
                color: '#fff8e1',
                border: '3px solid #795548',
                boxShadow: '0 8px 32px #79554855',
                fontFamily: 'Oswald, Impact, Arial, sans-serif',
              }}
              onClick={() => navigate('/student-archive')}
            >
              <PeopleIcon sx={{ fontSize: 60, color: '#fff8e1', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 900, letterSpacing: 2 }}>
                Archivio Studenti (anni '70)
              </Typography>
              <Typography variant="body2" align="center" sx={{ color: '#fff8e1' }}>
                Visualizza tutti gli studenti in stile vintage!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Dashboard; 