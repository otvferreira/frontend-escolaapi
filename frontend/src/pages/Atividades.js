import React, { useState, useEffect } from 'react';
import AtividadeForm from '../components/AtividadeForm';
import './Atividades.css';

function Atividade() {
    const [atividades, setAtividades] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [editingAtividade, setEditingAtividade] = useState(null);

    const fetchAtividades = async () => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/atividades');
            if (!response.ok) {
                throw new Error('Erro ao buscar atividades');
            }
            const result = await response.json();
            
            if (Array.isArray(result.data)) {
                setAtividades(result.data);
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

    const validarSomaAtividades = (turmaID, valor, atividadeID) => {
        const total = atividades
            .filter(atv => atv.turma_id === turmaID && atv.ID !== atividadeID)
            .reduce((acc, atv) => acc + atv.valor, 0);

        return total + valor <= 100;
    };

    const adicionarAtividade = async (atividade) => {
        if (!validarSomaAtividades(atividade.turma_id, atividade.valor, null)) {
            alert('A soma das atividades da mesma turma não pode ultrapassar 100 pontos.');
            return;
        }

        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/atividades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(atividade),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao adicionar atividade:', errorText);
                throw new Error('Erro ao adicionar atividade');
            }
    
            const data = await response.json();
            setAtividades((prevAtividades) => [...prevAtividades, data]);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const editarAtividade = async (atividade) => {
        if (!validarSomaAtividades(atividade.turma_id, atividade.valor, atividade.ID)) {
            alert('A soma das atividades da mesma turma não pode ultrapassar 100 pontos.');
            return;
        }

        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/atividades/${atividade.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(atividade),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao editar atividade:', errorText);
                throw new Error('Erro ao editar atividade');
            }

            const data = await response.json();
            setAtividades((prevAtividades) =>
                prevAtividades.map((atv) => (atv.ID === data.ID ? data : atv))
            );
            setEditingAtividade(null);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const deletarAtividade = async (id) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/atividades/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao deletar atividade:', errorText);
                throw new Error('Erro ao deletar atividade');
            }

            setAtividades((prevAtividades) => prevAtividades.filter((atv) => atv.ID !== id));
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const formatarData = (data) => {
        if (!data) return 'Data não especificada';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    useEffect(() => {
        fetchAtividades();
        fetchTurmas();
    }, []);

    return (
        <div>
            <h1>Gerenciar Atividades</h1>
            <div className="atividade-container">
                <div className="atividade-form-container">
                    <AtividadeForm
                        onSubmit={editingAtividade ? editarAtividade : adicionarAtividade}
                        initialValues={editingAtividade}
                        clearEdit={() => setEditingAtividade(null)}
                        turmas={turmas}
                        atividades={atividades}
                    />
                </div>
                <div className="atividades-list">
                    <h2>Lista de Atividades</h2>
                    <div className="list-container-scrollable">
                        {atividades.length > 0 ? (
                            atividades.map((atv) => {
                                const turma = turmas.find(turma => turma.ID === atv.turma_id);
                                return (
                                    <div className="card mb-3" key={atv.ID}>
                                        <div className="card-body d-flex align-items-center justify-content-between">
                                            <div>
                                                <h5 className="card-title">
                                                    Turma: {turma ? turma.nome : 'Desconhecida'}
                                                </h5>
                                                <p className="card-text">
                                                    <strong>Valor:</strong> {atv.valor !== undefined ? atv.valor : 'Não especificado'}<br />
                                                    <strong>Data:</strong> {formatarData(atv.data)}
                                                </p>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <button className="btn btn-primary mb-2" onClick={() => setEditingAtividade(atv)}>Editar</button>
                                                <button className="btn btn-danger" onClick={() => deletarAtividade(atv.ID)}>Deletar</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Nenhuma atividade encontrada.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Atividade;
