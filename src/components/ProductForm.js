import React, { useState } from "react";
import axios from "axios"; // Se estiver usando axios diretamente
// import api from '../services/api'; // Se você tem uma instância configurada do axios

// Se o CSS for específico para este componente, importe aqui
import './styles/ProductForm.css';

export default function ProductForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    quantity: 0,
    price: 0,
    description: "",
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? parseFloat(value) || 0 : value, // Converte para número
    });
    if (error) setError(''); // Limpa o erro ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Converte quantity e price para números antes de enviar,
    // caso o estado ainda os tenha como string após a edição.
    const productData = {
      ...form,
      quantity: parseInt(form.quantity, 10) || 0,
      price: parseFloat(form.price) || 0,
    };

    try {
      // Se estiver usando uma instância 'api' do axios:
      // await api.post("/products", productData, {
      await axios.post("http://localhost:3001/api/products", productData, { // Rota completa
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      alert("Produto cadastrado com sucesso!"); // Considere uma notificação mais elegante
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
      // Limpar o formulário após o sucesso
      setForm({ name: "", quantity: 0, price: 0, description: "" });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
      // alert("Erro ao cadastrar: " + errorMessage); // Removido para usar o <p>
    }
  };

  return (
    // Adicione uma classe wrapper se este formulário for parte de um layout maior
    // Ex: <div className="product-form-container">
    <form onSubmit={handleSubmit} className="modern-form product-form"> {/* Classes para estilização */}
      <h2>Cadastrar Novo Produto</h2>
      {error && <p className="form-error">{error}</p>} {/* Exibe a mensagem de erro */}

      <div className="form-group">
        <label htmlFor="name">Nome do Produto:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Ex: Cera Modeladora"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantidade em Estoque:</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          min="0" // Evita quantidades negativas
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Preço (R$):</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0" // Evita preços negativos
          value={form.price}
          onChange={handleChange}
          placeholder="Ex: 25.50"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição (Opcional):</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Detalhes sobre o produto..."
          rows="4"
        />
      </div>

      <button type="submit" className="submit-button">Cadastrar Produto</button>
    </form>
    // </div>
  );
}