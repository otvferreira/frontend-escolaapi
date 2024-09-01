import React, { useState, useEffect } from 'react';
import ProfessorForm from '../components/ProfessorForm';
import './Professores.css';

function Professores() {
    const [professores, setProfessores] = useState([]);
    const [editingProfessor, setEditingProfessor] = useState(null);

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

    const adicionarProfessor = async (professor) => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/professores/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(professor),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar professor');
            }

            const data = await response.json();
            setProfessores((prevProfessores) => [...prevProfessores, data]);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const editarProfessor = async (professor) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/professores/alterar/${professor.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(professor),
            });

            if (!response.ok) {
                throw new Error('Erro ao editar professor');
            }

            const data = await response.json();
            setProfessores((prevProfessores) =>
                prevProfessores.map((prof) => (prof.ID === data.ID ? data : prof))
            );
            setEditingProfessor(null);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const deletarProfessor = async (id) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/professores/deletar/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar professor');
            }

            setProfessores((prevProfessores) => prevProfessores.filter((prof) => prof.ID !== id));
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    useEffect(() => {
        fetchProfessores();
    }, []);

    return (
        <div>
            <h1>Gerenciar Professores</h1>
            <div className="professores-container">
                {/* Adicione a classe professor-form-container aqui */}
                <div className="professor-form-container">
                    <ProfessorForm
                        onSubmit={editingProfessor ? editarProfessor : adicionarProfessor}
                        initialValues={editingProfessor}
                        clearEdit={() => setEditingProfessor(null)}
                    />
                </div>
                <div className="professores-list">
                    <h2>Lista de Professores</h2>
                    <div className="list-container-scrollable">
                        {professores.length > 0 ? (
                            professores.map((prof) => (
                                <div className="card mb-3" key={prof.ID}>
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5 className="card-title">{prof.nome}</h5>
                                            <p className="card-text">
                                                <strong>Email:</strong> {prof.email}<br />
                                                <strong>CPF:</strong> {prof.cpf}
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <button className="btn btn-primary mb-2" onClick={() => setEditingProfessor(prof)}>Editar</button>
                                            <button className="btn btn-danger" onClick={() => deletarProfessor(prof.ID)}>Deletar</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum professor encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Professores;
