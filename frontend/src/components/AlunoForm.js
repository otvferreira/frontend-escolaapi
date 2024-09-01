import React, { useState, useEffect } from 'react';

function AlunoForm({ onSubmit, initialValues, clearEdit, turmas }) {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [selectedTurmas, setSelectedTurmas] = useState([]);

    useEffect(() => {
        if (initialValues) {
            setNome(initialValues.nome || '');
            setMatricula(initialValues.matricula || '');
            setSelectedTurmas(initialValues.turmas ? initialValues.turmas.split(',').map(id => parseInt(id, 10)) : []); // Atualiza com turmas selecionadas como números
        } else {
            clearForm();
        }
    }, [initialValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const aluno = {
            ID: initialValues ? initialValues.ID : undefined,
            nome,
            matricula,
            turmas: selectedTurmas.join(','), // Envia como uma string de IDs separados por vírgulas
        };
        onSubmit(aluno);
        clearForm(); // Limpa os campos após o envio
    };

    const handleCancel = () => {
        clearEdit(); // Chama a função do pai para sair do modo de edição
        clearForm(); // Limpa os campos
    };

    const handleCheckboxChange = (turmaId) => {
        setSelectedTurmas((prevTurmas) =>
            prevTurmas.includes(turmaId)
                ? prevTurmas.filter(id => id !== turmaId)
                : [...prevTurmas, turmaId]
        );
    };

    const clearForm = () => {
        setNome('');
        setMatricula('');
        setSelectedTurmas([]);
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
                    <div className="valid-tooltip">Tudo certo!</div>
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
                    <div className="valid-tooltip">Tudo certo!</div>
                </div>
                <div className="col-md-12 mb-3">
                    <label>Turmas</label>
                    <div className="turmas-checkboxes">
                        {turmas.map((turma) => (
                            <div key={turma.ID} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`turma-${turma.ID}`}
                                    checked={selectedTurmas.includes(turma.ID)}
                                    onChange={() => handleCheckboxChange(turma.ID)}
                                />
                                <label htmlFor={`turma-${turma.ID}`} className="ml-2">
                                    {turma.nome}
                                </label>
                            </div>
                        ))}
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
