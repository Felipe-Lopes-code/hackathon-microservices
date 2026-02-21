import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services';
import './Cart.css';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await orderService.create(orderData);
      clearCart();
      alert('Pedido realizado com sucesso!');
      navigate('/orders');
    } catch (error) {
      alert('Erro ao realizar pedido: ' + (error.response?.data?.message || error.message));
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Carrinho</h1>
          <p className="empty-cart">Seu carrinho está vazio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Carrinho</h1>

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-price">R$ {item.price.toFixed(2)}</p>
              </div>
              
              <div className="item-actions">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removeItem(item.productId)}
                  className="remove-btn"
                >
                  Remover
                </button>
              </div>
              
              <div className="item-total">
                R$ {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Total: R$ {getTotal().toFixed(2)}</h2>
          <button onClick={handleCheckout} className="btn btn-primary btn-full">
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
