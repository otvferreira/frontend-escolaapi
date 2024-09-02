import React, { useState, useEffect } from 'react';

function AtividadeForm({ onSubmit, initialValues, clearEdit, turmas }) {
    const [turmaID, setTurmaID] = useState('');
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');
    const [error, setError] = useState('');

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
        if (valor > 100) {
            setError('O valor não pode ser maior que 100.');
            return;
        }
        const atividade = {
            turma_id: parseInt(turmaID, 10), // Converter para inteiro
            valor: parseFloat(valor), // Converter para número flutuante
            data: data
        };
        onSubmit(atividade);
        clearForm(); // Limpa os campos após o envio
        setError(''); // Limpa a mensagem de erro
    };

    const handleCancel = () => {
        clearEdit(); // Chama a função do pai para limpar o modo de edição
        clearForm(); // Limpa os campos
        setError(''); // Limpa a mensagem de erro
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
            {error && <p className="text-danger">{error}</p>}
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
