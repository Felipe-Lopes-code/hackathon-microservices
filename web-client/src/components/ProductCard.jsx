import { useCartStore } from '../store/cartStore';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    alert('Produto adicionado ao carrinho!');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.name}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">
            R$ {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="btn btn-add-cart"
            disabled={!product.isAvailable || product.stock === 0}
          >
            {product.stock > 0 ? 'Adicionar' : 'Indisponível'}
          </button>
        </div>
        <span className="product-stock">
          {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
        </span>
      </div>
    </div>
  );
};
