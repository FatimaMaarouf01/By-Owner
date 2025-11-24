
import React, { useState } from 'react';
import { PropertySubmission, TFunction, Language, Property } from '../types';
import { SubmissionDetailModal } from './SubmissionDetailModal';

interface AdminViewProps {
    pendingSubmissions: PropertySubmission[];
    approvedSubmissions: PropertySubmission[];
    mockProperties: Property[];
    onApprove: (id: number, coverImage: string) => void;
    onReject: (id: number) => void;
    onRemovePublished: (id: number) => void;
    t: TFunction;
    language: Language;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
    pendingSubmissions, 
    approvedSubmissions,
    mockProperties,
    onApprove, 
    onReject, 
    onRemovePublished,
    t, 
    language 
}) => {
    const [selectedPendingSubmission, setSelectedPendingSubmission] = useState<PropertySubmission | null>(null);
    const [selectedPublishedSubmission, setSelectedPublishedSubmission] = useState<PropertySubmission | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'MarakibjiRealEstate' && password === 'M@rakibji_2@25') {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError(t('invalid_credentials'));
        }
    };

    if (!isAuthenticated) {
        return (
             <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-brand-primary mb-6 text-center">{t('admin_login')}</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('username')}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                        {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-dark transition-colors"
                        >
                            {t('login')}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const handleApprove = (coverImage: string) => {
        if (selectedPendingSubmission) {
            onApprove(selectedPendingSubmission.id, coverImage);
            setSelectedPendingSubmission(null);
        }
    };

    const handleReject = () => {
        if (selectedPendingSubmission) {
            onReject(selectedPendingSubmission.id);
            setSelectedPendingSubmission(null);
        }
    };

    const handleRemoveClick = (id: number) => {
        if (window.confirm(t('remove_property_confirm'))) {
            onRemovePublished(id);
        }
    };

    const renderSubmissionList = (submissions: PropertySubmission[]) => {
        if (submissions.length === 0) {
            return (
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <p className="text-gray-500">{t('no_pending_submissions')}</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {submissions.map((sub) => (
                    <div key={sub.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <span className='inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3 capitalize bg-yellow-200 text-yellow-800'>
                                        {t(sub.property.type)}
                                    </span>
                                    <h3 className="text-xl font-bold text-brand-primary mb-1">{sub.property.fullAddress}</h3>
                                    <p className="text-gray-600 text-sm">{t('owner_name')}: {sub.ownerName} | {sub.ownerPhone}</p>
                                </div>
                                <p className="text-2xl font-bold text-brand-secondary flex-shrink-0 mt-3 sm:mt-0 sm:ms-6">{`$${sub.property.price.toLocaleString()}`}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 flex justify-end items-center space-x-2 rtl:space-x-reverse">
                            <button 
                                onClick={() => setSelectedPendingSubmission(sub)}
                                className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-dark transition-colors text-sm"
                            >
                                {t('view_details')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    const renderPublishedList = () => {
        const totalPublished = mockProperties.length + approvedSubmissions.length;
        if (totalPublished === 0) {
            return (
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <p className="text-gray-500">{t('no_published_properties')}</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {approvedSubmissions.map((sub) => (
                    <div key={sub.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3 capitalize bg-green-200 text-green-800`}>
                                        {t(sub.property.type)}
                                    </span>
                                    <h3 className="text-xl font-bold text-brand-primary mb-1">{sub.property.fullAddress}</h3>
                                </div>
                                <p className="text-2xl font-bold text-brand-secondary flex-shrink-0 mt-3 sm:mt-0 sm:ms-6">{`$${sub.property.price.toLocaleString()}`}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 flex justify-end items-center space-x-2 rtl:space-x-reverse">
                             <button 
                                onClick={() => setSelectedPublishedSubmission(sub)}
                                className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                            >
                                {t('view_details')}
                            </button>
                            <button
                                onClick={() => handleRemoveClick(sub.id)}
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                                {t('remove')}
                            </button>
                        </div>
                    </div>
                ))}
                {mockProperties.map((prop) => (
                    <div key={prop.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3 capitalize bg-blue-200 text-blue-800`}>
                                        {t(prop.type)} (Mock)
                                    </span>
                                    <h3 className="text-xl font-bold text-brand-primary mb-1">{prop.address[language] || prop.address.en}</h3>
                                </div>
                                <p className="text-2xl font-bold text-brand-secondary flex-shrink-0 mt-3 sm:mt-0 sm:ms-6">{`$${prop.price.toLocaleString()}`}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 flex justify-end items-center space-x-2 rtl:space-x-reverse">
                            <button
                                onClick={() => handleRemoveClick(prop.id)}
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                                {t('remove')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-primary">{t('admin_panel')}</h2>
                </div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 flex border-b">
                        <button 
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors ${activeTab === 'pending' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-dark'}`}
                        >
                            {t('pending_submissions')} ({pendingSubmissions.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('published')}
                            className={`px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors ${activeTab === 'published' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-dark'}`}
                        >
                            {t('published_properties')} ({mockProperties.length + approvedSubmissions.length})
                        </button>
                    </div>

                    {activeTab === 'pending' && renderSubmissionList(pendingSubmissions)}
                    {activeTab === 'published' && renderPublishedList()}
                </div>
            </div>
            {selectedPendingSubmission && (
                <SubmissionDetailModal
                    submission={selectedPendingSubmission}
                    isOpen={!!selectedPendingSubmission}
                    onClose={() => setSelectedPendingSubmission(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    t={t}
                    language={language}
                    viewMode="review"
                />
            )}
             {selectedPublishedSubmission && (
                <SubmissionDetailModal
                    submission={selectedPublishedSubmission}
                    isOpen={!!selectedPublishedSubmission}
                    onClose={() => setSelectedPublishedSubmission(null)}
                    onApprove={() => {}} // dummy
                    onReject={() => {}} // dummy
                    t={t}
                    language={language}
                    viewMode="viewOnly"
                />
            )}
        </>
    );
};
