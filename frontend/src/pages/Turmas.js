import React, { useState, useEffect } from 'react';
import TurmaForm from '../components/TurmaForm';
import './Turmas.css';

function Turmas() {
    const [turmas, setTurmas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [nomeProfessores, setNomeProfessores] = useState({});
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
                console.log("Turmas carregadas:", result.data);  // Debug
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
                console.log("Professores carregados:", result.data);  // Debug
                const nomeMap = {};
                for (const professor of result.data) {
                    nomeMap[professor.ID] = professor.nome;
                }
                setNomeProfessores(nomeMap);
            } else {
                console.error('Os dados retornados não são um array:', result.data);
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const adicionarTurma = async (turma) => {
        try {
            console.log('Enviando dados para adicionar turma:', {
                nome: turma.nome,
                semestre: turma.semestre,
                ano: turma.ano,
                professor_id: turma.professor_id,
            });  // Debug

            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/turmas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: turma.nome,
                    semestre: turma.semestre,
                    ano: parseInt(turma.ano, 10), // Certifique-se de que o ano é um número
                    professor_id: turma.professor_id,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao adicionar turma: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setTurmas((prevTurmas) => [...prevTurmas, data]);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const editarTurma = async (turma) => {
        try {
            // Verifique se o ID da turma está definido
            if (!turma.ID) {
                throw new Error('ID da turma é indefinido');
            }
    
            console.log('Enviando dados para editar turma:', {
                nome: turma.nome,
                semestre: turma.semestre,
                ano: turma.ano,
                professor_id: turma.professor_id,
                ID: turma.ID,  // Verifique se o ID está definido
            });  // Debug
    
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/turmas/alterar/${turma.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: turma.nome,
                    semestre: turma.semestre,
                    ano: parseInt(turma.ano, 10), // Certifique-se de que o ano é um número
                    professor_id: turma.professor_id,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Erro ao editar turma: ${response.status} ${response.statusText}`);
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
                        professores={professores}
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
                                                <strong>Professor:</strong> {nomeProfessores[tur.professor_id] || 'Carregando...'}
                                            </p>
                                        </div>
                                        <div>
                                            <button className="btn btn-primary mr-2" onClick={() => setEditingTurma(tur)}>
                                                Editar
                                            </button>
                                            <button className="btn btn-danger" onClick={() => deletarTurma(tur.ID)}>
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nenhuma turma cadastrada</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Turmas;
