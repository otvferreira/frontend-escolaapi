import React, { useState, useEffect } from 'react';
import AlunoForm from '../components/AlunoForm';
import './Alunos.css';

function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [editingAluno, setEditingAluno] = useState(null);

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

    const adicionarAluno = async (aluno) => {
        try {
            const alunoData = {
                nome: aluno.nome,
                matricula: aluno.matricula,
                turmas: aluno.turmas, // Deve ser uma string de IDs das turmas separados por vírgulas
            };

            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/alunos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alunoData),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Erro ao adicionar aluno:', error);
                throw new Error('Erro ao adicionar aluno');
            }

            const data = await response.json();
            setAlunos((prevAlunos) => [...prevAlunos, data]);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

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
                prevAlunos.map((al) => (al.ID === data.ID ? data : al))
            );
            setEditingAluno(null);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const deletarAluno = async (id) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/alunos/deletar/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar aluno');
            }

            setAlunos((prevAlunos) => prevAlunos.filter((al) => al.ID !== id));
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    useEffect(() => {
        fetchAlunos();
        fetchTurmas();
    }, []);

    // Função para obter os nomes das turmas a partir dos IDs
    const getTurmasNames = (turmaIds) => {
        const turmasMap = new Map(turmas.map(turma => [turma.ID, turma.nome]));
        return turmaIds.map(id => turmasMap.get(id)).filter(name => name).join(', ');
    };

    return (
        <div>
            <h1>Gerenciar Alunos</h1>
            <div className="alunos-container">
                <div className="aluno-form-container">
                    <AlunoForm
                        onSubmit={editingAluno ? editarAluno : adicionarAluno}
                        initialValues={editingAluno}
                        clearEdit={() => setEditingAluno(null)}
                        turmas={turmas}
                    />
                </div>
                <div className="alunos-list">
                    <h2>Lista de Alunos</h2>
                    <div className="list-container-scrollable">
                        {alunos.length > 0 ? (
                            alunos.map((al) => (
                                <div className="card mb-3" key={al.ID}>
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5 className="card-title">{al.nome}</h5>
                                            <p className="card-text">
                                                <strong>Matrícula:</strong> {al.matricula}<br />
                                                <strong>Turmas:</strong> {getTurmasNames(al.turmas ? al.turmas.split(',').map(id => parseInt(id, 10)) : [])}
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-warning mr-2"
                                                onClick={() => setEditingAluno(al)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => deletarAluno(al.ID)}
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Não há alunos cadastrados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Alunos;
