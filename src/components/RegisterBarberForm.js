// src/components/RegisterBarberForm.js
import React, { useState } from 'react';
import api from '../services/api';

// << 1. IMPORTE O ARQUIVO CSS ESPECÍFICO AQUI >>
import './styles/RegisterBarberForm.css'; // Ajuste este caminho se necessário

export default function RegisterBarberForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const barberData = {
      ...form,
      role: 'barbeiro',
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Sessão do gerente expirada ou inválida. Por favor, faça login novamente.');
        setIsLoading(false);
        return;
      }
      await api.post('/auth/register', barberData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Barbeiro cadastrado com sucesso!');
      setForm({ name: '', email: '', password: '' });
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // As classes definidas no CSS que você criou serão aplicadas aqui
    <div className="form-section register-barber-form-wrapper">
      <form onSubmit={handleSubmit} className="modern-form">
        <h3>Cadastrar Novo Barbeiro</h3>
        {error && <p className="form-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="barber-name">Nome do Barbeiro:</label>
          <input
            id="barber-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome completo do barbeiro"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="barber-email">Email:</label>
          <input
            id="barber-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@exemplo.com"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="barber-password">Senha Provisória:</label>
          <input
            id="barber-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Crie uma senha para o barbeiro"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar Barbeiro'}
          </button>
          {onCancel && typeof onCancel === 'function' && ( // Adicionada verificação se onCancel é função
            <button type="button" onClick={onCancel} className="cancel-button" disabled={isLoading}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}