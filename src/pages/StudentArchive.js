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

  // Ordina gli studenti in ordine alfabetico per nome
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{
        p: 3,
        border: '4px solid #b5d8fa',
        boxShadow: '0 8px 32px #b5d8fa55',
        background: 'linear-gradient(135deg, #23272f 0%, #444950 100%)',
        borderRadius: 6,
        color: 'inherit',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ borderColor: '#b48a00', color: '#b48a00', fontWeight: 600, ':hover': { borderColor: '#b48a00', background: '#fff8e1' } }}
          >
            Torna alla Dashboard
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #ffe29a 0%, #ffb347 100%)',
                borderRadius: 4,
                boxShadow: '0 4px 16px #ffb34744',
                border: '2px solid #ffb347',
                mb: 3,
              }}
            >
              <Typography variant="h4" sx={{ color: '#b48a00', fontWeight: 700, mb: 2, letterSpacing: 2 }}>
                ARCHIVIO TESSERINI
              </Typography>
              <Typography variant="body1" sx={{ color: '#b48a00', mb: 2 }}>
                Elenco di tutti i tesserini degli studenti
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
              {sortedStudents.map((student, idx) => (
                <Paper
                  key={student._id}
                  elevation={2}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    borderRadius: 4,
                    boxShadow: '0 2px 8px #ffb34744',
                    background: 'linear-gradient(135deg, #ffe29a 0%, #ffb347 100%)',
                    border: '2px solid #ffb347',
                    transition: 'box-shadow 0.2s',
                    color: '#b48a00',
                    '&:hover': { boxShadow: '0 4px 16px #ffb34788' },
                  }}
                >
                  <PersonIcon sx={{ fontSize: 36, color: '#b48a00', mr: 2, textShadow: '0 2px 8px #fff8' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: 'Personal Services, Arial, sans-serif', fontWeight: 900, fontSize: 20, color: '#b48a00', mb: 0.5, textShadow: '1px 1px 6px #ffb347', textTransform: 'uppercase' }}>
                      {student.name}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: '#b48a00' }}>{student.telefono}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 2, fontWeight: 700, fontFamily: 'Personal Services, Arial, sans-serif', bgcolor: '#b48a00', color: '#fff', ':hover': { bgcolor: '#a37c00' } }}
                    onClick={() => navigate(`/student/${student._id}`)}
                  >
                    Vedi
                  </Button>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default StudentArchive; 