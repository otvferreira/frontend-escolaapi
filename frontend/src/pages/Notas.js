import React, { useState, useEffect } from 'react';
import NotasForm from '../components/NotasForm';
import './Notas.css';

function Notas() {
    const [turmas, setTurmas] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [notas, setNotas] = useState([]);
    const [editingNotas, setEditingNotas] = useState(null);

    const fetchTurmas = async () => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/turmas');
            if (!response.ok) {
                throw new Error('Erro ao buscar turmas');
            }
            const result = await response.json();
            setTurmas(result.data || []);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const fetchAtividades = async () => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/atividades');
            if (!response.ok) {
                throw new Error('Erro ao buscar atividades');
            }
            const result = await response.json();
            setAtividades(result.data || []);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const fetchNotas = async (turmaID, atividadeID) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/notas/${turmaID}/${atividadeID}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar notas');
            }
            const result = await response.json();
            setNotas(result.data || []);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const adicionarNotas = async (notasData) => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/notas/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notasData),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar notas');
            }

            const data = await response.json();
            fetchNotas(notasData.turma, notasData.atividade); // Recarrega as notas após a adição
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleEdit = (turmaID, atividadeID) => {
        fetchNotas(turmaID, atividadeID);
        setEditingNotas({ turma: turmaID, atividade: atividadeID });
    };

    const handleClearEdit = () => {
        setEditingNotas(null);
        setNotas([]);
    };

    useEffect(() => {
        fetchTurmas();
        fetchAtividades();
    }, []);

    return (
        <div className="notas-container">
            <h1>Gerenciar Notas</h1>
            <div className="notas-form-container">
                <NotasForm
                    onSubmit={adicionarNotas}
                    turmas={turmas}
                    atividades={atividades}
                    clearEdit={handleClearEdit}
                    initialValues={editingNotas ? { turma: editingNotas.turma, atividade: editingNotas.atividade, notas } : null}
                />
            </div>
            <div className="notas-list">
                <h2>Lista de Notas</h2>
                <div className="list-container-scrollable">
                    {notas.length > 0 ? (
                        notas.map((nota, index) => (
                            <div className="card mb-3" key={index}>
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div>
                                        <h5 className="card-title">{nota.alunoNome}</h5>
                                        <p className="card-text">
                                            <strong>Nota:</strong> {nota.valor} pontos
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhuma nota encontrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notas;
