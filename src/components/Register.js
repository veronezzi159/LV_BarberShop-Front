import React, { useState } from 'react';
import api from '../services/api';
import './styles/Register.css'; // Certifique-se de que este arquivo CSS existe e está sendo importado
// import { Link, useNavigate } from 'react-router-dom';

export default function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    // O campo 'role' não é mais necessário no estado do formulário aqui,
    // pois será fixo como 'cliente'.
  });
  const [error, setError] = useState('');
  // const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Adiciona o role 'cliente' aos dados do formulário antes de enviar
      const formData = { ...form, role: 'cliente' };
      await api.post('/auth/register', formData); // Envia formData com o role fixo

      alert('Cadastro realizado com sucesso! Faça login.');
      if (onRegister && typeof onRegister === 'function') {
        onRegister();
      }
      // navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-art-section">
        <h1>Crie Sua Conta de Cliente</h1> {/* Texto pode ser ajustado */}
        <p>Junte-se à nossa barbearia e agende seus horários com facilidade.</p>
      </div>
      <div className="register-form-section">
        <div className="register-form-wrapper">
          <div className="register-header-links">
            <span>Já tem uma conta?</span>
            <a href="/login">Faça Login</a> {/* Ou <Link to="/login">Faça Login</Link> */}
          </div>
          <h2>Cadastro de Cliente</h2> {/* Título ajustado */}
          <p className="register-subtitle">Preencha os campos abaixo para criar seu perfil.</p>
          {error && <p className="register-error">{error}</p>}
          <form onSubmit={handleSubmit} className="register-actual-form">
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome completo"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
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
                name="password"
                type="password"
                placeholder="Crie uma senha"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {/* O campo de seleção de 'role' foi REMOVIDO daqui */}
            <button type="submit" className="register-button">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}