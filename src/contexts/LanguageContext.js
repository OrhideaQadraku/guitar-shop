import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    guitarBrands: 'Guitar Brands',
    guitarModels: 'Guitar Models',
    searchByName: 'Search by name',
    filterByType: 'Filter by type',
    specs: 'Specs',
    musicians: 'Musicians',
    showMore: 'Show more',
    loading: 'Loading...',
    error: 'Error fetching data',
    english: 'English',
    macedonian: 'Macedonian',
    albanian: 'Albanian',
  },
  mk: {
    guitarBrands: 'Брендови на гитари',
    guitarModels: 'Модели на гитари',
    searchByName: 'Пребарување по име',
    filterByType: 'Филтрирај по тип',
    specs: 'Спецификации',
    musicians: 'Музичари',
    showMore: 'Погледни повеќе',
    loading: 'Се вчитува...',
    error: 'Грешка при преземање на податоци',
    english: 'Англиски',
    macedonian: 'Македонски',
    albanian: 'Албански',
  },
  sq: {
    guitarBrands: 'Marka të Gitarës',
    guitarModels: 'Modele të Gitarës',
    searchByName: 'Kërko sipas emrit',
    filterByType: 'Filtro sipas llojit',
    specs: 'Specifikime',
    musicians: 'Muzikantë',
    showMore: 'Trego më shumë',
    loading: 'Duke u ngarkuar...',
    error: 'Gabim gjatë marrjes së të dhënave',
    english: 'Anglisht',
    macedonian: 'Maqedonisht',
    albanian: 'Shqip',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);