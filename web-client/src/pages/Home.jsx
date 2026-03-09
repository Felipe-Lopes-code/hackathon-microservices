import { useState, useEffect, useRef, useCallback } from 'react';
import { materialService } from '../services';
import { ProductCard } from '../components/ProductCard';
import './Home.css';

const DISCIPLINAS = [
  '', 'Matemática', 'Português', 'Ciências', 'História',
  'Geografia', 'Inglês', 'Educação Física', 'Artes',
  'Biologia', 'Física', 'Química', 'Filosofia', 'Sociologia',
];

const SEARCH_DEBOUNCE_MS = 400;

export const Home = () => {
  const [materials, setMaterials] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  // Debounce: update debouncedSearch after user stops typing
  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm]);

  // Fetch materials when category or debounced search changes
  useEffect(() => {
    loadMaterials();
  }, [category, debouncedSearch]);

  const loadMaterials = async () => {
    try {
      if (initialLoading) {
        setInitialLoading(true);
      } else {
        setSearching(true);
      }
      const response = await materialService.getAll({
        category,
        search: debouncedSearch,
      });
      setMaterials(response.data);
    } catch (err) {
      setError('Erro ao carregar materiais didáticos');
      console.error(err);
    } finally {
      setInitialLoading(false);
      setSearching(false);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (initialLoading) return <div className="loading">Carregando materiais...</div>;
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
            value={category}
            onChange={handleCategoryChange}
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
            value={searchTerm}
            onChange={handleSearchChange}
            className="filter-input"
            autoComplete="off"
          />
          {searching && <span className="search-indicator">Buscando...</span>}
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
