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
import { People as PeopleIcon, ExitToApp as ExitToAppIcon, SportsMma as SportsMmaIcon } from '@mui/icons-material';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <img src="/wbbs-icon-192.png" alt="Logo WBBS" style={{ height: 80, marginRight: 16, borderRadius: 12, boxShadow: '0 4px 24px #d32f2f88', border: '3px solid #d32f2f', background: '#fff' }} />
        <SportsMmaIcon sx={{ fontSize: 80, color: '#d32f2f', filter: 'drop-shadow(0 2px 8px #000a)' }} />
      </Box>
      <Paper elevation={3} sx={{ p: 3, border: '4px solid #d32f2f', boxShadow: '0 8px 32px #d32f2f55', background: 'linear-gradient(135deg, #232323 0%, #444 100%)' }}>
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
              <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, filter: 'drop-shadow(0 2px 8px #d32f2f)' }} />
              <Typography variant="h6" gutterBottom>
                TESSERINI INDIVIDUALI
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
              <PeopleIcon sx={{ fontSize: 60, color: '#fff8e1', mb: 2, filter: 'drop-shadow(0 2px 8px #d32f2f)' }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 900, letterSpacing: 2 }}>
                Archivio Tesserini
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Dashboard; 