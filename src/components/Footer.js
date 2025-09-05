import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Form } from 'react-bootstrap';

const Footer = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="bg-light p-3 mt-4 text-center">
      <Form.Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ width: '200px', margin: '0 auto' }}
      >
        <option value="en">{t('english')}</option>
        <option value="mk">{t('macedonian')}</option>
        <option value="sq">{t('albanian')}</option>
      </Form.Select>
    </footer>
  );
};

export default Footer;