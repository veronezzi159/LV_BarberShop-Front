// src/components/BarberManualBookingForm.js
import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Seu serviço de API
// Se for criar um CSS específico para este, importe aqui
// import './styles/BarberManualBookingForm.css';

export default function BarberManualBookingForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    ClienteID: '',
    ServicoID: '',
    DataHoraAgendamento: '',
    ObservacoesCliente: '', // Opcional
  });
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true); // Para o loading inicial de clientes/serviços

  useEffect(() => {
    const fetchDataForForm = async () => {
      setIsFetchingData(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        // Chamada para buscar clientes (parece estar funcionando pela imagem, já que "Pietro Lopes" está selecionado)
        const clientsRes = await api.get('/users/role/cliente', { headers: { Authorization: `Bearer ${token}` } });
        setClients(clientsRes.data);

        // Chamada para buscar serviços << FOCO AQUI
        const servicesRes = await api.get('/services', { headers: { Authorization: `Bearer ${token}` } }); // Ajuste a rota se necessário
        console.log("BarberManualBookingForm: Serviços recebidos da API:", servicesRes.data); // LOG IMPORTANTE
        setServices(servicesRes.data);

      } catch (err) {
        console.error("Erro ao buscar dados para formulário de agendamento:", err);
        setError("Falha ao carregar clientes ou serviços. Verifique as permissões ou a API.");
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchDataForForm();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.ClienteID || !formData.ServicoID || !formData.DataHoraAgendamento) {
      setError("Cliente, serviço, data e hora são obrigatórios.");
      return;
    }
    // Validação simples de data/hora (não pode ser no passado)
    if (new Date(formData.DataHoraAgendamento) < new Date()) {
      setError("A data e hora do agendamento não podem ser no passado.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // O backend deve pegar o BarbeiroID do token do usuário logado (barbeiro)
      await api.post('/appointments/barber-booking', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Agendamento manual realizado com sucesso!");
      setFormData({ ClienteID: '', ServicoID: '', DataHoraAgendamento: '', ObservacoesCliente: '' });
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Erro ao criar agendamento";
      setError(errMsg);
      console.error("Erro no agendamento manual:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return <p className="loading-message">Carregando dados do formulário...</p>;
  }

  return (
    <div className="manual-booking-form-wrapper modern-form"> {/* Reutilize classes existentes */}
      <h3>Incluir Cliente na Agenda</h3>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ClienteID">Cliente:</label>
          <select id="ClienteID" name="ClienteID" value={formData.ClienteID} onChange={handleChange} required disabled={isLoading}>
            <option value="">-- Selecione o Cliente --</option>
            {clients.length > 0 ? (
              clients.map(c => (
                <option key={c.UsuarioID || c.id} value={c.UsuarioID || c.id}>
                  {c.Nome || c.name} {/* Ajuste para a propriedade correta do nome */}
                </option>
              ))
            ) : (
              <option value="" disabled>Nenhum cliente disponível</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ServicoID">Serviço:</label>
          <select id="serviceId" name="ServicoID" value={formData.ServicoID} onChange={handleChange} required disabled={isLoading}>
            <option value="">-- Selecione o Serviço --</option>
            {/* VERIFIQUE 'availableServices' AQUI (que é 'services' no estado) */}
            {services && services.length > 0 ? ( // Usando 'services' do estado
              services.map(s => (
                // Ajuste as propriedades aqui para corresponder ao que a API retorna
                <option key={s.ServicoID || s.id} value={s.ServicoID || s.id}>
                  {s.NomeServico || s.name} - R$ {parseFloat(s.Preco || s.price || 0).toFixed(2)}
                </option>
              ))
            ) : (
              <option value="" disabled>Nenhum serviço carregado</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="DataHoraAgendamento">Data e Hora:</label>
          <input
            id="DataHoraAgendamento"
            name="DataHoraAgendamento"
            type="datetime-local"
            value={formData.DataHoraAgendamento}
            onChange={handleChange}
            required
            disabled={isLoading}
          // Adicione min para não permitir datas passadas, se o navegador suportar bem
          // min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ObservacoesCliente">Observações do Cliente (Opcional):</label>
          <textarea
            id="ObservacoesCliente"
            name="ObservacoesCliente"
            value={formData.ObservacoesCliente}
            onChange={handleChange}
            rows="3"
            placeholder="Alguma preferência ou informação adicional?"
            disabled={isLoading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Agendando..." : "Agendar Cliente"}
          </button>
          {onCancel && typeof onCancel === 'function' && (
            <button type="button" onClick={onCancel} className="cancel-button" disabled={isLoading}>
              Voltar para Agenda
            </button>
          )}
        </div>
      </form>
    </div>
  );
}