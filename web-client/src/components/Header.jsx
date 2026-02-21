import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import './Header.css';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          📚 EduShare
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Materiais
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/biblioteca" className="nav-link library-link">
                📖 Biblioteca
                {itemCount > 0 && <span className="library-badge">{itemCount}</span>}
              </Link>
              <span className="user-name">Olá, Prof. {user?.name}</span>
              <button onClick={logout} className="btn btn-secondary">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Entrar
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
