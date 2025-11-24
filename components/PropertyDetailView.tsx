
import React from 'react';
import RulerIcon from './icons/RulerIcon';
import BedIcon from './icons/BedIcon';
import BathIcon from './icons/BathIcon';
import ParkingIcon from './icons/ParkingIcon';
import { Property, TFunction } from '../types';

interface DetailSectionProps {
    title: string;
    children: React.ReactNode;
}

const DetailSection = ({ title, children }: DetailSectionProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold text-brand-primary mb-4 border-b pb-2">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const KeyDetailItem = ({ icon, value, label }: any) => (
  <div className="flex flex-col items-center text-center p-4 bg-brand-light rounded-lg">
    <div className="text-brand-primary mb-2">{icon}</div>
    <span className="text-lg font-bold text-brand-dark">{value}</span>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);

interface PropertyDetailViewProps {
    property: Property;
    t: TFunction;
    onBack: () => void;
    language: string;
}

const PropertyDetailView = ({ property, t, onBack, language }: PropertyDetailViewProps) => {
  const DetailRow = ({ label, value }: { label: string, value: any }) => (
    <div className="flex justify-between text-gray-700">
      <span className="font-medium">{label}:</span>
      <span className="text-gray-900">{Array.isArray(value) ? value.map(v => t(v)).join(', ') : value ?? 'N/A'}</span>
    </div>
  );

  return (
    <div className="animate-fade-in">
        <div className="bg-white shadow-sm">
             <div className="container mx-auto px-4">
                <button onClick={onBack} className="text-brand-primary font-semibold hover:text-brand-dark py-4 transition-colors flex items-center">
                    <span className={language === 'ar' ? 'transform rotate-180' : ''}>&larr; </span>
                    <span className="ms-2">{t('back_to_listings')}</span>
                </button>
             </div>
        </div>

        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Left/Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="overflow-hidden rounded-lg shadow-lg">
                            <img src={property.coverImage} alt={t(property.type as any)} className="w-full h-auto max-h-[500px] object-cover"/>
                        </div>
                        
                        <DetailSection title={t('key_details')}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <KeyDetailItem icon={<RulerIcon className="w-8 h-8"/>} value={`${property.size} m²`} label={t('property_size')} />
                                <KeyDetailItem icon={<BedIcon className="w-8 h-8"/>} value={property.bedrooms} label={t('bedrooms')} />
                                <KeyDetailItem icon={<BathIcon className="w-8 h-8"/>} value={property.bathrooms} label={t('bathrooms')} />
                                <KeyDetailItem icon={<ParkingIcon className="w-8 h-8"/>} value={property.parking} label={t('parking')} />
                            </div>
                        </DetailSection>

                        {property.description && (
                            <DetailSection title={t('description')}>
                                <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
                            </DetailSection>
                        )}

                        <DetailSection title={t('general_information')}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                <DetailRow label={t('construction_year')} value={property.constructionYear} />
                                <DetailRow label={t('furnished')} value={property.furnished ? t('yes') : t('no')} />
                                {property.totalFloors && <DetailRow label={t('total_floors')} value={property.totalFloors} />}
                                {property.floorNumber && <DetailRow label={t('floor_number')} value={property.floorNumber} />}
                                {property.elevator !== undefined && <DetailRow label={t('elevator')} value={property.elevator ? t('yes') : t('no')} />}
                            </div>
                        </DetailSection>

                        <DetailSection title={t('utilities_info')}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                <DetailRow label={t('water_source')} value={property.waterSource} />
                                <DetailRow label={t('electricity_source')} value={property.electricitySource} />
                             </div>
                        </DetailSection>
                    </div>

                    {/* Right/Sidebar Column */}
                    <aside className="lg:col-span-1 mt-8 lg:mt-0 lg:sticky top-24 self-start">
                       <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                           <span className="inline-block bg-brand-secondary text-white text-sm font-semibold px-3 py-1 rounded-full mb-2 capitalize">{t(property.type as any)}</span>
                           <h1 className="text-2xl font-bold text-brand-primary">{property.address[language] || property.address['en']}</h1>
                           <p className="text-4xl font-extrabold text-brand-dark">{`$${property.price.toLocaleString()}`}</p>
                           <a 
                             href={property.mapsLink} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="w-full block text-center bg-brand-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all text-lg"
                           >
                               {t('view_on_map')}
                           </a>
                       </div>
                    </aside>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PropertyDetailView;
