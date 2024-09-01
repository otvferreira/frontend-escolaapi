import React, { useState, useEffect } from 'react';
import AlunoForm from '../components/AlunoForm';
import './Alunos.css';

function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const [editingAluno, setEditingAluno] = useState(null);

    // Função para buscar alunos
    const fetchAlunos = async () => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/alunos');
            if (!response.ok) {
                throw new Error('Erro ao buscar alunos');
            }
            const result = await response.json();
            if (Array.isArray(result.data)) {
                setAlunos(result.data);
            } else {
                console.error('Os dados retornados não são um array:', result.data);
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para adicionar aluno
    const adicionarAluno = async (aluno) => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/alunos/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar aluno');
            }

            const data = await response.json();
            setAlunos((prevAlunos) => [...prevAlunos, data]);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para editar aluno
    const editarAluno = async (aluno) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/alunos/alterar/${aluno.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            });

            if (!response.ok) {
                throw new Error('Erro ao editar aluno');
            }

            const data = await response.json();
            setAlunos((prevAlunos) =>
                prevAlunos.map((alu) => (alu.ID === data.ID ? data : alu))
            );
            setEditingAluno(null);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para deletar aluno
    const deletarAluno = async (id) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/alunos/deletar/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar aluno');
            }

            setAlunos((prevAlunos) => prevAlunos.filter((alu) => alu.ID !== id));
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Efeito para buscar alunos ao montar o componente
    useEffect(() => {
        fetchAlunos();
    }, []);

    return (
        <div className="alunos-container">
            <h1>Gerenciar Alunos</h1>
            <div className="aluno-form-container">
                <AlunoForm
                    onSubmit={editingAluno ? editarAluno : adicionarAluno}
                    initialValues={editingAluno}
                    clearEdit={() => setEditingAluno(null)}
                />
            </div>
            <div className="alunos-list">
                <h2>Lista de Alunos</h2>
                <div className="list-container-scrollable">
                    {alunos.length > 0 ? (
                        alunos.map((alu) => (
                            <div className="card mb-3" key={alu.ID}>
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div>
                                        <h5 className="card-title">{alu.nome}</h5>
                                        <p className="card-text">
                                            <strong>Matrícula:</strong> {alu.matricula}<br />
                                            <strong>Turma:</strong> {alu.turma} {/* Se necessário, ajuste para mostrar o nome da turma */}
                                        </p>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <button className="btn btn-primary mb-2" onClick={() => setEditingAluno(alu)}>Editar</button>
                                        <button className="btn btn-danger" onClick={() => deletarAluno(alu.ID)}>Deletar</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum aluno encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Alunos;
