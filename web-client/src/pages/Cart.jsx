import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { shareService } from '../services';
import './Cart.css';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, clearCart } = useCartStore();

  const handleShare = async () => {
    try {
      const shareData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: 1,
        })),
      };

      await shareService.create(shareData);
      clearCart();
      alert('Materiais compartilhados com sucesso! Os alunos receberão acesso aos recursos selecionados.');
      navigate('/');
    } catch (error) {
      alert('Erro ao compartilhar materiais: ' + (error.response?.data?.message || error.message));
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>📖 Minha Biblioteca</h1>
          <div className="empty-library">
            <p>📭 Sua biblioteca está vazia</p>
            <p className="empty-library-hint">Explore os materiais didáticos e salve os que mais gostar!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>📖 Minha Biblioteca</h1>
        <p className="library-subtitle">Materiais salvos para uso em sala de aula</p>

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="item-info">
                <h3>📄 {item.name}</h3>
                <span className="item-badge">Gratuito</span>
              </div>
              
              <div className="item-actions">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="remove-btn"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <p className="library-count">{items.length} {items.length === 1 ? 'material selecionado' : 'materiais selecionados'}</p>
          <button onClick={handleShare} className="btn btn-primary btn-full">
            🔗 Compartilhar com Alunos
          </button>
        </div>
      </div>
    </div>
  );
};
