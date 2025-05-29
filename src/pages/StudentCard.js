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
  const [selectedTessIndex, setSelectedTessIndex] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (student && student.tesserini && student.tesserini.length > 0) {
      setSelectedTessIndex(student.tesserini.length - 1);
    }
  }, [student]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'tessUpdate') fetchStudent();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/students/${id}`, {
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
        `${apiUrl}/api/students/${id}/lessons/${lessonIndex}/undo`,
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

  // Funzione helper per ottenere le lezioni dal tesserino selezionato
  const getSelectedLessons = () =>
    student && student.tesserini && Array.isArray(student.tesserini) && student.tesserini.length > 0 && selectedTessIndex !== null && Array.isArray(student.tesserini[selectedTessIndex].lessons)
      ? student.tesserini[selectedTessIndex].lessons
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
    console.log('Creazione tesserino con', numLessons, 'moduli');
    try {
      await axios.post(`${apiUrl}/api/students/${id}/tesserini`, { numLessons }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOpenTessDialog(false);
      fetchStudent();
    } catch (error) {
      console.error('Errore nella creazione del tesserino:', error);
      alert('Errore nella creazione del tesserino');
    }
  };

  // Colore giallo dei moduli
  const yellowMod = '#ffeb3b';
  // Colore verde per il box nome
  const nameBoxColor = '#43a047';
  const blueMod = '#1565c0';

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
            <Button variant="contained" color="primary" onClick={() => handleNewTesserino(10)()} sx={{ m: 1 }}>
              Tesserino 10 moduli
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleNewTesserino(5)()} sx={{ m: 1 }}>
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
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      bgcolor: '#232323',
    }}>
      <Box sx={{ width: '100%', maxWidth: 400, aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', mb: 0, pb: 0, position: 'relative' }}>
        <img
          src="/main.jpg"
          alt="Boxe BG"
          style={{ width: '100%', height: '100%', objectFit: 'cover', border: '4px solid #b71c1c', borderRadius: '8px', display: 'block' }}
        />
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.18)', zIndex: 2 }} />
        {/* Badge lezioni: mostra i moduli del tesserino selezionato */}
        <Box sx={{ position: 'absolute', left: 0, bottom: 70, width: '100%', zIndex: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          {getSelectedLessons().map((lesson, lessonIndex) => {
            const yellowMod = '#ffeb3b';
            const blueMod = '#1565c0';
            return lesson.isUsed ? (
              <Box key={lessonIndex} sx={{ width: 38, height: 52, borderRadius: 6, bgcolor: yellowMod, border: '2.5px solid #aaa', opacity: 0.92, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#d32f2f', mb: 0, boxSizing: 'border-box', position: 'relative' }}>
                <Box sx={{ background: 'orange', borderRadius: 3, px: 0.7, py: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✗</Box>
              </Box>
            ) : (
              <Box key={lessonIndex} sx={{ width: 38, height: 52, borderRadius: 6, bgcolor: blueMod, border: '2.5px solid #43a047', boxShadow: '0 2px 8px #1976d233', opacity: 0.92, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#1976d2', mb: 0, boxSizing: 'border-box' }}>
                <Box sx={{ background: 'orange', borderRadius: 3, px: 0.7, py: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{lessonIndex + 1}</Box>
              </Box>
            );
          })}
        </Box>
        {/* Nome allievo SOTTO i moduli, con padding e sfondo verde */}
        <Box sx={{ position: 'absolute', left: 0, bottom: 10, width: '100%', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: 'rgba(51,51,51,0.7)', borderRadius: 3, px: 3, py: 1.2, display: 'inline-block', mx: 'auto' }}>
            <Typography align="center" sx={{ fontFamily: "'Cheer Forever', Arial, sans-serif !important", fontWeight: 900, letterSpacing: 2, color: '#b48a00', textShadow: '1px 1px 4px #1976d2', m: 0, fontSize: 24, textTransform: 'uppercase', lineHeight: 1.1 }}>
              {student.name}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default StudentCard; 