import React, { useState, useEffect } from 'react';

function AtividadeForm({ onSubmit, initialValues, clearEdit, turmas }) {
    const [turmaID, setTurmaID] = useState('');
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');

    useEffect(() => {
        if (initialValues) {
            setTurmaID(initialValues.turma_id || '');
            setValor(initialValues.valor || '');
            setData(initialValues.data || '');
        } else {
            clearForm();
        }
    }, [initialValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const atividade = {
            turma_id: parseInt(turmaID, 10), // Converter para inteiro
            valor: parseFloat(valor), // Converter para número flutuante
            data: data
        };
        onSubmit(atividade);
        clearForm(); // Clear fields after submit
    };

    const handleCancel = () => {
        clearEdit(); // Call parent function to clear edit mode
        clearForm(); // Clear fields
    };

    const clearForm = () => {
        setTurmaID('');
        setValor('');
        setData('');
    };

    return (
        <form className="atividade-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="turmaID">Turma</label>
                    <select
                        id="turmaID"
                        className="form-control"
                        value={turmaID}
                        onChange={(e) => setTurmaID(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma turma</option>
                        {turmas.map((turma) => (
                            <option key={turma.ID} value={turma.ID}>
                                {turma.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="valor">Valor</label>
                    <input
                        type="number"
                        className="form-control"
                        id="valor"
                        placeholder="Valor da atividade"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="data">Data</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        required
                    />
                </div>
            </div>
            <button
                className={`btn ${initialValues ? 'btn-primary' : 'btn-small'}`}
                type="submit"
            >
                {initialValues ? 'Atualizar' : 'Adicionar'} Atividade
            </button>
            {initialValues && (
                <button className="btn btn-secondary ml-2" type="button" onClick={handleCancel}>
                    Cancelar
                </button>
            )}
        </form>
    );
}

export default AtividadeForm;
