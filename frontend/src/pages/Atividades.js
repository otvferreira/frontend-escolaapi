import React, { useState, useEffect } from 'react';
import AtividadeForm from '../components/AtividadeForm';
import './Atividades.css';

function Atividade() {
    const [atividades, setAtividades] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [editingAtividade, setEditingAtividade] = useState(null);

    // Fetch atividades and turmas from the API
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

    const adicionarAtividade = async (atividade) => {
        try {
            const response = await fetch('https://escolaapi-go-escola-api.up.railway.app/atividades/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(atividade),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar atividade');
            }

            const data = await response.json();
            setAtividades((prevAtividades) => [...prevAtividades, data]);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const editarAtividade = async (atividade) => {
        try {
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/atividades/alterar/${atividade.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(atividade),
            });

            if (!response.ok) {
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
            const response = await fetch(`https://escolaapi-go-escola-api.up.railway.app/atividades/deletar/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar atividade');
            }

            setAtividades((prevAtividades) => prevAtividades.filter((atv) => atv.ID !== id));
        } catch (error) {
            console.error('Erro:', error);
        }
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
                    />
                </div>
                <div className="atividades-list">
                    <h2>Lista de Atividades</h2>
                    <div className="list-container-scrollable">
                        {atividades.length > 0 ? (
                            atividades.map((atv) => (
                                <div className="card mb-3" key={atv.ID}>
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5 className="card-title">Turma: {atv.turmaID}</h5>
                                            <p className="card-text">
                                                <strong>Valor:</strong> {atv.valor}<br />
                                                <strong>Data:</strong> {atv.data}
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <button className="btn btn-primary mb-2" onClick={() => setEditingAtividade(atv)}>Editar</button>
                                            <button className="btn btn-danger" onClick={() => deletarAtividade(atv.ID)}>Deletar</button>
                                        </div>
                                    </div>
                                </div>
                            ))
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
