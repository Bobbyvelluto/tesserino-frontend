import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pagine
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentCard from './pages/StudentCard';
import StudentArchive from './pages/StudentArchive';
import RequireAuth from './components/RequireAuth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/students" element={
            <RequireAuth>
              <StudentList />
            </RequireAuth>
          } />
          <Route path="/student/:id" element={<StudentCard />} />
          <Route path="/student-archive" element={
            <RequireAuth>
              <StudentArchive />
            </RequireAuth>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 