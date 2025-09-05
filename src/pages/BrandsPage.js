import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';

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

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{t('error')}</Alert>;

  const brands = data?.findAllBrands || [];

  return (
    <Card>
      <Card.Header>{t('guitarBrands')}</Card.Header>
      <ListGroup variant="flush">
        {Array.isArray(brands) ? brands.map((brand) => (
          <ListGroup.Item key={brand.id}>
            <Link to={`/models/${brand.id}`}>{brand.name}</Link>
          </ListGroup.Item>
        )) : null}
      </ListGroup>
    </Card>
  );
};

export default BrandsPage;