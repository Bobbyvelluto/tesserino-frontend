import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, CircularProgress } from '@mui/material';
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

  useEffect(() => {
    axios.get('https://tesserino-virtuale1.onrender.com/api/students', {
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
      bgcolor: seventiesColors[3],
      p: 4,
    }}>
      <Typography variant="h3" align="center" sx={{
        fontFamily: 'Impact, Oswald, Arial, sans-serif',
        color: seventiesColors[0],
        mb: 4,
        letterSpacing: 2,
        textShadow: '0 2px 8px #79554888',
      }}>
        Archivio Studenti
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {students.map((student, idx) => (
            <Grid item xs={12} sm={6} md={4} key={student._id}>
              <Box sx={{
                bgcolor: seventiesColors[idx % seventiesColors.length],
                borderRadius: 6,
                boxShadow: '0 8px 32px #79554855',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '4px solid #fff8e1',
                minHeight: 220,
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.04) rotate(-2deg)',
                  boxShadow: '0 16px 48px #d8431555',
                },
              }}>
                <PersonIcon sx={{ fontSize: 48, color: '#fff8e1', mb: 1, textShadow: '0 2px 8px #d8431588' }} />
                <Typography variant="h5" sx={{
                  fontFamily: 'Oswald, Impact, Arial, sans-serif',
                  fontWeight: 900,
                  color: '#fff8e1',
                  textShadow: '0 2px 8px #222b',
                  mb: 1,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}>
                  {student.name}
                </Typography>
                <Typography variant="body1" sx={{ color: seventiesColors[3], mb: 1, fontWeight: 700, fontFamily: 'monospace' }}>
                  {student.telefono}
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff8e1', mb: 2, fontWeight: 700 }}>
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
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default StudentArchive; 