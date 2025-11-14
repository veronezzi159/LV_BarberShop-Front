import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AppointmentForm() {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    barberId: '',
    serviceId: '',
    date: ''
  });

  useEffect(() => {
    fetchBarbers();
    fetchServices();
  }, []);

  const fetchBarbers = async () => {
    const res = await api.get('/barbers');
    setBarbers(res.data);
  };

  const fetchServices = async () => {
    const res = await api.get('/services');
    setServices(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', form);
      alert('Agendamento realizado com sucesso!');
      setForm({ barberId: '', serviceId: '', date: '' });
    } catch (err) {
      alert('Erro ao agendar: ' + err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <h2>Agendar Horário</h2>
      <form onSubmit={handleSubmit}>
        <select name="barberId" value={form.barberId} onChange={handleChange} required>
          <option value="">Selecione o barbeiro</option>
          {barbers.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select name="serviceId" value={form.serviceId} onChange={handleChange} required>
          <option value="">Selecione o serviço</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />

        <button type="submit">Agendar</button>
      </form>
    </div>
  );
}
