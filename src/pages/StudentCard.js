import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import ShareIcon from '@mui/icons-material/Share';

function StudentCard() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [showPwaHint, setShowPwaHint] = useState(() => {
    return localStorage.getItem('hidePwaHint') !== '1';
  });
  const [showUndoAlert, setShowUndoAlert] = useState(false);
  const [undoLessonIndex, setUndoLessonIndex] = useState(null);
  const [showLessonInfo, setShowLessonInfo] = useState(false);
  const [lessonInfo, setLessonInfo] = useState({});
  const [openTessDialog, setOpenTessDialog] = useState(false);

  useEffect(() => {
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`https://tesserino-virtuale1.onrender.com/api/students/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStudent(response.data);
    } catch (error) {
      console.error('Errore nel caricamento dello studente:', error);
    }
  };

  // Funzione per annullare una lezione
  const handleUndoLesson = async (lessonIndex) => {
    try {
      await axios.patch(
        `https://tesserino-virtuale1.onrender.com/api/students/${id}/lessons/${lessonIndex}/undo`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchStudent();
      setUndoLessonIndex(lessonIndex);
      setShowUndoAlert(true);
    } catch (error) {
      alert('Errore nell\'annullamento della lezione');
    }
  };

  const handleClosePwaHint = () => {
    setShowPwaHint(false);
    localStorage.setItem('hidePwaHint', '1');
  };

  // Gestione click su modulo disponibile (ma annullato)
  const handleAvailableLessonClick = (lessonIndex, lesson) => {
    if (lesson.date) {
      setLessonInfo({
        number: lessonIndex + 1,
        date: new Date(lesson.date).toLocaleString('it-IT', {
          day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
        })
      });
      setShowLessonInfo(true);
    } else {
      // Niente banner se mai usata
    }
  };

  // Funzione helper per ottenere le lezioni dal tesserino attivo
  const getLessons = (student) =>
    student && student.tesserini && Array.isArray(student.tesserini) && student.tesserini.length > 0 && Array.isArray(student.tesserini[student.tesserini.length - 1].lessons)
      ? student.tesserini[student.tesserini.length - 1].lessons
      : [];

  // SVG vintage e illustrazione per il banner PWA
  const CardSVG = () => (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: 8}}>
      <rect x="2" y="2" width="56" height="36" rx="8" fill="#ff9800" stroke="#795548" strokeWidth="4"/>
      <circle cx="30" cy="20" r="10" fill="#fff8e1" stroke="#1976d2" strokeWidth="2"/>
      <text x="30" y="25" textAnchor="middle" fontFamily="Oswald, Impact, Arial" fontWeight="bold" fontSize="10" fill="#1976d2">WBBS</text>
    </svg>
  );
  const HandSVG = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 6, verticalAlign: 'middle'}}>
      <path d="M8 24c0 2 2 4 4 4h8c2 0 4-2 4-4v-8c0-2-2-4-4-4h-2V6a2 2 0 0 0-4 0v6H12c-2 0-4 2-4 4v8z" fill="#ffb300" stroke="#795548" strokeWidth="2"/>
      <circle cx="16" cy="8" r="2" fill="#fff8e1" stroke="#1976d2" strokeWidth="1"/>
    </svg>
  );
  const MenuSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: 'middle', marginRight: 4}}>
      <rect y="4" width="24" height="3" rx="1.5" fill="#795548"/>
      <rect y="10.5" width="24" height="3" rx="1.5" fill="#795548"/>
      <rect y="17" width="24" height="3" rx="1.5" fill="#795548"/>
    </svg>
  );

  // Funzione per creare un nuovo tesserino con scelta moduli
  const handleNewTesserino = (numLessons) => async () => {
    await axios.post(`https://tesserino-virtuale1.onrender.com/api/students/${id}/tesserini`, { numLessons }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setOpenTessDialog(false);
    fetchStudent();
  };

  // Colore giallo dei moduli
  const yellowMod = '#ffeb3b';
  // Colore verde per il box nome
  const nameBoxColor = '#43a047';

  if (!student) {
    return (
      <Container>
        <Typography>Caricamento...</Typography>
      </Container>
    );
  }

  if (!student || !student.tesserini || !Array.isArray(student.tesserini) || student.tesserini.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Dati studente non disponibili o nessun tesserino attivo.
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenTessDialog(true)}
        >
          Crea nuovo tesserino
        </Button>
        <Dialog open={openTessDialog} onClose={() => setOpenTessDialog(false)}>
          <DialogTitle>Scegli il tipo di tesserino</DialogTitle>
          <DialogContent>
            <Button variant="contained" color="primary" onClick={handleNewTesserino(10)} sx={{ m: 1 }}>
              Tesserino 10 moduli
            </Button>
            <Button variant="contained" color="secondary" onClick={handleNewTesserino(5)} sx={{ m: 1 }}>
              Tesserino 5 moduli
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTessDialog(false)}>Annulla</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{
      p: 0, m: 0, minWidth: '100vw', minHeight: '100vh',
      display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', justifyContent: 'center',
      bgcolor: '#fff8e1',
    }}>
      <Box sx={{ flex: '0 0 auto', mb: { xs: 2, md: 0 }, mr: { md: 3, xs: 0 } }}>
        {/* Popup istruzioni PWA */}
        {showPwaHint && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Box sx={{
              bgcolor: '#fff8e1',
              borderRadius: 6,
              boxShadow: '0 8px 32px #ff980088',
              p: 4,
              maxWidth: 370,
              width: '92vw',
              textAlign: 'center',
              position: 'relative',
              border: '4px solid #ff9800',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <IconButton onClick={handleClosePwaHint} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <CloseIcon />
              </IconButton>
              <CardSVG />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 900, color: '#d84315', letterSpacing: 2, fontFamily: 'Oswald, Impact, Arial, sans-serif', textShadow: '0 2px 8px #ff980088' }}>
                Installa il tesserino come App!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#795548', fontWeight: 700, fontSize: 18 }}>
                Per un accesso rapido e senza limiti, aggiungi il tesserino alla schermata Home:
              </Typography>
              <Box sx={{ textAlign: 'left', mb: 2, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AppleIcon sx={{ color: '#222', fontSize: 28, mr: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ff9800', fontSize: 18 }}>iPhone (Safari):</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, ml: 4, color: '#333', fontWeight: 600 }}>
                  1. Tocca <ShareIcon sx={{ fontSize: 18, mb: '-3px', color: '#1976d2' }} /> <b>Condividi</b> in basso<br/>
                  2. Scegli <b>Aggiungi a Home</b>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                  <AndroidIcon sx={{ color: '#388e3c', fontSize: 28, mr: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#388e3c', fontSize: 18 }}>Android (Chrome):</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, ml: 4, color: '#333', fontWeight: 600 }}>
                  1. Tocca <MenuSVG /> <b>Menu</b> in alto a destra<br/>
                  2. Scegli <b>Aggiungi a schermata Home</b>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <HandSVG />
                <Typography variant="caption" sx={{ color: '#d84315', fontWeight: 700, letterSpacing: 1, fontSize: 16 }}>
                  Vedrai l'icona "MY BOXING LESSONS" tra le tue app!
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        {/* Sfondo immagine e overlay */}
        <img
          src="/main.jpg"
          alt="Boxe BG"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            border: '4px solid #b71c1c',
            borderRadius: '8px',
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.18)',
          zIndex: 2,
        }} />
        {/* Badge lezioni: mostra solo il numero effettivo di moduli */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          bottom: 70,
          width: '100%',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
        }}>
          {getLessons(student).map((lesson, lessonIndex) => {
            const dateString = lesson.date ? new Date(lesson.date).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
            return lesson.isUsed ? (
              <Tooltip key={lessonIndex} title={dateString ? `Lezione effettuata il ${dateString}` : ''} arrow>
                <Box
                  sx={{
                    width: 38,
                    height: 52,
                    borderRadius: 6,
                    bgcolor: yellowMod,
                    border: '2.5px solid #aaa',
                    boxShadow: 'none',
                    opacity: 0.92,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#d32f2f',
                    mb: 0,
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => {}}
                >
                  <Box sx={{ background: 'orange', borderRadius: 3, px: 0.7, py: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✗
                  </Box>
                  {/* Bottone Annulla visibile solo se token presente (admin) */}
                  {localStorage.getItem('token') && (
                    <button
                      onClick={() => handleUndoLesson(lessonIndex)}
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        width: 18,
                        height: 18,
                        background: '#ff9800',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px #e6510022',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}
                      title="Annulla lezione"
                    >
                      ↺
                    </button>
                  )}
                </Box>
              </Tooltip>
            ) : (
              <Box
                key={lessonIndex}
                sx={{
                  width: 38,
                  height: 52,
                  borderRadius: 6,
                  bgcolor: yellowMod,
                  border: '2.5px solid #43a047',
                  boxShadow: '0 2px 8px #1976d233',
                  opacity: 0.92,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#1976d2',
                  mb: 0,
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  '&:hover': {
                    boxShadow: '0 0 8px #43a047',
                    transform: 'scale(1.08)',
                    background: 'linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)',
                  },
                }}
                onClick={() => handleAvailableLessonClick(lessonIndex, lesson)}
              >
                <Box sx={{ background: 'orange', borderRadius: 3, px: 0.7, py: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {lessonIndex + 1}
                </Box>
              </Box>
            );
          })}
        </Box>
        {/* Nome allievo SOTTO i moduli, con padding e sfondo verde */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          bottom: 10,
          width: '100%',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Box sx={{
            bgcolor: nameBoxColor,
            borderRadius: 3,
            px: 3,
            py: 1.5,
            boxShadow: '0 2px 8px #43a04755',
            border: '2px solid #fffde7',
            minWidth: 120,
            textAlign: 'center',
          }}>
            <Typography
              align="center"
              sx={{
                fontFamily: "'Oswald', Impact, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: 2,
                color: '#fff',
                textShadow: '0 2px 8px #222b',
                m: 0,
                fontSize: 22,
                textTransform: 'uppercase',
                lineHeight: 1.1,
                px: 1.5,
                borderRadius: 3,
              }}
            >
              {student.name}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ flex: 1, minWidth: 260, maxWidth: 480, bgcolor: '#fff', borderRadius: 4, boxShadow: '0 2px 8px #1976d233', p: { xs: 2, md: 3 }, mt: { xs: 0, md: 2 } }}>
        {/* Snackbar avviso annullamento modulo */}
        <Snackbar
          open={showUndoAlert && !localStorage.getItem('token')}
          autoHideDuration={4000}
          onClose={() => setShowUndoAlert(false)}
          message={`Una lezione è stata annullata dall'amministratore. Ora puoi riutilizzare il modulo n°${undoLessonIndex !== null ? undoLessonIndex + 1 : ''}.`}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              bgcolor: '#ff9800',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              borderRadius: 3,
              boxShadow: '0 2px 8px #d8431555',
              letterSpacing: 1,
            }
          }}
        />
        {/* Snackbar info lezione annullata (clic su modulo disponibile con data) */}
        <Snackbar
          open={showLessonInfo}
          autoHideDuration={4000}
          onClose={() => setShowLessonInfo(false)}
          message={lessonInfo.number ? `Modulo n°${lessonInfo.number}: lezione effettuata il ${lessonInfo.date}` : ''}
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
        {/* Storico lezioni */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
          Storico lezioni
        </Typography>
        {getLessons(student).map((lesson, idx) => {
          let stato = 'Disponibile';
          let colore = '#43a047';
          if (lesson.isUsed && lesson.date) {
            stato = 'Usata';
            colore = '#d32f2f';
          } else if (!lesson.isUsed && lesson.date) {
            stato = 'Annullata';
            colore = '#ff9800';
          }
          return (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
              <Typography sx={{ width: 32, fontWeight: 700, color: '#1976d2' }}>#{idx + 1}</Typography>
              <Typography sx={{ flex: 1, color: '#333' }}>
                {lesson.date ? new Date(lesson.date).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
              </Typography>
              <Typography sx={{ fontWeight: 700, color: colore }}>{stato}</Typography>
            </Box>
          );
        })}
        {(!student.tesserini || student.tesserini.length === 0) ? (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="error" sx={{ mb: 2 }}>
              Nessun tesserino attivo per questo studente.
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={async () => {
                await axios.post(`https://tesserino-virtuale1.onrender.com/api/students/${student._id}/tesserini`, {}, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                fetchStudent();
              }}
            >
              Nuovo tesserino
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            {student.tesserini.map((tess, idx) => (
              <Box key={idx} sx={{ mb: 2, p: 2, border: '2px solid #1976d2', borderRadius: 2, bgcolor: '#f5faff' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Tesserino #{idx + 1} (attivato il {new Date(tess.attivatoIl).toLocaleDateString('it-IT')})
                </Typography>
                {tess.lessons.map((lesson, lidx) => (
                  <Box
                    key={lidx}
                    sx={{
                      display: 'inline-block',
                      mr: 1, mb: 1, px: 1, py: 0.5, borderRadius: 2,
                      bgcolor: lesson.isUsed ? '#d32f2f22' : '#43a04722',
                      color: lesson.isUsed ? '#d32f2f' : '#43a047',
                      fontWeight: 700, position: 'relative',
                      cursor: (lesson.isUsed || (localStorage.getItem('token') && !lesson.isUsed)) ? 'pointer' : 'default',
                      transition: 'background 0.2s',
                      '&:hover': (lesson.isUsed || (localStorage.getItem('token') && !lesson.isUsed)) ? { bgcolor: '#ff980055' } : {},
                    }}
                    onClick={lesson.isUsed
                      ? async () => {
                          if (window.confirm('Vuoi annullare questa lezione?')) {
                            await axios.patch(`https://tesserino-virtuale1.onrender.com/api/students/${student._id}/tesserini/${idx}/lessons/${lidx}/undo`, {}, {
                              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                            });
                            fetchStudent();
                          }
                        }
                      : (localStorage.getItem('token') && !lesson.isUsed
                        ? async () => {
                            if (window.confirm('Vuoi marcare questa lezione come usata?')) {
                              await axios.patch(`https://tesserino-virtuale1.onrender.com/api/students/${student._id}/tesserini/${idx}/lessons/${lidx}/use`, {}, {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                              });
                              fetchStudent();
                            }
                          }
                        : undefined)
                    }
                    title={lesson.isUsed ? 'Clicca per annullare la lezione' : (localStorage.getItem('token') && !lesson.isUsed ? 'Clicca per marcare come usata' : '')}
                  >
                    {lidx + 1} {lesson.isUsed ? '✓' : ''}
                    {lesson.undoDate && (
                      <span style={{ fontSize: 10, color: '#ff9800', marginLeft: 4 }}>
                        (Annullata il {new Date(lesson.undoDate).toLocaleString('it-IT')})
                      </span>
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default StudentCard; 