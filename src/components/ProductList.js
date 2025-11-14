import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './styles/ProductList.css'; // Certifique-se que o caminho está correto

export default function ProductList() {
  // Estados do componente
  const [products, setProducts] = useState([]);
  const [stockEntryForm, setStockEntryForm] = useState({
    productId: '',
    quantity: 0,
    observation: '',
  });
  const [stockExitForm, setStockExitForm] = useState({ // Estado para o formulário de saída
    productId: '',
    quantity: 0,
    observation: '',
  });
  const [reportFilters, setReportFilters] = useState({
    productIdForReport: '',
    startDate: '',
    endDate: '',
  });
  const [stockMovements, setStockMovements] = useState([]);
  const [formError, setFormError] = useState('');         // Erro para o formulário de ENTRADA
  const [exitFormError, setExitFormError] = useState(''); // Erro para o formulário de SAÍDA
  const [listError, setListError] = useState('');
  const [reportError, setReportError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setListError('');
    setIsFetchingProducts(true);
    try {
      const res = await api.get('/products', {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setListError('Falha ao carregar produtos. Tente novamente mais tarde.');
    } finally {
      setIsFetchingProducts(false);
    }
  };

  // Handler para o formulário de ENTRADA
  const handleStockEntryFormChange = (e) => {
    const { name, value, type } = e.target;
    setStockEntryForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
    if (formError) setFormError(''); // Usa formError e setFormError
  };

  const handleStockEntrySubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Usa setFormError
    // ... (lógica do handleStockEntrySubmit usando stockEntryForm e setFormError)
    if (!stockEntryForm.productId) {
      setFormError("Selecione um produto para registrar a entrada.");
      return;
    }
    if (stockEntryForm.quantity <= 0) {
      setFormError("A quantidade para entrada deve ser maior que zero.");
      return;
    }
    setIsLoading(true);
    const entryData = {
      quantity: stockEntryForm.quantity,
      observation: stockEntryForm.observation,
    };
    try {
      await api.post(`/products/${stockEntryForm.productId}/stock-entry`, entryData, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      alert('Entrada em estoque registrada com sucesso!');
      setStockEntryForm({ productId: '', quantity: 0, observation: '' });
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Ocorreu um erro desconhecido.';
      setFormError(errorMessage); // Usa setFormError
    } finally {
      setIsLoading(false);
    }
  };

  // VVVV --- FUNÇÕES PARA O FORMULÁRIO DE SAÍDA DEVEM ESTAR AQUI DENTRO --- VVVV
  const handleStockExitFormChange = (e) => {
    const { name, value, type } = e.target;
    setStockExitForm(prev => ({ // Usa setStockExitForm
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
    if (exitFormError) setExitFormError(''); // Usa exitFormError e setExitFormError
  };

  const handleStockExitSubmit = async (e) => {
    e.preventDefault();
    setExitFormError(''); // Usa setExitFormError
    if (!stockExitForm.productId) {
      setExitFormError("Selecione um produto para registrar a saída."); // Usa setExitFormError
      return;
    }
    if (stockExitForm.quantity <= 0) {
      setExitFormError("A quantidade para saída deve ser maior que zero."); // Usa setExitFormError
      return;
    }

    const selectedProduct = products.find(p => (p.ProdutoID || p.id) == stockExitForm.productId);
    // Corrigido: Comparar a quantidade de saída com o estoque do produto selecionado
    if (selectedProduct && getProductQuantity(selectedProduct) < stockExitForm.quantity) {
      setExitFormError(`Quantidade insuficiente em estoque. Disponível: ${getProductQuantity(selectedProduct)}`); // Usa setExitFormError
      return;
    }

    setIsLoading(true);
    const exitData = {
      delta: -stockExitForm.quantity, // Usa stockExitForm
      observation: stockExitForm.observation || 'Saída manual de estoque',
    };
    try {
      await api.patch(`/products/${stockExitForm.productId}/update-stock`, exitData, { // Usa stockExitForm
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      alert('Saída de estoque registrada com sucesso!');
      setStockExitForm({ productId: '', quantity: 0, observation: '' }); // Usa setStockExitForm
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Ocorreu um erro desconhecido.';
      setExitFormError(errorMessage); // Usa setExitFormError
    } finally {
      setIsLoading(false);
    }
  };
  // ^^^^ --- FIM DAS FUNÇÕES PARA O FORMULÁRIO DE SAÍDA --- ^^^^


  const handleDelete = async (id, productName) => {
    // ... (lógica do handleDelete, já parece correta) ...
    if (window.confirm(`Tem certeza que deseja remover o produto "${productName}" da lista? Esta ação é permanente.`)) {
      setIsLoading(true);
      try {
        await api.delete(`/products/${id}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        fetchProducts();
      } catch (err) {
        alert('Erro ao remover produto.');
        console.error("Erro ao remover:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateQuantity = async (id, productName, currentQuantity, delta) => {
    // ... (lógica do handleUpdateQuantity, já parece correta) ...
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 0) {
      alert("A quantidade em estoque não pode ser negativa.");
      return;
    }
    let confirmationMessage = `Você está ${delta > 0 ? 'adicionando (ajuste)' : 'removendo'} ${Math.abs(delta)} unidade(s) do produto "${productName}". Nova quantidade será ${newQuantity}. Confirmar?`;
    if (delta < 0 && newQuantity === 0) {
        confirmationMessage = `Atenção: Ao remover ${Math.abs(delta)} unidade(s) do produto "${productName}", o estoque ficará ZERADO. Confirmar?`;
    }
    if (window.confirm(confirmationMessage)) {
        setIsLoading(true);
        try {
          await api.patch(`/products/${id}/update-stock`, { delta }, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") },
          });
          fetchProducts();
        } catch (err) {
          alert('Erro ao atualizar quantidade.');
          console.error("Erro ao atualizar quantidade:", err);
        } finally {
          setIsLoading(false);
        }
    }
  };

  const handleReportFiltersChange = (e) => {
    // ... (lógica do handleReportFiltersChange) ...
    setReportFilters({ ...reportFilters, [e.target.name]: e.target.value });
  };

  const handleGenerateStockMovementReport = async (e) => {
    // ... (lógica do handleGenerateStockMovementReport) ...
    e.preventDefault();
    setReportError('');
    if (!reportFilters.startDate || !reportFilters.endDate) {
      setReportError('Por favor, selecione a data de início e a data de fim para o relatório.');
      return;
    }
    if (new Date(reportFilters.startDate) > new Date(reportFilters.endDate)) {
        setReportError('A data de início não pode ser posterior à data de fim.');
        return;
    }
    setIsGeneratingReport(true);
    setStockMovements([]);
    try {
      const params = {
        startDate: reportFilters.startDate,
        endDate: reportFilters.endDate,
      };
      if (reportFilters.productIdForReport) {
        params.productId = reportFilters.productIdForReport;
      }
      const res = await api.get('/reports/stock-movements', {
        params,
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setStockMovements(res.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Ocorreu um erro desconhecido.';
      setReportError(errorMessage);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const formatDateForReport = (dateString) => {
    // ... (lógica do formatDateForReport) ...
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return `${localDate.toLocaleDateString('pt-BR')} ${localDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getProductId = (prod) => prod.ProdutoID || prod.id;
  const getProductName = (prod) => prod.NomeProduto || prod.name;
  const getProductQuantity = (prod) => prod.QuantidadeEstoque !== undefined ? prod.QuantidadeEstoque : prod.quantity;


  // O JSX que você forneceu já inclui o formulário de saída, então não precisa ser alterado aqui
  // Apenas certifique-se de que ele usa as variáveis de estado e handlers corretos:
  // - onSubmit={handleStockExitSubmit}
  // - value={stockExitForm.productId}, value={stockExitForm.quantity}, value={stockExitForm.observation}
  // - onChange={handleStockExitFormChange}
  // - {exitFormError && <p className="form-error">{exitFormError}</p>}

  return (
    <div className="stock-control-container modern-dashboard-section">
      <h2 className="dashboard-title">Gerenciamento de Estoque</h2>

      {/* Formulário para Entrada em Estoque de Produto Existente */}
      <div className="form-section product-stock-entry-form-wrapper">
        <form onSubmit={handleStockEntrySubmit} className="modern-form product-stock-entry-form">
          <h3>Registrar Entrada em Estoque</h3>
          {formError && <p className="form-error">{formError}</p>}
          {/* ... campos do formulário de entrada (já parecem corretos) ... */}
          <div className="form-group">
            <label htmlFor="entry-productId">Produto:</label>
            <select id="entry-productId" name="productId" value={stockEntryForm.productId} onChange={handleStockEntryFormChange} required disabled={isLoading || isFetchingProducts}>
              <option value="">-- Selecione um Produto --</option>
              {products.map(p => <option key={getProductId(p)} value={getProductId(p)}>{getProductName(p)} (Estoque atual: {getProductQuantity(p)})</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="entry-quantity">Quantidade para Entrada:</label>
              <input id="entry-quantity" type="number" name="quantity" value={stockEntryForm.quantity} onChange={handleStockEntryFormChange} placeholder="Qtd." required min="1" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="entry-observation">Observação (Opcional):</label>
              <input id="entry-observation" name="observation" type="text" value={stockEntryForm.observation} onChange={handleStockEntryFormChange} placeholder="Ex: NF 123, Lote XYZ" disabled={isLoading} />
            </div>
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Entrada'}
          </button>
        </form>
      </div>

      {/* Formulário para Saída de Estoque de Produto Existente */}
      <div className="form-section product-stock-exit-form-wrapper">
        <form onSubmit={handleStockExitSubmit} className="modern-form product-stock-exit-form">
          <h3>Registrar Saída de Estoque</h3>
          {exitFormError && <p className="form-error">{exitFormError}</p>} {/* Usa exitFormError */}
          <div className="form-group">
            <label htmlFor="exit-productId">Produto para Saída:</label>
            <select id="exit-productId" name="productId" value={stockExitForm.productId} onChange={handleStockExitFormChange} required disabled={isLoading || isFetchingProducts}> {/* Usa stockExitForm e handleStockExitFormChange */}
              <option value="">-- Selecione um Produto --</option>
              {products.map(p => {
                const currentQuantity = getProductQuantity(p);
                return (
                  <option key={getProductId(p)} value={getProductId(p)} disabled={currentQuantity === 0}>
                    {getProductName(p)} (Estoque: {currentQuantity})
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exit-quantity">Quantidade para Saída:</label>
              <input id="exit-quantity" type="number" name="quantity" value={stockExitForm.quantity} onChange={handleStockExitFormChange} placeholder="Qtd. a remover" required min="1" disabled={isLoading} /> {/* Usa stockExitForm e handleStockExitFormChange */}
            </div>
            <div className="form-group">
              <label htmlFor="exit-observation">Motivo/Observação (Opcional):</label>
              <input id="exit-observation" name="observation" type="text" value={stockExitForm.observation} onChange={handleStockExitFormChange} placeholder="Ex: Uso interno, Venda balcão" disabled={isLoading} /> {/* Usa stockExitForm e handleStockExitFormChange */}
            </div>
          </div>
          <button type="submit" className="submit-button remove-button" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Saída'}
          </button>
        </form>
      </div>

      {/* Lista de Produtos em Estoque */}
      <div className="product-list-section">
         {/* ... JSX da lista ... */}
         <h3>Produtos em Estoque</h3>
        {isFetchingProducts && <p className="loading-message">Carregando produtos...</p>}
        {listError && <p className="form-error list-error">{listError}</p>}
        {!isFetchingProducts && products.length === 0 && !listError && (
          <p className="empty-list-message">Nenhum produto cadastrado no estoque.</p>
        )}
        {products.length > 0 && (
          <ul className="product-list-ul">
            {products.map(prod => {
              const productId = getProductId(prod);
              const productName = getProductName(prod);
              const productQuantity = getProductQuantity(prod);
              return (
                <li key={productId} className="product-list-item">
                  <div className="product-item-info">
                    <span className="product-name">{productName}</span>
                  </div>
                  <div className="product-item-stock-controls">
                    <span className="product-quantity">Qtd: {productQuantity}</span>
                    <div className="product-actions">
                      <button onClick={() => handleUpdateQuantity(productId, productName, productQuantity, 1)} className="action-button increment-button" title="Adicionar 1 (Ajuste)" disabled={isLoading}>+</button>
                      <button onClick={() => handleUpdateQuantity(productId, productName, productQuantity, -1)} className="action-button decrement-button" title="Remover 1 (Ajuste / Saída)" disabled={isLoading}>-</button>
                      <button onClick={() => handleDelete(productId, productName)} className="action-button delete-button" title="Excluir Produto da Lista" disabled={isLoading}>Excluir</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Seção de Relatório de Movimentações de Estoque */}
      <div className="report-section stock-movement-report">
        {/* ... JSX do relatório ... */}
        <h3>Relatório de Movimentações</h3>
        <form onSubmit={handleGenerateStockMovementReport} className="modern-form report-form-filters">
          <div className="form-row filter-row">
            <div className="form-group">
              <label htmlFor="report-productId">Filtrar por Produto (Opcional):</label>
              <select id="report-productId" name="productIdForReport" value={reportFilters.productIdForReport} onChange={handleReportFiltersChange} disabled={isGeneratingReport || isFetchingProducts}>
                <option value="">-- Todos os Produtos --</option>
                {products.map(p => <option key={getProductId(p)} value={getProductId(p)}>{getProductName(p)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="report-startDate">Data de Início:</label>
              <input id="report-startDate" name="startDate" type="date" value={reportFilters.startDate} onChange={handleReportFiltersChange} required disabled={isGeneratingReport} />
            </div>
            <div className="form-group">
              <label htmlFor="report-endDate">Data de Fim:</label>
              <input id="report-endDate" name="endDate" type="date" value={reportFilters.endDate} onChange={handleReportFiltersChange} required disabled={isGeneratingReport} />
            </div>
          </div>
          <button type="submit" className="submit-button" disabled={isGeneratingReport}>
            {isGeneratingReport ? 'Gerando Relatório...' : 'Gerar Relatório'}
          </button>
          {reportError && <p className="form-error report-specific-error">{reportError}</p>}
        </form>

        {isGeneratingReport && stockMovements.length === 0 && <p className="loading-message">Gerando relatório de movimentações...</p>}
        {!isGeneratingReport && stockMovements.length === 0 && !reportError && reportFilters.startDate && (
          <p className="empty-list-message">Nenhuma movimentação encontrada para os filtros selecionados.</p>
        )}
        {stockMovements.length > 0 && (
          <table className="report-table stock-movement-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.map(mov => (
                <tr key={mov.MovimentacaoID || mov.id}>
                  <td>{formatDateForReport(mov.DataMovimentacao)}</td>
                  <td>{mov.NomeProduto || mov.Produto?.NomeProduto || 'N/A'}</td>
                  <td>{mov.TipoMovimentacao}</td>
                  <td className={mov.Quantidade > 0 ? 'quantity-positive' : 'quantity-negative'}>
                    {mov.Quantidade > 0 ? '+' : ''}{mov.Quantidade}
                  </td>
                  <td>{mov.Observacao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}