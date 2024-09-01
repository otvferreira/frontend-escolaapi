import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Corrigido para Sidebar
import Professores from './pages/Professores';
import Turmas from './pages/Turmas';
import Alunos from './pages/Alunos';
import Atividades from './pages/Atividades';
import Notas from './pages/Notas';

function App() {
    return (
        <Router>
            <div style={{ display: 'flex', height: '100vh' }}>
                <Sidebar />
                <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    <Routes>
                        <Route path="/professores" element={<Professores />} />
                        <Route path="/turmas" element={<Turmas />} />
                        <Route path="/alunos" element={<Alunos />} />
                        <Route path="/atividades" element={<Atividades />} />
                        <Route path="/notas" element={<Notas />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
