import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';
import './BrandsPage.css';

const GET_BRANDS = gql`
  query GetBrands {
    findAllBrands {
      id
      name
    }
  }
`;

const BrandsPage = () => {
  const { loading, error, data } = useQuery(GET_BRANDS);
  const { t } = useLanguage();

  if (loading) return <Spinner animation="border" className="text-primary" />;
  if (error) return <Alert variant="danger">{t('error')}</Alert>;

  const brands = data?.findAllBrands || [];

  return (
    <div className="brands-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            {t('browseTopQuality')} <span className="highlight">{t('guitars')}</span> {t('online')}
          </h1>
          <p>{t('exploreCollections')}</p>
        </div>
        <div className="hero-image">
          <img src="/assets/hero-guitar.png" alt="Guitar" />
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands-section">
        <h2>
          {t('featuring')} <span className="highlight">{t('bestBrands')}</span>
        </h2>
        <p className="brands-subtitle">{t('selectPreferredBrand')}</p>

        <Card.Body>
          <ListGroup variant="flush" className="brands-grid">
            {brands.map((brand) => (
              <ListGroup.Item key={brand.id}>
                <Link to={`/models/${brand.id}`}>{brand.name}</Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </section>
    </div>
  );
};

export default BrandsPage;