import React, { useState, useEffect } from 'react';

function TurmaForm({ onSubmit, initialValues, clearEdit, professores }) {
    const [nome, setNome] = useState(initialValues ? initialValues.nome : '');
    const [semestre, setSemestre] = useState(initialValues ? initialValues.semestre : '');
    const [ano, setAno] = useState(initialValues ? initialValues.ano : '');
    const [professor_id, setProfessorId] = useState(initialValues ? initialValues.professor_id : '');

    // Adicione ID ao onSubmit
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            nome,
            semestre,
            ano,
            professor_id,
            ID: initialValues ? initialValues.ID : undefined, // Adiciona o ID se estiver editando
        });
    };

    useEffect(() => {
        if (initialValues) {
            setNome(initialValues.nome);
            setSemestre(initialValues.semestre);
            setAno(initialValues.ano);
            setProfessorId(initialValues.professor_id);
        }
    }, [initialValues]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nome</label>
                <input
                    type="text"
                    className="form-control"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Semestre</label>
                <input
                    type="text"
                    className="form-control"
                    value={semestre}
                    onChange={(e) => setSemestre(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Ano</label>
                <input
                    type="number"
                    className="form-control"
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Professor</label>
                <select
                    className="form-control"
                    value={professor_id || ''}
                    onChange={(e) => setProfessorId(parseInt(e.target.value))}
                    required
                >
                    <option value="">Selecione um professor</option>
                    {professores.map((prof) => (
                        <option key={prof.ID} value={prof.ID}>
                            {prof.nome}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="btn btn-primary">
                {initialValues ? 'Atualizar' : 'Adicionar'}
            </button>
            {initialValues && (
                <button type="button" className="btn btn-secondary" onClick={clearEdit}>
                    Cancelar
                </button>
            )}
        </form>
    );
}

export default TurmaForm;
