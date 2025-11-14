import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Report from './Report';
import RegisterBarberForm from './RegisterBarberForm'; // << 1. IMPORTE AQUI

// Supondo que o CSS está em um arquivo separado e importado.
import './styles/ManagerDashboard.css'; // Verifique se este caminho está correto

export default function ManagerDashboard({ onLogout }) {
  // Adicione 'registerBarber' às views possíveis
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'productList', 'productForm', 'report', 'registerBarber'

  const handleSuccessNavigation = (targetView = 'overview') => {
    // Após uma ação bem-sucedida, navega para a view desejada (ex: overview ou productList)
    setActiveView(targetView);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'productList':
        return <ProductList />;
      case 'productForm':
        return <ProductForm onSuccess={() => handleSuccessNavigation('productList')} />;
      case 'registerBarber': // << 4. NOVO CASE PARA RENDERIZAR
        return <RegisterBarberForm
                  onSuccess={() => handleSuccessNavigation('overview')} // Decide para onde ir após sucesso
                  onCancel={() => setActiveView('overview')} // Volta para overview se cancelar
                />;
      case 'report':
        return <Report />;
      case 'overview':
      default:
        return (
          <div className="dashboard-overview">
            <h2>Bem-vindo ao Painel do Gerente!</h2>
            <p>Selecione uma das opções no menu para gerenciar a barbearia.</p>
          </div>
        );
    }
  };

  return (
    <div className="manager-dashboard-container">
      <aside className="dashboard-sidebar">
        <h3 className="sidebar-title">Navegação</h3>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button
                onClick={() => setActiveView('overview')}
                className={activeView === 'overview' ? 'active' : ''}
              >
                Visão Geral
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('productList')}
                className={activeView === 'productList' ? 'active' : ''}
              >
                Gerenciar Estoque
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('productForm')}
                className={activeView === 'productForm' ? 'active' : ''}
              >
                Adicionar Produto
              </button>
            </li>
            <li> {/* << 3. NOVO BOTÃO DE NAVEGAÇÃO */}
              <button
                onClick={() => setActiveView('registerBarber')}
                className={activeView === 'registerBarber' ? 'active' : ''}
              >
                Cadastrar Barbeiro
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('report')}
                className={activeView === 'report' ? 'active' : ''}
              >
                Relatórios
              </button>
            </li>
          </ul>
        </nav>
        <button onClick={onLogout} className="sidebar-logout-button">
          Sair
        </button>
      </aside>
      <main className="dashboard-main-content">
        {renderActiveView()}
      </main>
    </div>
  );
}