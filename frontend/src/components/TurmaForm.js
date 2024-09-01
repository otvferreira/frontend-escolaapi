import React, { useState, useEffect } from 'react';

function TurmaForm({ onSubmit, initialValues, clearEdit }) {
    const [nome, setNome] = useState('');
    const [semestre, setSemestre] = useState('');
    const [ano, setAno] = useState('');
    const [professorID, setProfessorID] = useState('');

    useEffect(() => {
        if (initialValues) {
            setNome(initialValues.nome || '');
            setSemestre(initialValues.semestre || '');
            setAno(initialValues.ano || '');
            setProfessorID(initialValues.professorID || '');
        } else {
            clearForm();
        }
    }, [initialValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const turma = {
            ID: initialValues ? initialValues.ID : undefined,
            nome,
            semestre,
            ano,
            professorID,
        };
        onSubmit(turma);
        clearForm();
    };

    const handleCancel = () => {
        clearEdit();
        clearForm();
    };

    const clearForm = () => {
        setNome('');
        setSemestre('');
        setAno('');
        setProfessorID('');
    };

    return (
        <form className="turma-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="nome">Nome da Turma</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nome"
                        placeholder="Nome da Turma"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="semestre">Semestre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="semestre"
                        placeholder="Semestre"
                        value={semestre}
                        onChange={(e) => setSemestre(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="ano">Ano</label>
                    <input
                        type="text"
                        className="form-control"
                        id="ano"
                        placeholder="Ano"
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="professor">Professor</label>
                    <select
                        className="form-control"
                        id="professor"
                        value={professorID}
                        onChange={(e) => setProfessorID(e.target.value)}
                        required
                    >
                        <option value="">Selecione um professor</option>
                        {/* Populate with professor options from API */}
                    </select>
                </div>
            </div>
            <button
                className={`btn ${initialValues ? 'btn-primary' : 'btn-small'}`}
                type="submit"
            >
                {initialValues ? 'Atualizar' : 'Adicionar'} Turma
            </button>
            {initialValues && (
                <button className="btn btn-secondary ml-2" type="button" onClick={handleCancel}>
                    Cancelar
                </button>
            )}
        </form>
    );
}

export default TurmaForm;
