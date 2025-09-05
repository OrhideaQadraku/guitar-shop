import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Form, Row, Col, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';

// Query to fetch models for a specific brand
const GET_MODELS = gql`
  query GetModels($id: ID!, $sortBy: sortBy!) {
    findBrandModels(id: $id, sortBy: $sortBy) {
      id
      name
      type
    }
  }
`;

// Query to fetch guitar types (using searchModels with required args)
const GET_GUITAR_TYPES = gql`
  query GetGuitarTypes($brandId: String!, $name: String!) {
    searchModels(brandId: $brandId, name: $name) {
      type
    }
  }
`;

const ModelsPage = () => {
  const { brandId } = useParams();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false); // Disable infinite scroll for now
  const { t } = useLanguage();

  // Fetch types with dummy values for required args
  const { data: typesData } = useQuery(GET_GUITAR_TYPES, {
    variables: { brandId: brandId || '', name: '' }, // Placeholder values
  });

  // Fetch models
  const { loading, error, data, refetch } = useQuery(GET_MODELS, {
    variables: { 
      id: brandId, 
      sortBy: { field: "name", order: "ASC" } // Corrected to use 'order' instead of 'direction'
    },
    onCompleted: (data) => {
      setItems(data.findBrandModels || []);
    },
  });

  const loadMore = () => {
    // Disable for now until pagination is clarified
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // Implement client-side search
    setItems(data.findBrandModels.filter((m) =>
      m.name.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setItems(data.findBrandModels.filter((m) =>
      e.target.value ? m.type === e.target.value : true
    ));
  };

  if (loading && items.length === 0) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{t('error')}</Alert>;

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <Form.Control
            placeholder={t('searchByName')}
            value={search}
            onChange={handleSearchChange}
          />
        </Col>
        <Col>
          <Form.Select value={type} onChange={handleTypeChange}>
            <option value="">{t('filterByType')}</option>
            {typesData?.searchModels.map((model, index) => (
              <option key={index} value={model.type}>{model.type}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<Spinner animation="border" />}
        endMessage={<p>{t('loading')}</p>}
      >
        <Card>
          <Card.Header>{t('guitarModels')}</Card.Header>
          <ListGroup variant="flush">
            {items.map((model) => (
              <ListGroup.Item key={model.id}>
                <Link to={`/details/${brandId}/${model.id}`}>{model.name} ({model.type})</Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </InfiniteScroll>
    </div>
  );
};

export default ModelsPage;