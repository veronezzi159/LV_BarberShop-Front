import React, { useState, useEffect } from 'react'; // Adicionei useEffect para o exemplo de carregar role
import Login from './components/Login';
import Register from './components/Register';
import ClientDashboard from './components/ClientDashboard';
import BarberDashboard from './components/BarberDashboard';
// ProductList não será mais chamado diretamente aqui para o gerente
import ManagerDashboard from './components/ManagerDashboard'; // << IMPORTADO AQUI
import { clearToken, getToken } from './utils/auth'; // Assumindo que getToken existe
// import jwt_decode from 'jwt-decode'; // Exemplo se você usar esta biblioteca para decodificar tokens

export default function App() {
  // Função para tentar pegar o role do token ao iniciar (exemplo)
  const getInitialRole = () => {
    const token = getToken();
    if (token) {
      try {
        // Você precisará de uma biblioteca como jwt-decode ou lógica para decodificar seu token
        // const decodedToken = jwt_decode(token);
        // return decodedToken.role; // Assumindo que seu token tem uma propriedade 'role'
        // Como não temos jwt_decode aqui, retornaremos null por enquanto.
        // Implemente a decodificação real do seu token aqui.
        // Exemplo SIMPLIFICADO se o role estivesse no localStorage também (não ideal para role):
        // return localStorage.getItem('userRole');
        return null;
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        clearToken(); // Limpa token inválido
        return null;
      }
    }
    return null;
  };

  const [view, setView] = useState('login');
  const [role, setRole] = useState(getInitialRole()); // Tenta carregar o role inicial

  // Se quiser que a view inicial seja baseada no role, adicione um useEffect
  useEffect(() => {
    if (role) {
      setView(''); // Limpa a view de login/registro se já estiver logado
    } else {
      setView('login'); // Garante que vá para login se não houver role
    }
  }, [role]);


  const handleLoginSuccess = (userRole) => {
    console.log('App.js: Login bem-sucedido! Role recebido:', userRole);
    setRole(userRole);
    // localStorage.setItem('userRole', userRole); // Exemplo de como poderia persistir (não ideal para role)
    setView(''); // Limpa a view de login/registro
  };

  const handleLogout = () => {
    console.log('App.js: Fazendo logout');
    clearToken();
    // localStorage.removeItem('userRole'); // Limpa se estiver persistindo
    setRole(null);
    setView('login');
  };

  const renderContent = () => {
    if (role) {
      console.log("App.js: Renderizando conteúdo para o role:", role);
      if (role === 'cliente') return <ClientDashboard onLogout={handleLogout} />; // Passe onLogout se o cliente tiver botão de sair
      if (role === 'barbeiro') return <BarberDashboard onLogout={handleLogout} />; // Passe onLogout
      if (role === 'gerente'){
         console.log("App.js: Renderizando ManagerDashboard para role:", role);
        return <ManagerDashboard onLogout={handleLogout} />; // << ALTERADO AQUI
      }
      return <div>Role desconhecido ou painel não implementado para: {role}</div>;
    } else {
      if (view === 'login') {
        return <Login onLogin={handleLoginSuccess} onNavigateToRegister={() => setView('register')} />;
      }
      if (view === 'register') {
        // A prop onRegister deve apenas mudar a view para login, o handleLoginSuccess cuida de setar o role
        return <Register onRegister={() => setView('login')} />;
      }
      return <Login onLogin={handleLoginSuccess} onNavigateToRegister={() => setView('register')} />; // Default
    }
  };

  return (
    // Removi o padding: 20 daqui para que cada "página" (Login, Register, Dashboards) controle seu próprio estilo de container
    <div>
      <header style={{ // Estilo básico para o header global
        padding: '10px 20px',
        backgroundColor: '#282828', // Um cinza escuro para o header
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        <div className="header-title">
          <h1 style={{ margin: 0, fontSize: '1.5em', color: '#ffd700' }}>Minha Barbearia</h1>
        </div>
        {/* O botão de logout agora está no ManagerDashboard, mas pode ser duplicado aqui se quiser */}
        {/* Ou, se os outros painéis também precisarem de logout, passe a função handleLogout para eles */}
        {/* Ex: Se ClientDashboard e BarberDashboard também tiverem um botão de Sair em seu próprio header */}
        {/* {role && <button onClick={handleLogout} style={logoutButtonStyle}>Sair</button>} */}
      </header>
      <main className="app-main-content" style={{ paddingTop: '0' /* Se o header for fixo, ou ajuste conforme necessário */ }}>
        {renderContent()}
      </main>
    </div>
  );
}