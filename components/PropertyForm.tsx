
import React from 'react';
import UploadIcon from './icons/UploadIcon';
import { TFunction, PropertySubmission, PropertyType } from '../types';

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8">
        <h3 className="text-2xl font-bold text-brand-primary mb-6 border-b-2 border-brand-secondary pb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const InputField = ({ label, placeholder, type = 'text', name, value, onChange, required=false, fullWidth=false }: any) => (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
        />
    </div>
);

interface SelectFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
    required?: boolean;
}

const SelectField = ({ label, name, value, onChange, children, required=false }: SelectFieldProps) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
        >
            {children}
        </select>
    </div>
);

const FileInput = ({ label, hint, name, onChange, accept, multiple=false, required=false, t}: any) => {
    const [fileName, setFileName] = React.useState('');
    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            if (multiple) {
                setFileName(`${e.target.files.length} files selected`);
            } else {
                setFileName(e.target.files[0].name);
            }
        } else {
            setFileName('');
        }
        onChange(e);
    };

    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor={name} className="relative cursor-pointer bg-white rounded-md font-medium text-brand-secondary hover:text-brand-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-secondary">
                            <span>{t('or_click_to_select')}</span>
                            <input id={name} name={name} type="file" className="sr-only" accept={accept} multiple={multiple} onChange={handleFileChange} required={required} />
                        </label>
                        <p className="ps-1">{t('drag_drop_files')}</p>
                    </div>
                    <p className="text-xs text-gray-500">{hint}</p>
                    {fileName && <p className="text-sm text-brand-secondary font-medium pt-2">{fileName}</p>}
                </div>
            </div>
        </div>
    );
}

interface PropertyFormProps {
    t: TFunction;
    language: string;
    onSubmitSuccess: (submission: PropertySubmission) => void;
}

const PropertyForm = ({ t, language, onSubmitSuccess }: PropertyFormProps) => {
    const [formData, setFormData] = React.useState({
        ownerName: '',
        ownerPhone: '',
        propertyType: '' as PropertyType | '',
        propertySize: '',
        bedrooms: '0',
        livingRooms: '0',
        balconies: '0',
        kitchens: '0',
        bathrooms: '0',
        furnished: 'no',
        totalFloors: '',
        floorNumber: '',
        elevator: 'no',
        constructionYear: '',
        waterSource: '',
        electricitySource: [] as string[],
        mapsLink: '',
        fullAddress: '',
        price: '',
        parking: '0',
        description: '',
    });

    const [files, setFiles] = React.useState({
        propertyImages: null as FileList | null,
        documents: null as FileList | null,
        ownerId: null as FileList | null,
    });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const sources = prev.electricitySource;
            if (checked) {
                return { ...prev, electricitySource: [...sources, value] };
            } else {
                return { ...prev, electricitySource: sources.filter(source => source !== value) };
            }
        });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files: inputFiles } = e.target;
        setFiles(prev => ({ ...prev, [name]: inputFiles }));
    };

    const filesToDataURLs = (fileList: FileList | null): Promise<string[]> => {
        if (!fileList) return Promise.resolve([]);
        const files = Array.from(fileList);
        const promises = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
        return Promise.all(promises);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const [uploadedImages, uploadedDocuments, uploadedOwnerId] = await Promise.all([
            filesToDataURLs(files.propertyImages),
            filesToDataURLs(files.documents),
            filesToDataURLs(files.ownerId),
        ]);

        const newSubmission: PropertySubmission = {
            id: Date.now(),
            status: 'pending',
            ownerName: formData.ownerName,
            ownerPhone: formData.ownerPhone,
            uploadedImages,
            uploadedDocuments,
            uploadedOwnerId,
            property: {
                type: formData.propertyType as PropertyType,
                size: Number(formData.propertySize),
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                livingRooms: Number(formData.livingRooms),
                balconies: Number(formData.balconies),
                kitchens: Number(formData.kitchens),
                bathrooms: Number(formData.bathrooms),
                furnished: formData.furnished === 'yes',
                constructionYear: Number(formData.constructionYear),
                waterSource: formData.waterSource,
                electricitySource: formData.electricitySource,
                mapsLink: formData.mapsLink,
                fullAddress: formData.fullAddress,
                parking: Number(formData.parking),
                description: formData.description,
                ...( (formData.propertyType === 'apartment' || formData.propertyType === 'commercial') && {
                    totalFloors: Number(formData.totalFloors),
                    floorNumber: Number(formData.floorNumber),
                    elevator: formData.elevator === 'yes',
                })
            }
        };

        onSubmitSuccess(newSubmission);
    };

    const propertyType = formData.propertyType;
    const showBuildingFields = propertyType === 'apartment' || propertyType === 'commercial';
    const showRoomFields = propertyType === 'apartment' || propertyType === 'villa' || propertyType === 'commercial';

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <FormSection title={t('owner_information')}>
                <InputField name="ownerName" label={t('owner_name')} placeholder={t('owner_name_placeholder')} value={formData.ownerName} onChange={handleInputChange} required />
                <InputField name="ownerPhone" type="tel" label={t('owner_phone')} placeholder={t('owner_phone_placeholder')} value={formData.ownerPhone} onChange={handleInputChange} required />
            </FormSection>

            <FormSection title={t('property_details')}>
                <SelectField name="propertyType" label={t('property_type')} value={formData.propertyType} onChange={handleInputChange} required>
                    <option value="">{t('select_property_type')}</option>
                    <option value="villa">{t('villa')}</option>
                    <option value="apartment">{t('apartment')}</option>
                    <option value="commercial">{t('commercial')}</option>
                    <option value="land">{t('land')}</option>
                </SelectField>
                <InputField name="propertySize" type="number" label={t('property_size')} placeholder={t('property_size_placeholder')} value={formData.propertySize} onChange={handleInputChange} required />
                
                {showRoomFields && (
                    <>
                        <InputField name="bedrooms" type="number" label={t('bedrooms')} placeholder="0" value={formData.bedrooms} onChange={handleInputChange} />
                        <InputField name="livingRooms" type="number" label={t('living_rooms')} placeholder="0" value={formData.livingRooms} onChange={handleInputChange} />
                        <InputField name="balconies" type="number" label={t('balconies')} placeholder="0" value={formData.balconies} onChange={handleInputChange} />
                        <InputField name="kitchens" type="number" label={t('kitchens')} placeholder="0" value={formData.kitchens} onChange={handleInputChange} />
                        <InputField name="bathrooms" type="number" label={t('bathrooms')} placeholder="0" value={formData.bathrooms} onChange={handleInputChange} />
                        <SelectField name="furnished" label={t('furnished')} value={formData.furnished} onChange={handleInputChange}>
                            <option value="no">{t('no')}</option>
                            <option value="yes">{t('yes')}</option>
                        </SelectField>
                    </>
                )}

                {showBuildingFields && (
                     <>
                        <InputField name="totalFloors" type="number" label={t('total_floors')} placeholder={t('total_floors_placeholder')} value={formData.totalFloors} onChange={handleInputChange} />
                        <InputField name="floorNumber" type="number" label={t('floor_number')} placeholder={t('floor_number_placeholder')} value={formData.floorNumber} onChange={handleInputChange} />
                        <SelectField name="elevator" label={t('elevator')} value={formData.elevator} onChange={handleInputChange}>
                            <option value="no">{t('no')}</option>
                            <option value="yes">{t('yes')}</option>
                        </SelectField>
                     </>
                )}
                
                <InputField name="constructionYear" type="number" label={t('construction_year')} placeholder={t('construction_year_placeholder')} value={formData.constructionYear} onChange={handleInputChange} required />
            </FormSection>

            <FormSection title={t('description')}>
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                    <textarea id="description" name="description" rows={4} placeholder={t('description_placeholder')} value={formData.description} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"></textarea>
                </div>
            </FormSection>
            
            <FormSection title={t('utilities')}>
                <InputField name="waterSource" label={t('water_source')} placeholder={t('water_source_placeholder')} value={formData.waterSource} onChange={handleInputChange} required />
                <InputField name="parking" type="number" label={t('parking_spaces')} placeholder={t('parking_spaces_placeholder')} value={formData.parking} onChange={handleInputChange} />
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('electricity_source')} <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {['solar', 'building_generator', 'other'].map(source => (
                            <div key={source} className="flex items-center">
                                <input
                                    id={`electricity_${source}`}
                                    name="electricitySource"
                                    type="checkbox"
                                    value={source}
                                    checked={formData.electricitySource.includes(source)}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 text-brand-secondary border-gray-300 rounded focus:ring-brand-secondary"
                                />
                                <label htmlFor={`electricity_${source}`} className="ms-2 block text-sm text-gray-900 rtl:me-2 rtl:ms-0">
                                    {t(source as any)}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </FormSection>
            
            <FormSection title={t('location')}>
                <div className="relative md:col-span-2">
                    <InputField name="mapsLink" label={t('google_maps_link')} placeholder={t('google_maps_link_placeholder')} value={formData.mapsLink} onChange={handleInputChange} fullWidth />
                    <button type="button" disabled title={t('pick_on_map_tooltip')} className="absolute bottom-2 end-2 rtl:start-2 rtl:end-auto bg-gray-200 text-gray-500 text-sm font-bold py-1 px-3 rounded cursor-not-allowed">{t('pick_on_map')}</button>
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 mb-1">{t('full_address')} <span className="text-red-500">*</span></label>
                    <textarea id="fullAddress" name="fullAddress" rows={3} placeholder={t('full_address_placeholder')} value={formData.fullAddress} onChange={handleInputChange} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"></textarea>
                 </div>
            </FormSection>

            <FormSection title={t('uploads')}>
                <FileInput name="propertyImages" label={t('property_images')} hint={t('property_images_hint')} onChange={handleFileChange} accept="image/*" multiple required t={t} />
                <FileInput name="documents" label={t('official_documents')} hint={t('official_documents_hint')} onChange={handleFileChange} accept="image/*,.pdf" multiple required t={t} />
                <FileInput name="ownerId" label={t('owner_id')} hint={t('owner_id_hint')} onChange={handleFileChange} accept="image/*" required t={t} />
            </FormSection>

            <FormSection title={t('pricing')}>
                 <InputField name="price" type="number" label={t('property_price')} placeholder={t('property_price_placeholder')} value={formData.price} onChange={handleInputChange} required fullWidth/>
            </FormSection>

            <div className="flex justify-end">
                <button type="submit" className="w-full md:w-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all text-lg transform hover:scale-105">
                    {t('submit_listing')}
                </button>
            </div>
        </form>
    );
};

export default PropertyForm;
