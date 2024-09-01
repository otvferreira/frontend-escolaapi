import React, { useState, useEffect } from 'react';

function ProfessorForm({ onSubmit, initialValues, clearEdit }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');

    useEffect(() => {
        if (initialValues) {
            setNome(initialValues.nome || '');
            setEmail(initialValues.email || '');
            setCpf(initialValues.cpf || '');
        } else {
            clearForm();
        }
    }, [initialValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const professor = {
            ID: initialValues ? initialValues.ID : undefined,
            nome,
            email,
            cpf,
        };
        onSubmit(professor);
        clearForm(); // Clear fields after submit
    };

    const handleCancel = () => {
        clearEdit(); // Call parent function to clear edit mode
        clearForm(); // Clear fields
    };

    const clearForm = () => {
        setNome('');
        setEmail('');
        setCpf('');
    };

    return (
        <form className="professor-form" onSubmit={handleSubmit}>
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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="valid-tooltip">
                        Tudo certo!
                    </div>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="cpf">CPF</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cpf"
                        placeholder="CPF"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                    />
                    <div className="valid-tooltip">
                        Tudo certo!
                    </div>
                </div>
            </div>
            <button
                className={`btn ${initialValues ? 'btn-primary' : 'btn-small'}`}
                type="submit"
            >
                {initialValues ? 'Atualizar' : 'Adicionar'} Professor
            </button>
            {initialValues && (
                <button className="btn btn-secondary ml-2" type="button" onClick={handleCancel}>
                    Cancelar
                </button>
            )}
        </form>
    );
}

export default ProfessorForm;
