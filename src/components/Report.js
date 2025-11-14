// src/components/Report.js
import React, { useState } from 'react';
import api from '../services/api';
import './styles/Report.css'; // Se for criar um CSS específico

export default function Report() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]); // Dados do relatório
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setReportData([]); // Limpa dados anteriores

    if (!startDate || !endDate) {
      setError('Por favor, selecione a data de início e a data de fim.');
      setIsLoading(false);
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('A data de início não pode ser posterior à data de fim.');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Pega o token do gerente
      const response = await api.get('/reports/appointments', { // Nova rota da API
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportData(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
      console.error("Erro ao gerar relatório de agendamentos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar a data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Ajusta para o fuso horário local para evitar problemas com datas UTC
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return localDate.toLocaleDateString('pt-BR');
  };

  return (
    <div className="report-container modern-dashboard-section"> {/* Classe principal */}
      <h2 className="dashboard-title">Relatório de Agendamentos</h2>

      <form onSubmit={handleGenerateReport} className="modern-form report-form">
        <h3>Gerar Relatório por Período</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Data de Início:</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Data de Fim:</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>
        {/* Você poderia adicionar mais filtros aqui (ex: select para Barbeiro, select para Status) */}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Gerando...' : 'Gerar Relatório'}
        </button>
        {error && <p className="form-error" style={{marginTop: '15px'}}>{error}</p>}
      </form>

      <div className="report-results-section">
        <h3>Resultados do Relatório</h3>
        {isLoading && <p>Carregando relatório...</p>}
        {!isLoading && reportData.length === 0 && !error && <p className="empty-list-message">Nenhum agendamento encontrado para o período selecionado ou nenhum relatório gerado ainda.</p>}
        {!isLoading && reportData.length > 0 && (
          <table className="report-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Barbeiro</th>
                <th>Serviço</th>
                <th>Status</th>
                <th>Preço</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr key={item.AgendamentoID || item.id}> {/* Use a chave primária correta */}
                  <td>{formatDate(item.DataHoraAgendamento)}</td>
                  <td>{new Date(item.DataHoraAgendamento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{item.ClienteNome || item.cliente?.name || 'N/A'}</td>
                  <td>{item.BarbeiroNome || item.barbeiro?.name || 'N/A'}</td>
                  <td>{item.ServicoNome || item.servicoRealizado?.NomeServico || 'N/A'}</td>
                  <td>{item.StatusAgendamento || item.status}</td>
                  <td>R$ {parseFloat(item.PrecoServico || item.servicoRealizado?.Preco || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            {/* Poderia adicionar um rodapé com totais */}
          </table>
        )}
      </div>
    </div>
  );
}