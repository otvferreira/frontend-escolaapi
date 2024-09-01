import React, { useState, useEffect } from 'react';
import TurmaForm from '../components/TurmaForm';
import './Turmas.css';

function Turmas() {
    const [turmas, setTurmas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [editingTurma, setEditingTurma] = useState(null);

    const fetchTurmas = async () => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/turmas');
            if (!response.ok) {
                throw new Error('Erro ao buscar turmas');
            }
            const result = await response.json();
            if (Array.isArray(result.data)) {
                setTurmas(result.data);
            } else {
                console.error('Os dados retornados não são um array:', result.data);
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const fetchProfessores = async () => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/professores');
            if (!response.ok) {
                throw new Error('Erro ao buscar professores');
            }
            const result = await response.json();
            if (Array.isArray(result.data)) {
                setProfessores(result.data);
            } else {
                console.error('Os dados retornados não são um array:', result.data);
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const adicionarTurma = async (turma) => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/turmas/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(turma),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar turma');
            }

            const data = await response.json();
            setTurmas((prevTurmas) => [...prevTurmas, data]);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const editarTurma = async (turma) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/turmas/alterar/${turma.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(turma),
            });

            if (!response.ok) {
                throw new Error('Erro ao editar turma');
            }

            const data = await response.json();
            setTurmas((prevTurmas) =>
                prevTurmas.map((tur) => (tur.ID === data.ID ? data : tur))
            );
            setEditingTurma(null);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const deletarTurma = async (id) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/turmas/deletar/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar turma');
            }

            setTurmas((prevTurmas) => prevTurmas.filter((tur) => tur.ID !== id));
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    useEffect(() => {
        fetchTurmas();
        fetchProfessores();
    }, []);

    return (
        <div>
            <h1>Gerenciar Turmas</h1>
            <div className="turmas-container">
                <div className="turma-form-container">
                    <TurmaForm
                        onSubmit={editingTurma ? editarTurma : adicionarTurma}
                        initialValues={editingTurma}
                        clearEdit={() => setEditingTurma(null)}
                    />
                </div>
                <div className="turmas-list">
                    <h2>Lista de Turmas</h2>
                    <div className="list-container-scrollable">
                        {turmas.length > 0 ? (
                            turmas.map((tur) => (
                                <div className="card mb-3" key={tur.ID}>
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5 className="card-title">{tur.nome}</h5>
                                            <p className="card-text">
                                                <strong>Semestre:</strong> {tur.semestre}<br />
                                                <strong>Ano:</strong> {tur.ano}<br />
                                                <strong>Professor:</strong> {/* Professor name */}
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <button className="btn btn-primary mb-2" onClick={() => setEditingTurma(tur)}>Editar</button>
                                            <button className="btn btn-danger" onClick={() => deletarTurma(tur.ID)}>Deletar</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nenhuma turma encontrada.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Turmas;
