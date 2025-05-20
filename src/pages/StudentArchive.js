import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, CircularProgress, Container, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const seventiesColors = [
  '#ff9800', // arancione
  '#ffb300', // giallo caldo
  '#795548', // marrone
  '#fff8e1', // crema
  '#d84315', // rosso mattone
];

function StudentArchive() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/api/students`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setStudents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const getLessons = (student) =>
    student && student.tesserini && Array.isArray(student.tesserini) && student.tesserini.length > 0 && Array.isArray(student.tesserini[student.tesserini.length - 1].lessons)
      ? student.tesserini[student.tesserini.length - 1].lessons
      : [];

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#232323',
      p: 4,
    }}>
      {/* Titolo rimosso per look palestra */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ 
            bgcolor: '#232323',
            borderRadius: 4,
            p: 4,
            boxShadow: '0 8px 32px #000a',
            border: '4px solid #d32f2f',
            background: 'linear-gradient(135deg, #232323 0%, #444 100%)'
          }}>
            <Grid container spacing={3}>
              {students.map((student, idx) => (
                <Grid item xs={12} sm={6} md={4} key={student._id}>
                  <Paper
                    elevation={3}
                    sx={{
                      bgcolor: '#111',
                      borderRadius: 8,
                      boxShadow: '0 4px 24px #000a',
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: '4px solid #d32f2f',
                      minHeight: 220,
                      position: 'relative',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.04)',
                        boxShadow: '0 16px 48px #d32f2f88',
                      },
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 48, color: '#fff', mb: 1, textShadow: '0 2px 8px #d32f2f88' }} />
                    <Typography variant="h5" sx={{
                      fontFamily: 'Oswald, Impact, Arial Black, sans-serif',
                      fontWeight: 900,
                      color: '#fff',
                      textShadow: '0 2px 8px #d32f2f',
                      mb: 1,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      fontSize: 28,
                      borderBottom: '2px solid #d32f2f',
                      pb: 1,
                      width: '100%',
                      textAlign: 'center',
                    }}>
                      {student.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff', mb: 1, fontWeight: 700, fontFamily: 'monospace', fontSize: 18 }}>
                      {student.telefono}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#d32f2f', mb: 2, fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>
                      Lezioni effettuate: {getLessons(student).filter(l => l.isUsed).length} / {getLessons(student).length}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: seventiesColors[2],
                        color: '#fff8e1',
                        fontWeight: 900,
                        borderRadius: 3,
                        boxShadow: '0 2px 8px #2228',
                        letterSpacing: 2,
                        fontFamily: 'Oswald, Impact, Arial, sans-serif',
                        mt: 1,
                        '&:hover': {
                          bgcolor: seventiesColors[4],
                          color: seventiesColors[1],
                        },
                      }}
                      onClick={() => navigate(`/student/${student._id}`)}
                    >
                      VEDI DETTAGLI
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      )}
    </Box>
  );
}

export default StudentArchive; 