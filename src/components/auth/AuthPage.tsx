import React, { useState } from 'react';
import { FormularioLogin } from './LoginForm';
import { RegistroForm } from './RegistroForm';

export const PaginaAutenticacion: React.FC = () => {
    const [esLogin, setEsLogin] = useState(true);

    return (
        <>
            {esLogin ? (
                <FormularioLogin onSwitchToRegister={() => setEsLogin(false)} />
            ) : (
                <RegistroForm onSwitchToLogin={() => setEsLogin(true)} />
            )}
        </>
    );
};