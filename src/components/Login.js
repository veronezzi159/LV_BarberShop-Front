// Em components/Login.js
import React, { useState } from 'react';
import api from '../services/api'; // Verifique se este caminho está correto e configurado para sua baseURL da API
import { saveToken } from '../utils/auth';
import './styles/Login.css'; // Seu CSS

export default function Login({ onLogin, onNavigateToRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form); // Rota da API
      saveToken(res.data.token); // Salva o token JWT
      // O backend agora envia user.role com o nome do perfil (ex: 'cliente')
      if (onLogin && typeof onLogin === 'function') {
        onLogin(res.data.user.role); // Passa o nome do perfil para App.js
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
    }
  };

  // Seu JSX do formulário de login (a estrutura que já tínhamos)
  return (
    <div className="login-page-container">
      <div className="login-art-section">
        <div className="geometric-art"></div>
        <h1>Bem-vindo de volta!</h1>
        <p>Acesse sua conta para continuar.</p>
      </div>
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-header-links">
            <span>Não tem uma conta?</span>
            {/* Se estiver usando o sistema de 'view' no App.js: */}
            <button type="button" onClick={onNavigateToRegister} className="link-style-button">
              Crie um perfil
            </button>
            {/* Se estiver usando react-router-dom:
            <Link to="/cadastro" className="link-style-button">Crie um perfil</Link>
            */}
          </div>
          <h2>Login</h2>
          <p className="login-subtitle">Tenha acesso exclusivo.</p>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit} className="login-actual-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Sua senha"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-options">
              {/* Link para esqueceu a senha */}
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}