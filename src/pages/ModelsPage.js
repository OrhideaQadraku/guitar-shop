import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { Form, Spinner, Alert, Pagination } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';
import './ModelsPage.css';

const GET_MODELS_BY_BRAND = gql`
  query GetModelsByBrand($brandId: ID!, $sortBy: sortBy!) {
    findBrandModels(id: $brandId, sortBy: $sortBy) {
      id
      name
      type
      price
      image
    }
  }
`;

const GET_GUITAR_TYPES = gql`
  query GetGuitarTypes($brandId: String!) {
    searchModels(brandId: $brandId, name: "") {
      type
    }
  }
`;

const ModelsPage = () => {
  const { brandId } = useParams();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { t } = useLanguage();

  const { loading, error, data } = useQuery(GET_MODELS_BY_BRAND, {
    variables: { brandId, sortBy: { field: 'name', order: 'ASC' } },
  });

  const { data: typesData } = useQuery(GET_GUITAR_TYPES, {
    variables: { brandId: brandId || '' },
  });

  useEffect(() => {
    if (data?.findBrandModels) {
      setItems(data.findBrandModels);
      setCurrentPage(1);
    }
  }, [data]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    const filtered = data.findBrandModels.filter((m) =>
      m.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    const typeFiltered = type ? filtered.filter((m) => m.type === type) : filtered;
    setItems(typeFiltered);
    setCurrentPage(1);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    const filtered = data.findBrandModels.filter((m) =>
      e.target.value ? m.type === e.target.value : true
    );
    const searchFiltered = search
      ? filtered.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
      : filtered;
    setItems(searchFiltered);
    setCurrentPage(1);
  };

  if (loading) return <Spinner animation="border" className="text-primary" />;
  if (error) return <Alert variant="danger">{t('error')}</Alert>;

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  const renderPaginationItems = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);
    if (end - start < maxVisible - 1) start = Math.max(end - maxVisible + 1, 1);

    if (start > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (start > 2) pages.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }

    for (let page = start; page <= end; page++) {
      pages.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<Pagination.Ellipsis key="end-ellipsis" />);
      pages.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }
    return pages;
  };

  return (
    <div className="models-page">
      <section className="hero">
        <div className="hero-text">
          <h1>
            {t('playLikeARockstar')}
            <br />
          </h1>
          <p>{t('With a legacy dating back to the 1950s, Ibanez blends expert craftsmanship with cutting-edge innovation to deliver guitars that inspire creativity and elevate your performance. Trusted by top artists worldwide, Ibanez guitars are built to play fast, sound bold, and stand out on any stage.')}</p>
        </div>
        <div className="hero-image">
          <img src="/assets/ibanez.png" alt="Guitar" />
        </div>
      </section>

      <div className="models-header">
        <h1>
          {t('checkSelection')} <span className="highlight">{brandId}</span>
        </h1>
      </div>

      <div className="filter-bar d-flex gap-3 mb-4">
        <Form.Control
          placeholder={t('searchByName')}
          value={search}
          onChange={handleSearchChange}
          className="flex-grow-1"
        />
        <Form.Select value={type} onChange={handleTypeChange} style={{ maxWidth: '250px' }}>
          <option value="">{t('filterByType')}</option>
          {typesData?.searchModels.map((model, index) => (
            <option key={index} value={model.type}>
              {model.type}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="models-grid">
        {currentItems.map((model) => (
          <div key={model.id} className="model-card">
            <Link to={`/details/${brandId}/${model.id}`}>
              <div className="model-image-wrap">
                <img
                  src={model.image || '/assets/placeholder.png'}
                  alt={model.name}
                  className="model-image"
                />
              </div>
              <div className="model-name">{model.name}</div>
              <div className="model-type">({model.type})</div>
              <div className="model-price">
                {model.price ? `$${model.price}` : t('priceUnavailable')}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-wrap">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            {renderPaginationItems()}
            <Pagination.Next
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ModelsPage;
