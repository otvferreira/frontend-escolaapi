import React, { useState, useEffect } from 'react';

function NotasForm({ onSubmit, turmas, atividades, alunos, clearEdit, initialValues, setSelectedTurma, setSelectedAtividade }) {
    const [turma, setTurma] = useState('');
    const [atividade, setAtividade] = useState('');
    const [notas, setNotas] = useState([]);
    const [atividadesFiltradas, setAtividadesFiltradas] = useState([]);

    useEffect(() => {
        if (turma && atividade) {
            const turmaID = parseInt(turma, 10);
            const alunosMatriculados = alunos.filter(aluno => aluno.turmas.split(',').map(id => parseInt(id, 10)).includes(turmaID));
            setNotas(alunosMatriculados.map(aluno => ({
                alunoID: aluno.ID,
                alunoNome: aluno.nome,
                valor: ''
            })));
        }
    }, [turma, atividade, alunos]);

    useEffect(() => {
        if (initialValues) {
            setTurma(initialValues.turma);
            setAtividade(initialValues.atividade);
            setNotas(initialValues.notas);
        }
    }, [initialValues]);

    useEffect(() => {
        const turmaID = parseInt(turma, 10);
        if (turmaID) {
            setAtividadesFiltradas(atividades.filter(atividade => atividade.turma_id === turmaID));
        } else {
            setAtividadesFiltradas([]);
        }
    }, [turma, atividades]);

    const handleTurmaChange = (e) => {
        const value = e.target.value;
        setTurma(value);
        setSelectedTurma(value); // Atualiza o valor selecionado

        // Limpa a atividade somente quando a turma muda
        if (atividade && value) {
            setAtividade('');
        }
    };

    const handleAtividadeChange = (e) => {
        const value = e.target.value;
        setAtividade(value);
        setSelectedAtividade(value); // Atualiza o valor selecionado
    };

    const handleNotaChange = (index, value) => {
        // Encontre a atividade selecionada usando seu ID
        const atividadeSelecionada = atividadesFiltradas.find((atv) => atv.ID === parseInt(atividade, 10));
        
        // Obtenha o valor máximo da atividade selecionada
        const valorMaximo = atividadeSelecionada ? atividadeSelecionada.valor : 0; // Define o valor máximo para a nota com base na atividade
    
        // Valida se o valor da nota não excede o valor máximo da atividade
        if (parseFloat(value) > valorMaximo) {
            alert(`A nota não pode ser maior que o valor máximo da atividade: ${valorMaximo}`);
            return;
        }
    
        // Atualize o estado das notas
        setNotas(prevNotas =>
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
            notas: notas.map(nota => ({
                aluno_id: nota.alunoID,
                atividade_id: parseInt(atividade, 10),
                nota: parseFloat(nota.valor) || 0,
            })),
        };

        onSubmit(notasData);
        clearForm(); // Clear fields after submit
    };

    const handleCancel = () => {
        clearEdit(); // Call parent function to clear edit mode
        clearForm(); // Clear fields
    };

    const clearForm = () => {
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
                        onChange={handleTurmaChange} // Atualiza o valor e chama a função pai
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
                        onChange={handleAtividadeChange} // Atualiza o valor e chama a função pai
                        required
                    >
                        <option value="">Selecione a atividade</option>
                        {atividadesFiltradas.map((atividade) => (
                            <option key={atividade.ID} value={atividade.ID}>
                                {atividade.nome} - {atividade.valor} pontos
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-12 mb-3 notas-scrollable">
                {notas.map((nota, index) => (
                    <div className="nota-item" key={index}>
                        <span>{nota.alunoNome}</span>
                        <input
                            type="number"
                            value={nota.valor}
                            onChange={(e) => handleNotaChange(index, e.target.value)}
                            min="0"
                            max={atividadesFiltradas.find((atv) => atv.ID === parseInt(atividade, 10))?.valor || 0}
                            style={{ width: '5rem' }}
                        />
                    </div>
                ))}
            </div>
            </div>
            <button type="submit" className="btn btn-primary">Salvar</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
        </form>
    );
}

export default NotasForm;
