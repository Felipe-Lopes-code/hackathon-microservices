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
          E-Shop
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Produtos
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" className="nav-link">
                Meus Pedidos
              </Link>
              <Link to="/cart" className="nav-link cart-link">
                Carrinho
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <span className="user-name">Olá, {user?.name}</span>
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
