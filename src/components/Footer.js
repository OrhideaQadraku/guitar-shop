import React from 'react';
import './Footer.css';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src="/assets/logo.png" alt={t('vibeStringsLogo')} className="footer-logo" />
          <p>{t('contactEmail')}</p>
          <p>{t('location')}</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>{t('pages')}</h4>
            <ul>
              <li>{t('store')}</li>
              <li>{t('collections')}</li>
              <li>{t('support')}</li>
            </ul>
          </div>
          <div>
            <h4>{t('product')}</h4>
            <ul>
              <li>{t('terms')}</li>
              <li>{t('privacy')}</li>
              <li>{t('copyright')}</li>
            </ul>
          </div>
        </div>

        <div className="footer-right">
          <h4>{t('followUs')}</h4>
          <div className="social-icons">
            <img src="/assets/Facebook.svg" alt="Facebook" />
            <img src="/assets/Twitter.svg" alt="Twitter" />
            <img src="/assets/Instagram.png" alt="Instagram" />
          </div>

          <div className="language-switcher mt-3">
            <label>{t('language')}:</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">{t('english')}</option>
              <option value="mk">{t('macedonian')}</option>
              <option value="sq">{t('albanian')}</option>
            </select>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2022 {t('vibeStrings')}</div>
    </footer>
  );
};

export default Footer;
