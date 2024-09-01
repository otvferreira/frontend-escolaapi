import React, { useState, useEffect } from 'react';
import './Alunos.css'; // Importa o arquivo de estilos

function AlunoForm({ onSubmit, initialValues, clearEdit }) {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState('');

    useEffect(() => {
        if (initialValues) {
            setNome(initialValues.nome || '');
            setMatricula(initialValues.matricula || '');
            setTurmaSelecionada(initialValues.turma || '');
        } else {
            clearForm();
        }

        // Fetch turmas for select dropdown
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

        fetchTurmas();
    }, [initialValues, clearForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const aluno = {
            ID: initialValues ? initialValues.ID : undefined,
            nome,
            matricula,
            turma: turmaSelecionada,
        };
        onSubmit(aluno);
        clearForm(); // Clear fields after submit
    };

    const handleCancel = () => {
        clearEdit(); // Call parent function to clear edit mode
        clearForm(); // Clear fields
    };

    const clearForm = () => {
        setNome('');
        setMatricula('');
        setTurmaSelecionada('');
    };

    return (
        <form className="aluno-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nome"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <div className="valid-tooltip">
                        Tudo certo!
                    </div>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="matricula">Matrícula</label>
                    <input
                        type="text"
                        className="form-control"
                        id="matricula"
                        placeholder="Matrícula"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        required
                    />
                    <div className="valid-tooltip">
                        Tudo certo!
                    </div>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="turma">Turma</label>
                    <select
                        className="form-control"
                        id="turma"
                        value={turmaSelecionada}
                        onChange={(e) => setTurmaSelecionada(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma turma</option>
                        {turmas.map((turma) => (
                            <option key={turma.ID} value={turma.ID}>
                                {turma.nome} - {turma.semestre}/{turma.ano}
                            </option>
                        ))}
                    </select>
                    <div className="valid-tooltip">
                        Tudo certo!
                    </div>
                </div>
            </div>
            <button
                className={`btn ${initialValues ? 'btn-primary' : 'btn-small'}`}
                type="submit"
            >
                {initialValues ? 'Atualizar' : 'Adicionar'} Aluno
            </button>
            {initialValues && (
                <button className="btn btn-secondary ml-2" type="button" onClick={handleCancel}>
                    Cancelar
                </button>
            )}
        </form>
    );
}

export default AlunoForm;
