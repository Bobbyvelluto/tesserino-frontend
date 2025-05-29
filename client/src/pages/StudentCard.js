import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';

const StudentCard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState(null);
  const [selectedTessIndex, setSelectedTessIndex] = useState(null);

  useEffect(() => {
    fetchStudent();
    // Aggiorna i dati ogni 10 secondi
    const interval = setInterval(fetchStudent, 10000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (student && student.tesserini && student.tesserini.length > 0) {
      setSelectedTessIndex(student.tesserini.length - 1);
    }
  }, [student]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/students/${id}`);
      setStudent(response.data);
    } catch (error) {
      console.error('Errore nel recupero dello studente:', error);
    }
  };

  // Funzione helper per ottenere le lezioni dal tesserino selezionato
  const getSelectedLessons = () =>
    student && student.tesserini && Array.isArray(student.tesserini) && student.tesserini.length > 0 && selectedTessIndex !== null && Array.isArray(student.tesserini[selectedTessIndex].lessons)
      ? student.tesserini[selectedTessIndex].lessons
      : [];

  return (
    <div>
      {getSelectedLessons().map((lesson, lessonIndex) => {
        const dateString = lesson.date ? new Date(lesson.date).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
        // Se la lezione è annullata
        if (lesson.isCancelled) {
          return (
            <Tooltip key={lessonIndex} title="Lezione annullata" arrow>
              <Box
                sx={{
                  width: 38,
                  height: 52,
                  borderRadius: 6,
                  bgcolor: '#eee',
                  border: '2.5px solid #d32f2f',
                  opacity: 0.92,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#d32f2f',
                  mb: 0,
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
              >
                <Box sx={{ fontSize: 28, color: '#d32f2f' }}>✗</Box>
              </Box>
            </Tooltip>
          );
        }
        // Se la lezione è usata
        if (lesson.isUsed) {
          return (
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
              >
                <Box sx={{ background: 'orange', borderRadius: 3, px: 0.7, py: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✗
                </Box>
              </Box>
            </Tooltip>
          );
        }
        // Se la lezione è disponibile (non usata e non annullata)
        return (
          <Box
            key={lessonIndex}
            sx={{
              width: 38,
              height: 52,
              borderRadius: 6,
              bgcolor: blueMod,
              border: '2.5px solid #43a047',
              boxShadow: '0 2px 8px #1976d233',
              opacity: 0.92,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
              color: '#1976d2',
              mb: 0,
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            <Box sx={{ background: 'orange', borderRadius: 3, px: 0.7, py: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {lessonIndex + 1}
            </Box>
            {/* Bottone annulla visibile solo se admin */}
            {localStorage.getItem('token') && (
              <button
                onClick={async () => {
                  if (window.confirm('Vuoi annullare questa lezione?')) {
                    await axios.patch(
                      `${apiUrl}/api/students/${id}/tesserini/${selectedTessIndex}/lessons/${lessonIndex}/cancel`,
                      {},
                      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                    );
                    fetchStudent();
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 18,
                  height: 18,
                  background: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                title="Annulla lezione"
              >
                ✗
              </button>
            )}
          </Box>
        );
      })}
    </div>
  );
};

export default StudentCard; 