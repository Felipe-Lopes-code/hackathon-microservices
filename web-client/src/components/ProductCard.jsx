import { useCartStore } from '../store/cartStore';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleSaveToLibrary = () => {
    addItem(product);
    alert('Material salvo na biblioteca!');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x200/3498db/ffffff?text=Material+Didatico'}
          alt={product.name}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="product-discipline">
            📖 {product.category || 'Geral'}
          </span>
          <span className="product-badge">Gratuito</span>
        </div>
        <div className="product-footer">
          <span className="product-downloads">
            📥 {product.stock || 0} downloads
          </span>
          <button
            onClick={handleSaveToLibrary}
            className="btn btn-add-cart"
            disabled={product.stock === 0}
          >
            📥 Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
