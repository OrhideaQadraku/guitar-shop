import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrandsPage from './pages/BrandsPage';
import ModelsPage from './pages/ModelsPage';
import DetailsPage from './pages/DetailsPage';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

const httpLink = createHttpLink({
  uri: 'https://graphql-api-brown.vercel.app/api/graphql',
  fetchOptions: {
    method: 'GET', // Force GET requests
  },
});

const authLink = setContext((_, { headers }) => {
  // Add headers if required (none needed for now)
  return {
    headers: {
      ...headers,
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <LanguageProvider>
        <Router>
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<BrandsPage />} />
              <Route path="/models/:brandId" element={<ModelsPage />} />
              <Route path="/details/:brandId/:modelId" element={<DetailsPage />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </LanguageProvider>
    </ApolloProvider>
  );
}

export default App;