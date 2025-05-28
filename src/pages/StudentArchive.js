import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Container, Paper, Snackbar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

function StudentArchive() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/api/students`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setStudents(res.data))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  // Ordina gli studenti in ordine alfabetico per nome
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#232323',
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Logo WBBS */}
      <img src="/logo192.png" alt="Logo WBBS" style={{ width: 120, marginBottom: 24, borderRadius: 16, boxShadow: '0 4px 24px #1976d2aa' }} />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <Container maxWidth="md" sx={{ mt: 4, height: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            bgcolor: '#232323',
            borderRadius: 4,
            p: 4,
            boxShadow: '0 8px 32px #000a',
            border: '4px solid #d32f2f',
            background: 'linear-gradient(135deg, #232323 0%, #444 100%)',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {sortedStudents.map((student, idx) => (
              <Paper
                key={student._id}
                elevation={4}
                sx={{
                  bgcolor: '#181818',
                  borderRadius: 6,
                  boxShadow: 'none',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid #a89c74',
                  minHeight: 64,
                  maxWidth: 600,
                  width: '100%',
                  mx: 'auto',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 'none',
                    borderColor: '#43a047',
                  },
                  flexDirection: 'column',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <PersonIcon sx={{ fontSize: 36, color: '#a89c74', mr: 2, textShadow: '0 2px 8px #fff8' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{
                      fontFamily: 'Personal Services, Arial, sans-serif',
                      fontWeight: 900,
                      color: '#d84315',
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      fontSize: 20,
                    }}>
                      {student.name}
                    </Typography>
                    <Typography sx={{ color: '#90A4AE', fontWeight: 700, fontFamily: 'Personal Services, monospace', fontSize: 15 }}>
                      <a href={`https://wa.me/${student.telefono.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#90A4AE', textDecoration: 'none' }}>
                        {student.telefono}
                      </a>
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#a89c74', color: '#fff', fontWeight: 900, borderRadius: 2, fontFamily: 'Personal Services, Arial, sans-serif', px: 3, boxShadow: '0 2px 8px #a89c7444', letterSpacing: 2, transition: 'background 0.2s', '&:hover': { bgcolor: '#43a047', color: '#fff' } }}
                    onClick={() => navigate(`/student/${student._id}`)}
                  >
                    VEDI
                  </Button>
                </Box>
                {/* Visualizzazione tesserini e moduli con annulla */}
                {student.tesserini && student.tesserini.length > 0 && (
                  <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {student.tesserini.map((tess, tessIdx) => (
                      <Box key={tessIdx} sx={{ mb: 1 }}>
                        <Typography sx={{ color: '#a89c74', fontWeight: 700, fontSize: 16, mb: 0.5 }}>
                          Tesserino #{tessIdx + 1}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {tess.lessons && tess.lessons.map((lesson, lessonIdx) => (
                            <Box
                              key={lessonIdx}
                              sx={{
                                position: 'relative',
                                width: 32,
                                height: 44,
                                borderRadius: 2,
                                bgcolor: lesson.isUsed ? '#ffeb3b' : '#1565c0',
                                border: '2px solid #a89c74',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: lesson.isUsed ? '#d32f2f' : '#fff',
                                fontWeight: 700,
                                fontSize: 16,
                                cursor: lesson.isUsed ? 'not-allowed' : 'pointer',
                                opacity: lesson.isUsed ? 0.6 : 1,
                                transition: 'background 0.2s, opacity 0.2s',
                                '&:hover': {
                                  background: lesson.isUsed ? '#ffeb3b' : '#1976d2',
                                  opacity: 0.85,
                                },
                              }}
                              onClick={async () => {
                                if (!lesson.isUsed) {
                                  try {
                                    await axios.patch(`${apiUrl}/api/students/${student._id}/tesserini/${tessIdx}/lessons/${lessonIdx}/undo`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                                    const updatedStudents = [...students];
                                    updatedStudents[idx].tesserini[tessIdx].lessons[lessonIdx].isUsed = true;
                                    const now = new Date();
                                    const dateStr = now.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
                                    setSnackbarMsg(`Lezione annullata il ${dateStr}`);
                                    setSnackbarOpen(true);
                                    setStudents(updatedStudents);
                                  } catch (err) {
                                    let msg = 'Errore annullamento: ';
                                    if (err.response && err.response.data && err.response.data.message) {
                                      msg += err.response.data.message;
                                    } else if (err.message) {
                                      msg += err.message;
                                    } else {
                                      msg += 'Errore sconosciuto';
                                    }
                                    setSnackbarMsg(msg);
                                    setSnackbarOpen(true);
                                  }
                                }
                              }}
                            >
                              {lesson.isUsed ? '✗' : lessonIdx + 1}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </Container>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#1976d2',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 3,
            boxShadow: '0 2px 8px #1976d255',
            letterSpacing: 1,
          }
        }}
      />
    </Box>
  );
}

export default StudentArchive; 