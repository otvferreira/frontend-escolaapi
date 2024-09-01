import React, { useState, useEffect } from 'react';

function NotasForm({ onSubmit, turmas, atividades, clearEdit, initialValues }) {
    const [turma, setTurma] = useState('');
    const [atividade, setAtividade] = useState('');
    const [notas, setNotas] = useState([]);

    useEffect(() => {
        if (initialValues) {
            setTurma(initialValues.turma || '');
            setAtividade(initialValues.atividade || '');
            setNotas(initialValues.notas || []);
        } else {
            clearForm();
        }
    }, [initialValues]);

    const handleNotaChange = (index, value) => {
        setNotas((prevNotas) =>
            prevNotas.map((nota, i) =>
                i === index ? { ...nota, valor: value } : nota
            )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const notasData = {
            turma,
            atividade,
            notas,
        };
        onSubmit(notasData);
        clearForm(); // Clear fields after submit
    };

    const handleCancel = () => {
        clearEdit(); // Call parent function to clear edit mode
        clearForm(); // Clear fields
    };

    const clearForm = () => {
        setTurma('');
        setAtividade('');
        setNotas([]);
    };

    return (
        <form className="notas-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="turma">Turma</label>
                    <select
                        id="turma"
                        className="form-control"
                        value={turma}
                        onChange={(e) => setTurma(e.target.value)}
                        required
                    >
                        <option value="">Selecione a turma</option>
                        {turmas.map((turma) => (
                            <option key={turma.ID} value={turma.ID}>
                                {turma.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="atividade">Atividade</label>
                    <select
                        id="atividade"
                        className="form-control"
                        value={atividade}
                        onChange={(e) => setAtividade(e.target.value)}
                        required
                    >
                        <option value="">Selecione a atividade</option>
                        {atividades.map((atividade) => (
                            <option key={atividade.ID} value={atividade.ID}>
                                {atividade.nome} - {atividade.valor} pontos
                            </option>
                        ))}
                    </select>
                </div>
                {notas.map((nota, index) => (
                    <div className="col-md-12 mb-3" key={index}>
                        <label htmlFor={`nota-${index}`}>Nota para {nota.alunoNome}</label>
                        <input
                            type="number"
                            className="form-control"
                            id={`nota-${index}`}
                            placeholder={`Nota para ${nota.alunoNome}`}
                            value={nota.valor || ''}
                            onChange={(e) => handleNotaChange(index, e.target.value)}
                            min="0"
                            max="100"
                            required
                        />
                    </div>
                ))}
            </div>
            <button
                className={`btn ${initialValues ? 'btn-primary' : 'btn-small'}`}
                type="submit"
            >
                {initialValues ? 'Atualizar' : 'Adicionar'} Notas
            </button>
            {initialValues && (
                <button className="btn btn-secondary ml-2" type="button" onClick={handleCancel}>
                    Cancelar
                </button>
            )}
        </form>
    );
}

export default NotasForm;
