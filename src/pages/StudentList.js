import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Alert,
  Grid,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, ContentCopy as ContentCopyIcon, QrCode as QrCodeIcon, Delete as DeleteIcon, Edit as EditIcon, Link as LinkIcon } from '@mui/icons-material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { saveAs } from 'file-saver';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', telefono: '' });
  const [qrOpen, setQrOpen] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editStudent, setEditStudent] = useState({ _id: '', name: '', telefono: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTessType, setSelectedTessType] = useState(null);
  const [linkQrOpen, setLinkQrOpen] = useState(false);
  const [linkQrStudent, setLinkQrStudent] = useState(null);
<<<<<<< HEAD
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
=======
  const [tessBtnDisabled, setTessBtnDisabled] = useState(false);
>>>>>>> 901ef063a8c648bb61189ee9d64e316c5c81604e
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  console.log('selectedTessType:', selectedTessType);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.wilsonbasetta@Mac tesserino-frontend % npm start

> tesserino-virtuale-client@0.1.0 start
> react-scripts start

sh: react-scripts: command not found
wilsonbasetta@Mac tesserino-frontend % 


<<<<<<< HEAD
=======
  const handleAddStudent = async (numLessons) => {
    setTessBtnDisabled(true);
    try {
      // Crea lo studente
      const res = await axios.post(`${apiUrl}/api/students`, pendingStudent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Aggiungi SOLO il tesserino scelto
      await axios.post(`${apiUrl}/api/students/${res.data._id}/tesserini`, { numLessons }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOpen(false);
      setOpenTessDialog(false);
      setNewStudent({ name: '', telefono: '' });
      setPendingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Errore nell\'aggiunta dello studente:', error);
    } finally {
      setTessBtnDisabled(false);
    }
>>>>>>> 901ef063a8c648bb61189ee9d64e316c5c81604e
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      try {
        await axios.delete(`${apiUrl}/api/students/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchStudents();
      } catch (error) {
        alert('Errore nell\'eliminazione dello studente');
      }
    }
  };

  function getServerOrigin() {
    // Restituisce sempre il dominio pubblico di Render
    return 'https://tesserino-frontend.onrender.com';
  }

  const handleCopyLink = (id) => {
    const url = `${getServerOrigin()}/student/${id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => alert('Link tesserino copiato!'))
        .catch(() => alert('Copia non riuscita, copia manualmente il link: ' + url));
    } else {
      window.prompt('Copia manualmente il link:', url);
    }
  };

  const handleShowQR = (id) => {
    setQrValue(`${getServerOrigin()}/student/${id}`);
    setQrOpen(true);
  };

  const handleCloseQR = () => {
    setQrOpen(false);
    setQrValue('');
  };

  const handleEditStudent = (student) => {
    setEditStudent(student);
    setEditOpen(true);
  };

  const handleEditStudentSave = async () => {
    try {
      await axios.patch(`${apiUrl}/api/students/${editStudent._id}`, {
        name: editStudent.name,
        telefono: editStudent.telefono,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditOpen(false);
      setEditStudent({ _id: '', name: '', telefono: '' });
      fetchStudents();
    } catch (error) {
      alert('Errore nella modifica dello studente');
    }
  };

  const getLessons = (student) =>
    student && student.tesserini && Array.isArray(student.tesserini) && student.tesserini.length > 0 && Array.isArray(student.tesserini[student.tesserini.length - 1].lessons)
      ? student.tesserini[student.tesserini.length - 1].lessons
      : [];

  const filteredStudents = students.filter(student => {
    const lessons = getLessons(student);
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || student.telefono.includes(search);
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && lessons.some(l => !l.isUsed);
    if (filter === 'finished') return matchesSearch && lessons.length > 0 && lessons.every(l => l.isUsed);
    return true;
  });

  const exportCSV = () => {
    const header = ['Nome', 'Telefono', 'Lezioni Usate', 'Lezioni Totali', 'Storico Lezioni'];
    const rows = students.map(s => {
      const lessons = getLessons(s);
      return [
        s.name,
        s.telefono,
        lessons.filter(l => l.isUsed).length,
        lessons.length,
        lessons.map((l, i) => `#${i+1}:${l.isUsed ? 'Usata' : (l.date ? 'Annullata' : 'Disponibile')}@${l.date ? new Date(l.date).toLocaleString('it-IT') : '-'}`).join(' | ')
      ];
    });
    const csv = [header, ...rows].map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'studenti_tesserini.csv');
  };

  const studentsInScadenza = students.filter(
    s => getLessons(s).filter(l => !l.isUsed).length <= 2
  );

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
            sx={{ borderColor: '#a3b18a', color: '#588157', fontWeight: 600, ':hover': { borderColor: '#588157', background: '#e9f5db' } }}
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
                background: 'linear-gradient(135deg, #d0f5df 0%, #a3e4b7 100%)',
                borderRadius: 4,
                boxShadow: '0 4px 16px #a3e4b744',
                border: '2px solid #a3e4b7',
                mb: 3,
              }}
            >
              <Typography variant="h4" sx={{ color: '#588157', fontWeight: 700, mb: 2, letterSpacing: 2 }}>
                TESSERINI INDIVIDUALI
              </Typography>
              <Typography variant="body1" sx={{ color: '#588157', mb: 2 }}>
                Visualizza e gestisci gli studenti e i loro tesserini
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant={selectedTessType === 10 ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setSelectedTessType(10)}
                >
                  Tesserino 10 lezioni
                </Button>
                <Button
                  variant={selectedTessType === 5 ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setSelectedTessType(5)}
                >
                  Tesserino 5 lezioni
                </Button>
              </Box>
              {selectedTessType && (
                <Button
                  variant="contained"
                  onClick={() => setOpen(true)}
                  sx={{ mb: 2, bgcolor: '#588157', color: '#fff', fontWeight: 700, ':hover': { bgcolor: '#3e6b3e' } }}
                >
                  Aggiungi Studente
                </Button>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <TextField
                  placeholder="Cerca per nome o telefono"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 260 }}
                />
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={(e, v) => v && setFilter(v)}
                  size="small"
                >
                  <ToggleButton value="all">Tutti</ToggleButton>
                  <ToggleButton value="active">Con lezioni residue</ToggleButton>
                  <ToggleButton value="finished">Tesserino esaurito</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Button
                variant="outlined"
                sx={{ ml: 2, mb: 2, borderColor: '#a3b18a', color: '#588157', fontWeight: 600, ':hover': { borderColor: '#588157', background: '#e9f5db' } }}
                onClick={exportCSV}
              >
                Esporta CSV
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
              {filteredStudents.map((student) => (
                <Paper
                  key={student._id}
                  elevation={2}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    borderRadius: 4,
                    boxShadow: '0 2px 8px #a3e4b744',
                    background: 'linear-gradient(135deg, #d0f5df 0%, #a3e4b7 100%)',
                    border: '2px solid #a3e4b7',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 4px 16px #a3e4b788' },
                  }}
                >
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', bgcolor: '#eee', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {/* Qui puoi mettere una foto profilo se disponibile, altrimenti icona */}
                    <span role="img" aria-label="user">👤</span>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Front Page Neue', Arial, sans-serif !important",
                        fontWeight: 900,
                        fontSize: 24,
                        color: '#23272f',
                        textShadow: '1px 1px 4px #e0e0e0',
                        textTransform: 'uppercase',
                        mb: 0.5,
                      }}
                    >
                      {student.name}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: '#888' }}>{student.telefono}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
                      onClick={() => navigate(`/student/${student._id}`)}
                    >
                      Vedi
                    </Button>
                    {/* Pulsante Link & QR */}
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      startIcon={<LinkIcon />}
                      sx={{ mr: 1 }}
                      onClick={() => { setLinkQrStudent(student); setLinkQrOpen(true); }}
                    >
                      Link & QR
                    </Button>
                    {/* Modifica */}
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEditStudent(student)}
                    >
                      Modifica
                    </Button>
                    {/* Cancella */}
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteStudent(student._id)}
                    >
                      Cancella
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); setNewStudent({ name: '', telefono: '' }); }}>
        <DialogTitle>Aggiungi Nuovo Studente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefono"
            type="tel"
            fullWidth
            value={newStudent.telefono}
            onChange={(e) => setNewStudent({ ...newStudent, telefono: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setNewStudent({ name: '', telefono: '' }); }}>Annulla</Button>
          <Button
            onClick={async () => {
              if (isSaving) return;
              console.log('AGGIUNGO STUDENTE E TESSERINO', newStudent, selectedTessType, Date.now());
              setIsSaving(true);
              try {
                const res = await axios.post(`${apiUrl}/api/students`, newStudent, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                await axios.post(`${apiUrl}/api/students/${res.data._id}/tesserini`, { numLessons: selectedTessType }, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setOpen(false);
                setNewStudent({ name: '', telefono: '' });
                fetchStudents();
              } catch (error) {
                console.error("Errore nell'aggiunta dello studente:", error);
              } finally {
                setIsSaving(false);
              }
            }}
            variant="contained"
            disabled={isSaving}
          >
            {isSaving ? 'Salvataggio...' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

<<<<<<< HEAD
=======
      <Dialog open={openTessDialog} onClose={() => setOpenTessDialog(false)}>
        <DialogTitle>Scegli il tipo di tesserino</DialogTitle>
        <DialogContent>
          <Button variant="contained" color="primary" onClick={() => handleAddStudent(10)} sx={{ m: 1 }} disabled={tessBtnDisabled}>
            Tesserino 10 moduli
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleAddStudent(5)} sx={{ m: 1 }} disabled={tessBtnDisabled}>
            Tesserino 5 moduli
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTessDialog(false)}>Annulla</Button>
        </DialogActions>
      </Dialog>

>>>>>>> 901ef063a8c648bb61189ee9d64e316c5c81604e
      <Dialog open={qrOpen} onClose={handleCloseQR}>
        <DialogTitle>QR Code Tesserino</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {qrValue && (
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrValue)}`} alt="QR Code" />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Modifica Studente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={editStudent.name}
            onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefono"
            type="tel"
            fullWidth
            value={editStudent.telefono}
            onChange={(e) => setEditStudent({ ...editStudent, telefono: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annulla</Button>
          <Button onClick={handleEditStudentSave} variant="contained">Salva</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Link & QR */}
      <Dialog open={linkQrOpen} onClose={() => setLinkQrOpen(false)}>
        <DialogTitle>Link e QR Tesserino</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {linkQrStudent && (
            <>
              <TextField
                value={`${window.location.origin}/student/${linkQrStudent._id}`}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/student/${linkQrStudent._id}`);
                          setSnackbarOpen(true);
                        }}
                        edge="end"
                        size="small"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 320, mb: 1 }}
                variant="outlined"
                size="small"
              />
              <img
                id="qr-img"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + '/student/' + linkQrStudent._id)}`}
                alt="QR Code"
                style={{ margin: '0 auto', display: 'block', borderRadius: 8 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const img = document.getElementById('qr-img');
                  const link = document.createElement('a');
                  link.href = img.src;
                  link.download = `qr_tesserino_${linkQrStudent._id}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                sx={{ mt: 1 }}
              >
                Scarica QR
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkQrOpen(false)}>Chiudi</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copiato negli appunti!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default StudentList; 