import { useState, useEffect } from 'react';
import { materialService } from '../services';
import { ProductCard } from '../components/ProductCard';
import './Home.css';

const DISCIPLINAS = [
  '', 'Matemática', 'Português', 'Ciências', 'História',
  'Geografia', 'Inglês', 'Educação Física', 'Artes',
  'Biologia', 'Física', 'Química', 'Filosofia', 'Sociologia',
];

export const Home = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    loadMaterials();
  }, [filters]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialService.getAll(filters);
      setMaterials(response.data);
    } catch (err) {
      setError('Erro ao carregar materiais didáticos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">Carregando materiais...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <div className="container">
        <div className="hero-section">
          <h1>📚 Materiais Didáticos</h1>
          <p className="hero-description">
            Encontre, compartilhe e colabore com recursos pedagógicos de qualidade.
            Uma plataforma feita por professores, para professores da rede pública.
          </p>
        </div>

        <div className="filters">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-input filter-select"
          >
            {DISCIPLINAS.map((d) => (
              <option key={d} value={d}>
                {d === '' ? '📖 Todas as Disciplinas' : d}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="search"
            placeholder="🔍 Buscar material por nome..."
            value={filters.search}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="products-grid">
          {materials.map((material) => (
            <ProductCard key={material.id} product={material} />
          ))}
        </div>

        {materials.length === 0 && (
          <div className="no-materials">
            <p>📭 Nenhum material encontrado</p>
            <p className="no-materials-hint">Tente buscar por outra disciplina ou termo</p>
          </div>
        )}
      </div>
    </div>
  );
};
