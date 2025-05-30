import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentList from './pages/StudentList';
import StudentCard from './pages/StudentCard';
import StudentArchive from './pages/StudentArchive';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/studenti" element={<StudentList />} />
        <Route path="/student/:id" element={<StudentCard />} />
        <Route path="/archivio" element={<StudentArchive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
