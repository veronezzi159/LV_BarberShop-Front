import React, { useState, useEffect } from 'react';
import api from '../services/api';
// Adicione a importação do seu CSS para este componente, se houver
import './styles/ClientDashboard.css';

export default function ClientDashboard({ onLogout }) { // Adicione onLogout se o cliente puder sair daqui
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ barberId: '', serviceId: '', date: '', observacoesCliente: '' }); // Adicionei observacoesCliente
  const [isLoading, setIsLoading] = useState(false); // Para feedback de loading geral ou por seção
  const [error, setError] = useState(''); // Para erros no formulário de agendamento
  const [appointmentsError, setAppointmentsError] = useState(''); // Para erros ao buscar agendamentos

  const formatDate = (dateString) => { // Função de formatação de data
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return `${localDate.toLocaleDateString('pt-BR')} às ${localDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const fetchInitialData = async () => {
    setIsLoading(true);
    setAppointmentsError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Lidar com token ausente, talvez redirecionar para login
        setAppointmentsError("Sessão inválida. Por favor, faça login novamente.");
        setIsLoading(false);
        return;
      }

      const [barbersRes, servicesRes, appointmentsRes] = await Promise.all([
        api.get('/users/barbers', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/services', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/appointments/my-as-client', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      console.log("ClientDashboard: Barbeiros recebidos:", barbersRes.data);
      setBarbers(barbersRes.data);
      console.log("ClientDashboard: Serviços recebidos:", servicesRes.data);
      setServices(servicesRes.data);
      console.log("ClientDashboard: Meus agendamentos recebidos:", appointmentsRes.data);
      setAppointments(appointmentsRes.data);

    } catch (err) {
      console.error("Erro ao buscar dados do ClientDashboard:", err);
      setAppointmentsError('Falha ao carregar dados. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);


  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if(error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.barberId || !form.serviceId || !form.date) {
        setError("Barbeiro, serviço e data/hora são obrigatórios.");
        return;
    }
    if (new Date(form.date) < new Date()) {
        setError("A data e hora do agendamento não podem ser no passado.");
        return;
    }

    setIsLoading(true); // Indica que o agendamento está sendo processado
    try {
      const token = localStorage.getItem('token');
      const appointmentData = {
        BarbeiroID: form.barberId,
        ServicoID: form.serviceId,
        DataHoraAgendamento: form.date,
        ObservacoesCliente: form.observacoesCliente
      };
      await api.post('/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Agendamento solicitado com sucesso! Aguarde a confirmação.');
      fetchInitialData(); // Recarrega todos os dados, incluindo os novos agendamentos
      setForm({ barberId: '', serviceId: '', date: '', observacoesCliente: '' });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Erro desconhecido ao agendar.';
      setError(errMsg);
      console.error("Erro ao agendar:", err);
    } finally {
        setIsLoading(false);
    }
  };

  // Função para cancelar agendamento (se o cliente puder cancelar)
  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        // Você precisará de uma rota no backend para o cliente cancelar,
        // ex: PATCH /api/appointments/:id/cancel-by-client
        await api.patch(`/appointments/${appointmentId}/status`, { status: 'CanceladoCliente' }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Agendamento cancelado.");
        fetchInitialData(); // Recarrega os dados
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || 'Erro ao cancelar agendamento.';
        alert(errMsg);
        console.error("Erro ao cancelar agendamento:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };


  return (
    <div className="client-dashboard-container modern-dashboard-section"> {/* Adicione classes CSS aqui */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Painel do Cliente</h2>
       {/* VVVV --- BOTÃO DE SAIR ADICIONADO AQUI --- VVVV */}
        {onLogout && (
          <button onClick={onLogout} className="logout-button-header-client">
            Sair
          </button>
        )}
        {/* ^^^^ --- BOTÃO DE SAIR ADICIONADO AQUI --- ^^^^ */}
      </div>


      <div className="form-section client-booking-form-wrapper">
        <h3>Agendar Novo Horário</h3>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group">
            <label htmlFor="barberId">Barbeiro:</label>
            <select id="barberId" name="barberId" value={form.barberId} onChange={handleChange} required disabled={isLoading}>
              <option value="">Escolha um barbeiro</option>
              {barbers.map(b => (
                // Use as propriedades corretas retornadas pela API /api/users/barbers
                // Se a API retorna UsuarioID e name (minúsculo):
                <option key={b.UsuarioID || b.id} value={b.UsuarioID || b.id}>{b.name || b.Nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="serviceId">Serviço:</label>
            <select id="serviceId" name="serviceId" value={form.serviceId} onChange={handleChange} required disabled={isLoading}>
              <option value="">Escolha um serviço</option>
              {services.map(s => (
                // Use as propriedades corretas retornadas pela API /api/services
                // Se a API retorna ServicoID, NomeServico, Preco:
                <option key={s.ServicoID || s.id} value={s.ServicoID || s.id}>
                  {s.NomeServico || s.name} - R$ {parseFloat(s.Preco || s.price).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Data e Hora:</label>
            <input id="date" type="datetime-local" name="date" value={form.date} onChange={handleChange} required disabled={isLoading} />
          </div>

          <div className="form-group">
            <label htmlFor="observacoesCliente">Observações (Opcional):</label>
            <textarea
                id="observacoesCliente"
                name="observacoesCliente"
                value={form.observacoesCliente}
                onChange={handleChange}
                rows="3"
                placeholder="Alguma preferência ou informação adicional?"
                disabled={isLoading}
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Agendando...' : 'Solicitar Agendamento'}
          </button>
        </form>
      </div>

      <div className="appointments-section client-appointments-list">
        <h3>Meus Agendamentos</h3>
        {isLoading && appointments.length === 0 && <p className="loading-message">Carregando seus agendamentos...</p>}
        {appointmentsError && <p className="form-error">{appointmentsError}</p>}
        {!isLoading && appointments.length === 0 && !appointmentsError && (
          <p className="empty-list-message">Você ainda não possui agendamentos.</p>
        )}
        {appointments.length > 0 && (
          <ul className="appointments-list-ul"> {/* Use a classe do BarberDashboard se o estilo for o mesmo */}
            {appointments.map(appt => {
              const appointmentId = appt.AgendamentoID || appt.id;
              const currentStatus = appt.status; // << USA 'status' minúsculo

              return (
                <li key={appointmentId} className={`appointment-item status-${currentStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="appointment-details">
                    <p><strong>Data:</strong> {formatDate(appt.DataHoraAgendamento)}</p>
                    <p><strong>Serviço:</strong> {appt.servicoRealizado?.NomeServico || 'N/A'}</p>
                    <p><strong>Barbeiro:</strong> {appt.barbeiro?.name || appt.barbeiro?.Nome || 'N/A'}</p>
                    <p><strong>Status:</strong> <span className="status-badge">{currentStatus || 'N/D'}</span></p>
                    {appt.ObservacoesCliente && <p className="observation-text client-obs"><em>Sua Obs.: {appt.ObservacoesCliente}</em></p>}
                    {appt.ObservacoesBarbeiro && <p className="observation-text barber-obs"><em>Obs. Barbeiro: {appt.ObservacoesBarbeiro}</em></p>}
                  </div>
                  <div className="appointment-actions">
                    {(currentStatus === 'Pendente' || currentStatus === 'Aprovado') && (
                        // Adicione uma lógica de antecedência para cancelamento se necessário
                        <button onClick={() => handleCancelAppointment(appointmentId)} className="action-btn cancel-by-client-btn" disabled={isLoading}>
                            Cancelar Agendamento
                        </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}