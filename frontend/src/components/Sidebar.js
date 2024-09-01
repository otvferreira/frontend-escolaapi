import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
                <span className="fs-4">Controle de Notas</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/professores" className="nav-link text-white">
                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#home" /></svg>
                        Professores
                    </Link>
                </li>
                <li>
                    <Link to="/turmas" className="nav-link text-white">
                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#speedometer2" /></svg>
                        Turmas
                    </Link>
                </li>
                <li>
                    <Link to="/alunos" className="nav-link text-white">
                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#table" /></svg>
                        Alunos
                    </Link>
                </li>
                <li>
                    <Link to="/atividades" className="nav-link text-white">
                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#grid" /></svg>
                        Atividades
                    </Link>
                </li>
                <li>
                    <Link to="/notas" className="nav-link text-white">
                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle" /></svg>
                        Notas
                    </Link>
                </li>
            </ul>
            <hr />
        </div>
    );
}

export default Sidebar;
