// src/components/BarberDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles/BarberDashboard.css'; // Ou seu CSS global

// Importa os subcomponentes
import BarberScheduleView from './BarberScheduleView';
import BarberManualBookingForm from './BarberManualBookingForm';

export default function BarberDashboard({ onLogout }) {
  const [activeView, setActiveView] = useState('viewSchedule');
  const [appointments, setAppointments] = useState([]);
  // Os estados clients e services agora são gerenciados dentro de BarberManualBookingForm,
  // mas podem ser elevados aqui se BarberScheduleView também precisar deles.
  // Por simplicidade, vou mantê-los no BarberManualBookingForm por enquanto.
  // Se precisar deles aqui para outros fins, pode buscá-los no fetchBarberData.

  const [isLoading, setIsLoading] = useState(false); // Um loading geral para o dashboard
  const [fetchError, setFetchError] = useState('');

  // Função principal para buscar apenas os agendamentos para a BarberScheduleView
  const fetchAppointmentsForSchedule = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const token = localStorage.getItem('token');
      const apptRes = await api.get('/appointments/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(apptRes.data);
    } catch (err) {
      console.error("Erro ao buscar agendamentos do barbeiro:", err);
      let specificError = 'Falha ao carregar seus agendamentos.';
      if (err.response) {
        console.error("Detalhes do erro da API:", err.response.data);
        specificError += ` (Status: ${err.response.status})`;
      }
      setFetchError(specificError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'viewSchedule') {
      fetchAppointmentsForSchedule();
    }
    // Se BarberManualBookingForm buscar seus próprios dados (clientes/serviços),
    // não precisamos fazer nada aqui para ele.
  }, [activeView]); // Re-busca agendamentos se a viewSchedule for ativada

  const handleUpdateStatus = async (id, status) => {
    // setIsLoading(true); // Pode usar um loading específico por item
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointmentsForSchedule(); // Recarrega apenas os agendamentos
    } catch (err) {
      alert('Erro ao atualizar status: ' + (err.response?.data?.message || err.message));
      console.error("Erro ao atualizar status:", err);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'manualBooking':
        return <BarberManualBookingForm
                  onSuccess={() => {
                    fetchAppointmentsForSchedule(); // Atualiza a agenda após booking manual
                    setActiveView('viewSchedule');
                  }}
                  onCancel={() => setActiveView('viewSchedule')}
                  // Clients e services são buscados dentro do BarberManualBookingForm agora
                />;
      case 'viewSchedule':
      default:
        return <BarberScheduleView
                  appointments={appointments}
                  onUpdateStatus={handleUpdateStatus}
                  isLoading={isLoading} // Passa o estado de loading para a view da agenda
                  error={fetchError}    // Passa o erro para a view da agenda
                />;
    }
  };

  return (
    <div className="barber-dashboard-container modern-dashboard-layout">
      <aside className="dashboard-sidebar">
        <h3 className="sidebar-title">Barbeiro</h3>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button
                onClick={() => setActiveView('viewSchedule')}
                className={activeView === 'viewSchedule' ? 'active' : ''}
              >
                Minha Agenda
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('manualBooking')}
                className={activeView === 'manualBooking' ? 'active' : ''}
              >
                Agendar para Cliente
              </button>
            </li>
          </ul>
        </nav>
        {onLogout && (
            <button onClick={onLogout} className="sidebar-logout-button">
            Sair
            </button>
        )}
      </aside>
      <main className="dashboard-main-content">
        {/* O fetchError geral do dashboard pode ser exibido aqui se não for específico de uma view */}
        {/* {fetchError && activeView === 'overview' && <p className="form-error dashboard-error">{fetchError}</p>} */}
        {renderActiveView()}
      </main>
    </div>
  );
}