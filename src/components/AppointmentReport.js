import React, { useState } from 'react';
import api from '../services/api';

export default function AppointmentReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appointments, setAppointments] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get('/appointments/report', {
        params: { startDate, endDate }
      });
      setAppointments(res.data);
    } catch (err) {
      alert('Erro ao gerar relatório de agendamentos');
    }
  };

  return (
    <div>
      <h2>Relatório de Agendamentos</h2>
      <form onSubmit={handleGenerate}>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        <button type="submit">Gerar Relatório</button>
      </form>

      <ul>
        {appointments.map(appt => (
          <li key={appt.id}>
            {appt.date} - {appt.clientName} com {appt.barberName} ({appt.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
