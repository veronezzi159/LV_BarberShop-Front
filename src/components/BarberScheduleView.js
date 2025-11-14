// src/components/BarberScheduleView.js
import React from 'react';
// import './styles/BarberScheduleView.css'; // Se tiver CSS específico

export default function BarberScheduleView({ appointments, onUpdateStatus, isLoading, error }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return `${localDate.toLocaleDateString('pt-BR')} às ${localDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Defina isPastAppointment DENTRO do componente ou passe como uma função utilitária importada
  const isPastAppointment = (dateString) => {
    if (!dateString) return false;
    const appointmentTime = new Date(dateString).getTime();
    const currentTimeWithMargin = new Date().getTime() - (30 * 60 * 1000); // Ex: 30 minutos no passado
    return appointmentTime < currentTimeWithMargin;
  };

  if (isLoading && (!appointments || appointments.length === 0)) {
    return <p className="loading-message">Carregando sua agenda...</p>;
  }

  if (error) {
    return <p className="form-error dashboard-error">{error}</p>;
  }

  if (!appointments || appointments.length === 0) {
    return <p className="empty-list-message">Você não tem agendamentos no momento.</p>;
  }

  // console.log("Dados de agendamentos recebidos no BarberScheduleView:", appointments);

  return (
    <div className="barber-schedule-view">
      <h3>Meus Agendamentos</h3>
      <ul className="appointments-list">
        {appointments.map(appt => {
          const appointmentId = appt.AgendamentoID || appt.id;
          const currentApptStatus = appt.status; // Assumindo que 'status' vem do backend
          const appointmentDateTime = appt.DataHoraAgendamento; // << DEFINA appointmentDateTime AQUI DENTRO DO MAP

          return (
            <li key={appointmentId} className={`appointment-item status-${currentApptStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="appointment-details">
                <p><strong>Data:</strong> {formatDate(appointmentDateTime)}</p> {/* Use appointmentDateTime */}
                <p><strong>Serviço:</strong> {appt.servicoRealizado?.NomeServico || 'N/A'}</p>
                <p><strong>Cliente:</strong> {appt.cliente?.name || appt.cliente?.Nome || 'N/A'}</p>
                <p><strong>Status:</strong> <span className="status-badge">{currentApptStatus || 'N/D'}</span></p>
                {appt.ObservacoesCliente && <p className="observation-text"><em>Obs. Cliente: {appt.ObservacoesCliente}</em></p>}
              </div>
              <div className="appointment-actions">
                {currentApptStatus === 'Pendente' && (
                  <>
                    <button onClick={() => onUpdateStatus(appointmentId, 'Aprovado')} className="action-btn approve-btn" disabled={isLoading}>Aprovar</button>
                    <button onClick={() => onUpdateStatus(appointmentId, 'NaoAprovado')} className="action-btn reject-btn" disabled={isLoading}>Recusar</button>
                  </>
                )}
                {currentApptStatus === 'Aprovado' && (
                  <>
                    <button onClick={() => onUpdateStatus(appointmentId, 'Concluido')} className="action-btn complete-btn" disabled={isLoading}>Concluir</button>
                    {/* Agora isPastAppointment e appointmentDateTime estão definidas no escopo correto */}
                    {isPastAppointment(appointmentDateTime) && (
                       <button onClick={() => onUpdateStatus(appointmentId, 'NaoCompareceu')} className="action-btn no-show-btn" disabled={isLoading}>Não Compareceu</button>
                    )}
                    <button onClick={() => onUpdateStatus(appointmentId, 'CanceladoBarbearia')} className="action-btn cancel-btn" disabled={isLoading}>Cancelar</button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}