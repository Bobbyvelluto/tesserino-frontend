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
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, ContentCopy as ContentCopyIcon, QrCode as QrCodeIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
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
  const [openTessDialog, setOpenTessDialog] = useState(false);
  const [pendingStudent, setPendingStudent] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

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
      console.error('Errore nel caricamento degli studenti:', error);
    }
  };

  const handleAddStudent = async (numLessons) => {
    try {
      await axios.post(`${apiUrl}/api/students`, pendingStudent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(async res => {
        // Dopo aver creato lo studente, aggiungi il tesserino scelto
        await axios.post(`${apiUrl}/api/students/${res.data._id}/tesserini`, { numLessons }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      });
      setOpen(false);
      setOpenTessDialog(false);
      setNewStudent({ name: '', telefono: '' });
      setPendingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Errore nell\'aggiunta dello studente:', error);
    }
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
    const rows = students.map(s => [
      s.name,
      s.telefono,
      s.lessons.filter(l => l.isUsed).length,
      s.lessons.length,
      s.lessons.map((l, i) => `#${i+1}:${l.isUsed ? 'Usata' : (l.date ? 'Annullata' : 'Disponibile')}@${l.date ? new Date(l.date).toLocaleString('it-IT') : '-'}`).join(' | ')
    ]);
    const csv = [header, ...rows].map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'studenti_tesserini.csv');
  };

  const studentsInScadenza = students.filter(
    s => getLessons(s).filter(l => !l.isUsed).length <= 2
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          borderRadius: 2,
          p: 3,
          mb: 3,
          textAlign: 'center',
          boxShadow: '0 4px 24px #1976d244',
        }}>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: 2, fontFamily: 'Oswald, Impact, Arial, sans-serif', mb: 0 }}>
            Abbonamenti
        </Typography>
        </Box>
        {studentsInScadenza.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Attenzione: {studentsInScadenza.length} studente/i stanno per terminare il tesserino!
            {studentsInScadenza.map(s => ` [${s.name} (${s.telefono})]`).join(', ')}
          </Alert>
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
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          Aggiungi Studente
        </Button>
        <Button
          variant="outlined"
          sx={{ ml: 2, mb: 2 }}
          onClick={exportCSV}
        >
          Esporta CSV
        </Button>
        <List>
          {filteredStudents.map((student) => (
            <ListItem key={student._id} divider>
              <ListItemText
                primary={student.name}
                secondary={student.telefono}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => navigate(`/student/${student._id}`)}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleCopyLink(student._id)}
                  sx={{ ml: 1 }}
                >
                  <ContentCopyIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleShowQR(student._id)}
                  sx={{ ml: 1 }}
                >
                  <QrCodeIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleEditStudent(student)}
                  sx={{ ml: 1 }}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteStudent(student._id)}
                  sx={{ ml: 1 }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
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
          <Button onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={() => { setPendingStudent(newStudent); setOpen(false); setOpenTessDialog(true); }} variant="contained">
            Avanti
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTessDialog} onClose={() => setOpenTessDialog(false)}>
        <DialogTitle>Scegli il tipo di tesserino</DialogTitle>
        <DialogContent>
          <Button variant="contained" color="primary" onClick={() => handleAddStudent(10)} sx={{ m: 1 }}>
            Tesserino 10 moduli
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleAddStudent(5)} sx={{ m: 1 }}>
            Tesserino 5 moduli
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTessDialog(false)}>Annulla</Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
}

export default StudentList; 