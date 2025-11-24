import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { PropertyForm } from './components/PropertyForm';
import { Footer } from './components/Footer';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { useTranslations } from './hooks/useTranslations';
import { Language, PropertyCategory, PropertySubmission, Property, FilterState } from './types';
import { MOCK_PROPERTIES } from './constants/mockData';
import { AdminView } from './components/AdminView';
import { PropertyDetailView } from './components/PropertyDetailView';
import { FilterBar, initialFilterState } from './components/FilterBar';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const { t, setLang } = useTranslations();
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'admin' | 'detail'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>('all');
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilterState);
  const [mockProperties, setMockProperties] = useState<Property[]>(MOCK_PROPERTIES);

  useEffect(() => {
    setLang(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    const bodyFont = language === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
    document.body.style.fontFamily = bodyFont;
  }, [language, setLang]);

  useEffect(() => {
    try {
      const storedSubmissions = localStorage.getItem('propertySubmissions');
      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
      }
    } catch (error) {
      console.error("Failed to parse submissions from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('propertySubmissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleFormSubmitSuccess = (newSubmission: PropertySubmission) => {
    setSubmissions(prev => [...prev, newSubmission]);
    setCurrentView('home');
    setIsModalOpen(true);
  };
  
  const handleShowHome = () => {
    setCurrentView('home');
    setActiveCategory('all');
    setSelectedProperty(null);
  };
  
  const handleShowAdmin = () => {
    setCurrentView('admin');
  };

  const handleSelectCategory = (category: PropertyCategory) => {
    setCurrentView('home');
    setActiveCategory(category);
  };

  const handleApproveSubmission = (id: number, coverImage: string) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'approved', coverImage } : s));
  };
  
  const handleRejectSubmission = (id: number) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
  };

  const handleRemoveProperty = (id: number) => {
    const isMock = mockProperties.some(p => p.id === id);
    if (isMock) {
        setMockProperties(prev => prev.filter(p => p.id !== id));
    } else {
        setSubmissions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleShowPropertyDetail = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView('detail');
  };
  
  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const handleResetFilters = () => {
    setActiveFilters(initialFilterState);
  };

  const PageTitle: React.FC<{title: string; subtitle: string}> = ({title, subtitle}) => (
    <div className="text-center my-8 md:my-12">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-primary">{title}</h2>
        <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
    </div>
  );

  const approvedProperties: Property[] = submissions
    .filter(s => s.status === 'approved')
    .map(s => ({
      ...s.property,
      id: s.id,
      address: { en: s.property.fullAddress, ar: s.property.fullAddress },
      coverImage: s.coverImage || `https://picsum.photos/seed/${s.id}/800/600`,
    }));

  const allVisibleProperties = [...mockProperties, ...approvedProperties];

  const filteredProperties = allVisibleProperties
    .filter(prop => activeCategory === 'all' || prop.type === activeCategory)
    .filter(prop => {
        const { location, minPrice, maxPrice, minSize, maxSize, bedrooms } = activeFilters;
        
        const locationMatch = !location || 
          prop.address.en.toLowerCase().includes(location.toLowerCase()) || 
          prop.address.ar.toLowerCase().includes(location.toLowerCase());
        
        const minPriceMatch = !minPrice || prop.price >= Number(minPrice);
        const maxPriceMatch = !maxPrice || prop.price <= Number(maxPrice);
        
        const minSizeMatch = !minSize || prop.size >= Number(minSize);
        const maxSizeMatch = !maxSize || prop.size <= Number(maxSize);
        
        const bedroomsMatch = !bedrooms || bedrooms === '0' || prop.bedrooms >= Number(bedrooms);
        
        return locationMatch && minPriceMatch && maxPriceMatch && minSizeMatch && maxSizeMatch && bedroomsMatch;
      }
    );


  return (
    <div className="bg-brand-light min-h-screen flex flex-col">
      <Header
        language={language}
        onLanguageToggle={handleLanguageToggle}
        t={t}
        onShowForm={() => setCurrentView('form')}
        onShowHome={handleShowHome}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <HeroSlider properties={allVisibleProperties.length > 0 ? allVisibleProperties : MOCK_PROPERTIES} t={t}/>
            <div className="container mx-auto px-4 py-8">
               <PageTitle title={t('featured_properties')} subtitle={t('explore_our_exclusive_listings')} />
              
               <FilterBar 
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                t={t}
               />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {filteredProperties.slice(0, 6).map((prop) => (
                  <div key={prop.id} onClick={() => handleShowPropertyDetail(prop)} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
                    <img src={prop.coverImage} alt={t(prop.type)} className="w-full h-56 object-cover"/>
                    <div className="p-6">
                      <span className="inline-block bg-brand-secondary text-white text-sm font-semibold px-3 py-1 rounded-full mb-3">{t(prop.type)}</span>
                      <h3 className="text-xl font-bold text-brand-primary mb-2">{prop.address[language] || prop.address['en']}</h3>
                      <p className="text-2xl font-bold text-brand-secondary">{`$${prop.price.toLocaleString()}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {currentView === 'form' && (
          <div className="container mx-auto px-4 py-8">
             <PageTitle title={t('list_your_property')} subtitle={t('by_owner_submission_form_subtitle')} />
            <PropertyForm t={t} language={language} onSubmitSuccess={handleFormSubmitSuccess} />
          </div>
        )}
        {currentView === 'admin' && (
            <AdminView
                t={t}
                language={language}
                pendingSubmissions={submissions.filter(s => s.status === 'pending')}
                approvedSubmissions={submissions.filter(s => s.status === 'approved')}
                mockProperties={mockProperties}
                onApprove={handleApproveSubmission}
                onReject={handleRejectSubmission}
                onRemovePublished={handleRemoveProperty}
            />
        )}
        {currentView === 'detail' && selectedProperty && (
            <PropertyDetailView property={selectedProperty} t={t} onBack={handleShowHome} language={language} />
        )}
      </main>
      <Footer t={t} onShowAdmin={handleShowAdmin}/>
      <SubmissionSuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        t={t}
      />
    </div>
  );
};

export default App;