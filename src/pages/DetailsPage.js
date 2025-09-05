import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Table, Spinner, Alert, Card } from 'react-bootstrap';
import './DetailsPage.css';

const GET_MODEL_DETAILS = gql`
  query GetModel($brandId: ID!, $modelId: ID!) {
    findUniqueModel(brandId: $brandId, modelId: $modelId) {
      id
      name
      description
      image
      specs {
        bodyWood
        neckWood
        fingerboardWood
        pickups
        tuners
        scaleLength
        bridge
      }
      musicians {
        name
      }
    }
  }
`;

const DetailsPage = () => {
  const { brandId, modelId } = useParams();
  const [visibleMusicians, setVisibleMusicians] = useState(2);

  const { loading, error, data } = useQuery(GET_MODEL_DETAILS, {
    variables: { brandId, modelId },
  });

  if (loading) return <Spinner animation="border" className="text-primary" />;
  if (error) return <Alert variant="danger">Error fetching data: {error.message}</Alert>;

  const guitar = data?.findUniqueModel;
  const specs = guitar?.specs || [];
  const musicians = guitar?.musicians || [];

  return (
    <div className="details-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1>{guitar.name}</h1>
          <p>{guitar.description}</p>
        </div>
        <div className="hero-image">
          <img src={guitar.image || '/assets/placeholder.png'} alt={guitar.name} />
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultActiveKey="specs" id="guitar-tabs" className="mb-3">
        {/* Specs */}
        <Tab eventKey="specs" title="Specifications">
          <Table striped bordered hover className="custom-table">
            <tbody>
              <tr>
                <td>Body Wood</td>
                <td>{specs.bodyWood || 'N/A'}</td>
              </tr>
              <tr>
                <td>Neck Wood</td>
                <td>{specs.neckWood || 'N/A'}</td>
              </tr>
              <tr>
                <td>Fingerboard</td>
                <td>{specs.fingerboardWood || 'N/A'}</td>
              </tr>
              <tr>
                <td>Pickups</td>
                <td>{specs.pickups || 'N/A'}</td>
              </tr>
              <tr>
                <td>Tuners</td>
                <td>{specs.tuners || 'N/A'}</td>
              </tr>
              <tr>
                <td>Scale Length</td>
                <td>{specs.scaleLength || 'N/A'}</td>
              </tr>
              <tr>
                <td>Bridge</td>
                <td>{specs.bridge || 'N/A'}</td>
              </tr>
            </tbody>
          </Table>
        </Tab>

        {/* Musicians */}
        <Tab eventKey="musicians" title="Who Plays It?">
          <div className="musicians-list">
            {musicians.slice(0, visibleMusicians).map((musician, index) => (
              <Card key={index} className="musician-card mb-2">
                <Card.Body>
                  <Card.Title>{musician.name}</Card.Title>
                </Card.Body>
              </Card>
            ))}
          </div>
          {visibleMusicians < musicians.length && (
            <button
              className="show-more-btn"
              onClick={() => setVisibleMusicians(prev => prev + 2)}
            >
              Show More
            </button>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default DetailsPage;
