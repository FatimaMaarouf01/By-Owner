import React, { useState } from 'react';
import { PropertySubmission, TFunction, Language } from '../types';
import { PdfIcon } from './icons/PdfIcon';

interface SubmissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PropertySubmission;
  onApprove: (coverImage: string) => void;
  onReject: () => void;
  t: TFunction;
  language: Language;
  viewMode?: 'review' | 'viewOnly';
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode; gridCols?: number }> = ({ title, children, gridCols = 2 }) => (
    <div>
      <h3 className="text-lg font-bold text-brand-primary mb-3 border-b pb-2">{title}</h3>
      <div className={`grid grid-cols-1 md:grid-cols-${gridCols} gap-x-6 gap-y-2 text-sm`}>{children}</div>
    </div>
);

const DetailRow: React.FC<{ label: string; value: string | number | boolean | undefined | string[] }> = ({ label, value }) => (
  <div className="flex justify-between py-1 items-start">
    <span className="font-semibold text-gray-600 flex-shrink-0">{label}:</span>
    <span className="text-gray-900 text-right ps-2">{
        Array.isArray(value) ? value.join(', ') :
        value === true ? 'Yes' : 
        value === false ? 'No' : 
        value ?? 'N/A'
    }</span>
  </div>
);

const FilePreview: React.FC<{ fileSrc: string; index: number; type: 'doc' | 'id' | 'img'; t: TFunction;}> = ({ fileSrc, index, type, t }) => {
    const isPdf = fileSrc.startsWith('data:application/pdf');
    return (
        <a 
            href={fileSrc} 
            target="_blank" 
            rel="noopener noreferrer" 
            key={`${type}-${index}`} 
            className="group block w-full h-24 rounded-md border border-gray-200 flex flex-col items-center justify-center text-center p-2 hover:bg-gray-50 transition-colors relative overflow-hidden"
        >
          {isPdf ? (
            <>
                <PdfIcon className="w-8 h-8 text-red-500 mb-1" />
                <span className="text-xs text-gray-600 block truncate">{t('view')} PDF</span>
            </>
          ) : (
            <img src={fileSrc} alt={`Uploaded file ${index + 1}`} className="w-full h-full object-cover rounded-sm" />
          )}
        </a>
    );
};


export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  isOpen,
  onClose,
  submission,
  onApprove,
  onReject,
  t,
  language,
  viewMode = 'review',
}) => {
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;

  const handleApproveClick = () => {
    if (!selectedCoverImage) {
        setError('Please select a cover image to approve the submission.');
        return;
    }
    onApprove(selectedCoverImage);
  }
  
  const { property } = submission;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-auto transform transition-all animate-fade-in-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-brand-dark">{t('property_details')}</h2>
                <p className="text-gray-500">{property.fullAddress}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh]">
            <DetailSection title={t('owner_information')}>
                <DetailRow label={t('owner_name')} value={submission.ownerName} />
                <DetailRow label={t('owner_phone')} value={submission.ownerPhone} />
            </DetailSection>

            <DetailSection title={t('general_information')}>
                <DetailRow label={t('property_type')} value={t(property.type)} />
                <DetailRow label={t('property_size')} value={`${property.size} m²`} />
                <DetailRow label={t('property_price')} value={`$${property.price.toLocaleString()}`} />
                <DetailRow label={t('construction_year')} value={property.constructionYear} />
                <DetailRow label={t('furnished')} value={property.furnished} />
                
                {property.bedrooms > 0 && <DetailRow label={t('bedrooms')} value={property.bedrooms} />}
                {property.bathrooms > 0 && <DetailRow label={t('bathrooms')} value={property.bathrooms} />}
                {property.livingRooms > 0 && <DetailRow label={t('living_rooms')} value={property.livingRooms} />}
                {property.kitchens > 0 && <DetailRow label={t('kitchens')} value={property.kitchens} />}
                {property.balconies > 0 && <DetailRow label={t('balconies')} value={property.balconies} />}
               
                {property.totalFloors !== undefined && <DetailRow label={t('total_floors')} value={property.totalFloors} />}
                {property.floorNumber !== undefined && <DetailRow label={t('floor_number')} value={property.floorNumber} />}
                {property.elevator !== undefined && <DetailRow label={t('elevator')} value={property.elevator} />}
            </DetailSection>
            
            {property.description && (
                <DetailSection title={t('description')} gridCols={1}>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{property.description}</p>
                </DetailSection>
            )}

             <DetailSection title={t('utilities_info')}>
                <DetailRow label={t('water_source')} value={property.waterSource} />
                <DetailRow label={t('electricity_source')} value={property.electricitySource.map(s => t(s as any)).join(', ')} />
                <DetailRow label={t('parking_spaces')} value={property.parking} />
            </DetailSection>

            <DetailSection title={t('location_info')} gridCols={1}>
                <DetailRow label={t('google_maps_link')} value={property.mapsLink} />
                <DetailRow label={t('full_address')} value={property.fullAddress} />
            </DetailSection>

            <DetailSection title={t('uploaded_documents')} gridCols={1}>
                {submission.uploadedDocuments.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {submission.uploadedDocuments.map((src, index) => <FilePreview fileSrc={src} index={index} type="doc" t={t} />)}
                    </div>
                ) : <p className="text-gray-500 text-sm">{t('no_documents_uploaded')}</p>}
            </DetailSection>

            <DetailSection title={t('owner_id_card_view')} gridCols={1}>
                {submission.uploadedOwnerId.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {submission.uploadedOwnerId.map((src, index) => <FilePreview fileSrc={src} index={index} type="id" t={t} />)}
                    </div>
                ) : <p className="text-gray-500 text-sm">{t('no_id_uploaded')}</p>}
            </DetailSection>
        </div>

        {viewMode === 'review' ? (
            <div className="p-6 bg-gray-50 border-t space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('choose_cover_image')} <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {submission.uploadedImages.map((imgSrc, index) => (
                            <div key={index} className="relative cursor-pointer group" onClick={() => {
                                setSelectedCoverImage(imgSrc);
                                setError('');
                            }}>
                                <img 
                                    src={imgSrc} 
                                    alt={`Uploaded property image ${index + 1}`}
                                    className={`w-full h-24 object-cover rounded-md border-4 transition-all ${selectedCoverImage === imgSrc ? 'border-brand-secondary' : 'border-transparent group-hover:border-gray-300'}`}
                                />
                                {selectedCoverImage === imgSrc && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </div>
                <div className="flex justify-end items-center space-x-3 rtl:space-x-reverse">
                     <button 
                        onClick={onReject}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        {t('reject')}
                    </button>
                     <button 
                        onClick={handleApproveClick}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                        {t('approve')}
                    </button>
                </div>
            </div>
        ) : (
             <div className="p-6 bg-gray-50 border-t flex justify-end items-center">
                 <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    {t('close')}
                </button>
             </div>
        )}
      </div>
    </div>
  );
};