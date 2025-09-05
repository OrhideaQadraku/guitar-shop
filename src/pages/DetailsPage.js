import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';
import './DetailsPage.css';

const GET_GUITAR = gql`
  query GetGuitar($brandId: ID!, $modelId: ID!) {
    findUniqueModel(brandId: $brandId, modelId: $modelId) {
      id
      name
      type
      specs {
        bodyWood
        neckWood
        fingerboardWood
        pickups
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
  const { loading, error, data } = useQuery(GET_GUITAR, {
    variables: { brandId, modelId },
  });
  const { t } = useLanguage();

  if (loading) return <Spinner animation="border" className="text-primary" />;
  if (error) return <Alert variant="danger">{t('error')}</Alert>;

  const guitar = data?.findUniqueModel || {};
  const specs = guitar.specs || {};
  const musicians = guitar.musicians || [];

  const showMore = () => setVisibleMusicians((prev) => prev + 2);

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="card mx-auto" style={{ maxWidth: '600px', padding: '20px', backgroundColor: '#FFFFFF' }}>
        <Tabs defaultActiveKey="specs" id="guitar-tabs" className="mb-3">
          <Tab eventKey="specs" title={t('specs')} tabClassName="fw-bold fs-5 text-dark">
            <Table striped bordered hover className="custom-table">
              <tbody>
                <tr>
                  <td className="fw-bold text-dark">Body Wood</td>
                  <td>{specs.bodyWood || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Neck Wood</td>
                  <td>{specs.neckWood || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Fingerboard</td>
                  <td>{specs.fingerboardWood || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Pickups</td>
                  <td>{specs.pickups || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Number of Frets</td>
                  <td>Unavailable (pending schema update)</td>
                </tr>
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="musicians" title={t('musicians')} tabClassName="fw-bold fs-5 text-dark">
            <ul className="list-unstyled mb-3" style={{ paddingLeft: '0' }}>
              {musicians.slice(0, visibleMusicians).map((musician, index) => (
                <li key={index} className="mb-2" style={{ fontSize: '14px' }}>
                  {musician.name}
                </li>
              ))}
            </ul>
            {visibleMusicians < musicians.length && (
              <Button
                variant="primary"
                onClick={showMore}
                className="mt-2"
                style={{ padding: '8px 16px', backgroundColor: '#007BFF', borderColor: '#007BFF' }}
              >
                {t('showMore')}
              </Button>
            )}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default DetailsPage;