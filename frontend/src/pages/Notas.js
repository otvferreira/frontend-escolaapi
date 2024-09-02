import React, { useState, useEffect } from 'react';
import NotasForm from '../components/NotasForm';
import './Notas.css';

function Notas() {
    const [turmas, setTurmas] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [notas, setNotas] = useState([]);
    const [editingNota, setEditingNota] = useState(null);
    const [selectedTurma, setSelectedTurma] = useState('');
    const [selectedAtividade, setSelectedAtividade] = useState('');

    const [alunoMap, setAlunoMap] = useState({}); // Mapa para IDs de alunos e nomes

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

    const fetchAlunos = async () => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/alunos');
            if (!response.ok) {
                throw new Error('Erro ao buscar alunos');
            }
            const result = await response.json();
            const alunosData = result.data || [];
            setAlunos(alunosData);

            // Cria um mapa para fácil acesso ao nome do aluno pelo ID
            const alunoMap = alunosData.reduce((map, aluno) => {
                map[aluno.ID] = aluno.nome;
                return map;
            }, {});
            setAlunoMap(alunoMap);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const fetchNotas = async (turmaID, atividadeID) => {
        if (!turmaID || !atividadeID) {
            console.error('Parâmetros de turma ou atividade não fornecidos.');
            return;
        }

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

    const buscarNotas = () => {
        console.log('Selected Turma ID:', selectedTurma);
        console.log('Selected Atividade ID:', selectedAtividade);

        if (selectedTurma && selectedAtividade) {
            fetchNotas(selectedTurma, selectedAtividade);
        } else {
            console.error('Por favor, selecione a turma e a atividade antes de buscar.');
        }
    };

    const adicionarNotas = async (notasData) => {
        console.log('Dados das notas a serem enviados:', notasData);

        try {
            for (const nota of notasData.notas) {
                const notaPayload = {
                    turma_id: parseInt(notasData.turma, 10),
                    atividade_id: parseInt(notasData.atividade, 10),
                    aluno_id: parseInt(nota.aluno_id, 10),
                    nota: parseFloat(nota.nota) || 0,
                };

                console.log('Enviando payload:', JSON.stringify(notaPayload));

                const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/notas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(notaPayload),
                });

                if (!response.ok) {
                    throw new Error(`Erro ao adicionar nota para aluno ${nota.alunoNome}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(`Nota adicionada com sucesso para aluno ${nota.alunoNome}:`, data);
            }

            // Recarregar notas após adição
            buscarNotas();
        } catch (error) {
            console.error(error);
        }
    };

    const alterarNota = async (notaID, novaNota) => {
        if (!selectedTurma || !selectedAtividade) {
            console.error('Parâmetros de turma ou atividade não fornecidos.');
            return;
        }

        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/notas/alterar/${notaID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nota: parseFloat(novaNota) || 0 }),
            });

            if (!response.ok) {
                throw new Error('Erro ao alterar nota');
            }

            console.log(`Nota com ID ${notaID} alterada com sucesso`);
            // Atualiza a lista de notas após a alteração
            buscarNotas();
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const deletarNota = async (notaID) => {
        if (!selectedTurma || !selectedAtividade) {
            console.error('Parâmetros de turma ou atividade não fornecidos.');
            return;
        }

        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/notas/deletar/${notaID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar nota');
            }

            console.log(`Nota com ID ${notaID} deletada com sucesso`);
            // Atualiza a lista de notas após a exclusão
            buscarNotas();
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    useEffect(() => {
        fetchTurmas();
        fetchAtividades();
        fetchAlunos();
    }, []);

    return (
        <div className="notas-container">
            <h1>Gerenciar Notas</h1>
            <div className="notas-form-container">
                <NotasForm
                    onSubmit={adicionarNotas}
                    turmas={turmas}
                    atividades={atividades}
                    alunos={alunos}
                    clearEdit={() => setEditingNota(null)}
                    initialValues={editingNota ? { turma: editingNota.turma, atividade: editingNota.atividade, notas } : null}
                    setSelectedTurma={setSelectedTurma}
                    setSelectedAtividade={setSelectedAtividade}
                />
            </div>
            <div className="buscar-notas">
                <button className="btn btn-primary" onClick={buscarNotas}>
                    Buscar Notas
                </button>
            </div>
            <div className="notas-list">
                <h2>Lista de Notas</h2>
                <div className="list-container-scrollable">
                    {notas.length > 0 ? (
                        notas.map((nota) => (
                            <div className="card mb-3" key={nota.ID}>
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div>
                                        <h5 className="card-title">{alunoMap[nota.aluno_id] || 'Nome do aluno não encontrado'}</h5>
                                        <p className="card-text">
                                            <strong>Nota:</strong> {nota.nota} <br />
                                            <strong>Atividade ID:</strong> {nota.atividade_id} <br />
                                            <strong>Aluno:</strong> {nota.aluno_id} <br />
                                            <strong>Turma ID:</strong> {nota.turma_id}
                                        </p>
                                    </div>
                                    <div>
                                        {editingNota && editingNota.ID === nota.ID ? (
                                            <div>
                                                <input
                                                    type="number"
                                                    value={editingNota.novaNota || ''}
                                                    onChange={(e) => setEditingNota(prev => ({ ...prev, novaNota: e.target.value }))}
                                                    min="0"
                                                    max="100"
                                                    style={{ width: '5rem' }}
                                                />
                                                <button
                                                    className="btn btn-success ml-2"
                                                    onClick={() => {
                                                        alterarNota(nota.ID, editingNota.novaNota);
                                                        setEditingNota(null);
                                                    }}
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    className="btn btn-secondary ml-2"
                                                    onClick={() => setEditingNota(null)}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button
                                                    className="btn btn-secondary mr-2"
                                                    onClick={() => setEditingNota({ ID: nota.ID, novaNota: nota.nota })}
                                                >
                                                    Alterar Nota
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => deletarNota(nota.ID)}
                                                >
                                                    Deletar
                                                </button>
                                            </div>
                                        )}
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
