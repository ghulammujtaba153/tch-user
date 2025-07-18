import React, { useEffect, useState, useContext } from 'react';
import upload from '../../utils/upload';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import AddMember from '../../components/dashboard/AddMember';
import Loading from '../../components/Loading';
import DonationBtn from '../../components/dashboard/DonationBtn';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { useAppConfig } from '../../context/AppConfigContext';

const initialFormData = {
  userId: '',
  name: '',
  organizationType: '',
  tags: '',
  description: '',
  logo: '',
  supportingDoc: '',
  address1: '',
  address2: '',
  postalCode: '',
  city: '',
  state: '',
  country: '',
  email: '',
  phone: '',
  web: '',
  socialMediaLinks: [''],
  firstName: '',
  lastName: '',
  personPhone: '',
  role: '',
  founderId: '',
  founderDocument: '',
  accountHolderName: '',
  identificationType: '',
  identification: '',
  reference: '',
  accountNo: '',
  accountType: '',
  bankName: '',
  bankDocument: '',
  donorsRange: '',
  staff: false,
  crowdfund: false,
  eventCrowdfund: false,
  suppoters: '',
  vatNumber: '',
  emisNumber: '',
  status: ""
};

const Organization = () => {
  const [formData, setFormData] = useState<any>(initialFormData);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [supportingFile, setSupportingFile] = useState<File | null>(null); // For local use only
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { user } = useContext<any>(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [founderDocumentPreview, setFounderDocumentPreview] = useState<string | null>(null);
  const [bankDocumentPreview, setBankDocumentPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [supportingDocFile, setSupportingDocFile] = useState<File | null>(null);
  const [founderDocFile, setFounderDocFile] = useState<File | null>(null);
  const [bankDocFile, setBankDocFile] = useState<File | null>(null);
  const [founderIdPreview, setFounderIdPreview] = useState<string | null>(null);
  const [founderIdFile, setFounderIdFile] = useState<File | null>(null);
  const [isses, setIssues] = useState<any>("");
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Organization | ${config.name}`;
    }
  }, [config]);


  const fetchOrganization = async () => {
    const getFullUrl = (filePath: string) =>
      filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;
    try {
      let res = await axios.get(`${BASE_URL}/organization/${user.userId}`);
      console.log("fetch organization", res.data);
      setOrganization(res.data);
      if (!res?.data) {
        console.log("second way")

        res = await axios.post(`${BASE_URL}/member/email`, {
          email: user?.email,
        });

        res = await axios.get(`${BASE_URL}/organization/orgId/${res.data.organization}`);
      }
      const mergedData = {
        ...initialFormData,
        ...res.data,
        socialMediaLinks: res.data.socialMediaLinks ?? [''],
        userId: user?.userId,
      };
      setFormData(mergedData);
      setIsUpdateMode(true);

      if (res.data.logo) setLogoPreview(getFullUrl(res.data.logo));
      if (res.data.certificate) setCertificatePreview(getFullUrl(res.data.certificate));
      if (res.data.supportingDoc) setDocumentPreview(getFullUrl(res.data.supportingDoc));
      if (res.data.founderId) setFounderIdPreview(getFullUrl(res.data.founderId));
      if (res.data.founderDocument) setFounderDocumentPreview(getFullUrl(res.data.founderDocument));
      if (res.data.bankDocument) setBankDocumentPreview(getFullUrl(res.data.bankDocument));
    } catch (error) {
      console.log('No organization data found for user');
      setFormData({ ...initialFormData, userId: user.userId });
      setIsUpdateMode(false);
    } finally {
      setPageLoading(false);
    }
  };


  const fetchIssues = async()=>{
    try {
      const res = await axios.get(`${BASE_URL}/issue-report/${user.userId}`)
      setIssues(res.data)
    } catch (error) {
      toast.error("error while fetching issue")
    }
  }


  useEffect(()=>{
    if(formData.status== "rejected"){
      fetchIssues()
    }
  },[formData.status])

  useEffect(() => {
    if (user?.userId) {
      fetchOrganization();
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === 'socialMediaLinks' && index !== undefined) {
      const updatedLinks = [...formData.socialMediaLinks];
      updatedLinks[index] = value;
      setFormData({ ...formData, socialMediaLinks: updatedLinks });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'supportingDoc' | 'founderId' | 'founderDocument' | 'bankDocument'
  ) => {
    const file = e.target.files?.[0];
    
    // If no file is selected, clear the preview and file
    if (!file) {
      if (type === 'logo') {
        setLogoFile(null);
        setLogoPreview(null);
        setFormData((prev) => ({ ...prev, logo: '' }));
      } else if (type === 'supportingDoc') {
        setSupportingDocFile(null);
        setDocumentPreview(null);
        setFormData((prev) => ({ ...prev, supportingDoc: '' }));
      } else if (type === 'founderId') {
        setFounderIdFile(null);
        setFounderIdPreview(null);
        setFormData((prev) => ({ ...prev, founderId: '' }));
      } else if (type === 'founderDocument') {
        setFounderDocFile(null);
        setFounderDocumentPreview(null);
        setFormData((prev) => ({ ...prev, founderDocument: '' }));
      } else if (type === 'bankDocument') {
        setBankDocFile(null);
        setBankDocumentPreview(null);
        setFormData((prev) => ({ ...prev, bankDocument: '' }));
      }
      return;
    }
    
    const previewURL = URL.createObjectURL(file);
    if (type === 'logo') {
      setLogoFile(file);
      setLogoPreview(previewURL);
      setFormData((prev) => ({ ...prev, logo: file.name }));
    } else if (type === 'supportingDoc') {
      setSupportingDocFile(file);
      setDocumentPreview(previewURL);
      setFormData((prev) => ({ ...prev, supportingDoc: file.name }));
    } else if (type === 'founderId') {
      setFounderIdFile(file);
      setFounderIdPreview(previewURL);
      setFormData((prev) => ({ ...prev, founderId: file.name }));
    } else if (type === 'founderDocument') {
      setFounderDocFile(file);
      setFounderDocumentPreview(previewURL);
      setFormData((prev) => ({ ...prev, founderDocument: file.name }));
    } else if (type === 'bankDocument') {
      setBankDocFile(file);
      setBankDocumentPreview(previewURL);
      setFormData((prev) => ({ ...prev, bankDocument: file.name }));
    }
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialMediaLinks: [...prev.socialMediaLinks, ''],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'socialMediaLinks' && Array.isArray(value)) {
          value.forEach((link: string, index: number) => {
            formDataToSend.append(`${key}[${index}]`, link);
          });
        } else if (typeof value === 'string' || typeof value === 'boolean') {
          formDataToSend.append(key, value as any);
        }
      });
      // Only add files if they are newly uploaded (not existing from API)
      if (logoFile) formDataToSend.set('logo', logoFile);
      if (supportingDocFile) formDataToSend.set('supportingDoc', supportingDocFile);
      if (founderIdFile) formDataToSend.set('founderId', founderIdFile);
      if (founderDocFile) formDataToSend.set('founderDocument', founderDocFile);
      if (bankDocFile) formDataToSend.set('bankDocument', bankDocFile);
      
      // For update mode, include existing file paths if no new files are uploaded
      if (isUpdateMode) {
        if (!logoFile && formData.logo) formDataToSend.set('existingLogo', formData.logo);
        if (!supportingDocFile && formData.supportingDoc) formDataToSend.set('existingSupportingDoc', formData.supportingDoc);
        if (!founderIdFile && formData.founderId) formDataToSend.set('existingFounderId', formData.founderId);
        if (!founderDocFile && formData.founderDocument) formDataToSend.set('existingFounderDocument', formData.founderDocument);
        if (!bankDocFile && formData.bankDocument) formDataToSend.set('existingBankDocument', formData.bankDocument);
      }
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const url = isUpdateMode ? `${BASE_URL}/organization/${user.userId}` : `${BASE_URL}/organization`;
      
      const method = isUpdateMode ? 'put' : 'post';

      if(!isUpdateMode){
        formDataToSend.delete('status');
      }
      const response = await axios[method](url, formDataToSend, config);
      toast.success(`Organization ${isUpdateMode ? 'updated' : 'created'} successfully!`);
      if (isUpdateMode) fetchOrganization();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error saving organization');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (pageLoading) {
    return <div className='flex justify-center items-center'><Loading /></div>
  }

  return (
    <div className="py-10 px-4 md:px-8">
      <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <p className={`absolute top-4 left-4 text-gray-500 cursor-pointer flex items-center  px-2 py-1 rounded-full ${formData?.status === 'active' ? 'bg-green-300 text-green-800' : formData?.status === 'suspended' ? 'bg-red-300 text-red-800' : 'bg-yellow-300 text-yellow-800'}`}>
          {formData?.status} {formData?.status === 'active' && <FaCheckCircle className='inline-block ml-1' />} {formData?.status === 'suspended' && <FaTimesCircle className='inline-block ml-1' />}
          {formData?.status === 'pending' && <FaClock className='inline-block ml-1' />}
        </p>

        {formData?.status === 'rejected' &&
        <>
          <p className='mt-4 text-sm text-gray-600'>Please update your details to be active.</p>
          <p className='mt-4 text-sm font-bold text-gray-600'>{isses.issue}</p>
        </>
        }

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isUpdateMode ? 'Update Organization' : 'Organization Registration'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Organization Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Organization Details</h3>
            <p className="text-gray-500 mb-4 text-sm">Basic information about your organization.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Organization Name" name="name" value={formData.name} onChange={handleChange} required />
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleSelectChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Select the Organization Type</option>
                <option value="public">Public</option>
                <option value="indepedent/private">Independent/Private</option>
                <option value="specialised">Specialised</option>
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="school">School</option>
                <option value="technical">Technical</option>
                
              </select>
              <select
                name="tags"
                value={formData.tags}
                onChange={handleSelectChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Select the tag</option>
                <option value="environmentalWelfare">Environment Welfare</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="art">Art</option>
                <option value="others">Others</option>
              </select>

             <Input label="VAT Number" name="vatNumber" value={formData.vatNumber} onChange={handleChange} />
             <Input label="EMIS Number" name="emisNumber" value={formData.emisNumber} onChange={handleChange} />

              <Input label="Description" name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <FileUpload label="Organization Logo" onChange={(e) => handleFileChange(e, 'logo')} previewUrl={logoPreview} required={!isUpdateMode} />

            <p className='text-gray-600 text-sm mt-4'>An image speaks a thousand words! Try to upload your organisation's logo, or an image which give donors a sense of your organisation.</p>

            <FileUpload label="S18A Document" onChange={(e) => handleFileChange(e, 'supportingDoc')} previewUrl={documentPreview} required={false} />
            <p className='text-gray-600 text-sm'>Are you S18A registered? Upload your S18A certificate below. You can come back and do this at any time.</p>
          </div>
          {/* Section 2: Head Office Address */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Head Office Address</h3>
            <p className="text-gray-500 mb-4 text-sm">Where is your main office located?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Address 1" name="address1" value={formData.address1} onChange={handleChange} required />
              <Input label="Address 2" name="address2" value={formData.address2} onChange={handleChange} required />
              <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
              <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
              <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
              <Input label="Country" name="country" value={formData.country} onChange={handleChange} required />
            </div>
          </div>
          {/* Section 3: Public Info */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Public Info</h3>
            <p className="text-gray-500 mb-4 text-sm">Contact and public-facing information.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
              <Input label="Website" name="web" value={formData.web} onChange={handleChange} required />
            </div>
            <div>
              <label className="text-xl font-semibold mt-4">Social Media Links</label>
              {formData.socialMediaLinks.map((link, idx) => (
                <input
                  key={idx}
                  name="socialMediaLinks"
                  value={link}
                  onChange={(e) => handleChange(e, idx)}
                  placeholder={`Link #${idx + 1}`}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
              ))}
              <button type="button" onClick={addSocialLink} className="text-blue-600 text-sm hover:underline mt-1">+ Add Another Link</button>
            </div>
          </div>
          {/* Section 4: Main Contact Person */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Main Contact Person</h3>
            <p className="text-gray-500 mb-4 text-sm">Who should we contact for this organization?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
              <Input label="Phone" name="personPhone" value={formData.personPhone} onChange={handleChange} required />
              <select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                className="w-full border border-gray-300 rounded-md px-2"
                required
              >
                <option value="">Select the role</option>
                <option value="owner">Owner</option>
                <option value="ceo">Chief Executive Officer</option>
                <option value="analyst">Business Analyst</option>
                <option value="accountant">Accountant</option>
                <option value="assistant">Assistant</option>
              </select>
            </div>
          </div>
          {/* Section 5: Banking Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Banking Details</h3>
            <p className="text-gray-500 mb-4 text-sm">Bank account and verification information.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload label="Founder ID (file)" onChange={(e) => handleFileChange(e, 'founderId')} previewUrl={founderIdPreview} required={!isUpdateMode} />
              <FileUpload label="Founder Document" onChange={(e) => handleFileChange(e, 'founderDocument')} previewUrl={founderDocumentPreview} required={!isUpdateMode} />
              <Input label="Account Holder Name" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} required />
              <select
                name="identificationType"
                value={formData.identificationType}
                onChange={handleSelectChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Select the identification type</option>
                <option value="trustNumber">Trust Number</option>
                <option value="passportNumber">Passport Number</option>
              </select>
              <Input label="Identification" name="identification" value={formData.identification} onChange={handleChange} required />
              <Input label="Reference" name="reference" value={formData.reference} onChange={handleChange} required />
              <Input label="Account No" name="accountNo" value={formData.accountNo} onChange={handleChange} required />
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleSelectChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Select the account type</option>
                <option value="saving">Saving</option>
                <option value="business">Business</option>
                <option value="cheque">Cheque</option>
              </select>
              <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <FileUpload label="Bank Document" onChange={(e) => handleFileChange(e, 'bankDocument')} previewUrl={bankDocumentPreview} required={!isUpdateMode} />
            <p>Upload the necessary documents to prove validity of the banking details provided above.</p>
          </div>
          {/* Section 6: Other Info */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Other Information</h3>
            <p className="text-gray-500 mb-4 text-sm">Additional details about your organization.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Donors Range" name="donorsRange" value={formData.donorsRange} onChange={handleChange} />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="staff" checked={formData.staff} onChange={e => setFormData(prev => ({ ...prev, staff: e.target.checked }))} /> Staff
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="crowdfund" checked={formData.crowdfund} onChange={e => setFormData(prev => ({ ...prev, crowdfund: e.target.checked }))} /> Crowdfund
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="eventCrowdfund" checked={formData.eventCrowdfund} onChange={e => setFormData(prev => ({ ...prev, eventCrowdfund: e.target.checked }))} /> Event Crowdfund
              </label>
              <Input label="Supporters" name="suppoters" value={formData.suppoters} onChange={handleChange} />
            </div>
          </div>
          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-secondary text-white px-6 py-2 rounded-md hover:scale-105 duration-300 transition-transform">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* {user?.organization?.role == "owner" && <AddMember />}
      {user?.organization?.role == "owner" && <DonationBtn organizationId={organization?._id} />} */}

    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>
);

const FileUpload = ({
  label,
  onChange,
  previewUrl,
  required = false,
  onRemove,
  isUpdateMode = false,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  required?: boolean;
  onRemove?: () => void;
  isUpdateMode?: boolean;
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    
    <div className="relative">
      <input
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={onChange}
        required={required}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary transition-colors duration-200 bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center space-y-2">
          {previewUrl ? (
            <>
              {/\.(pdf|doc|docx)$/i.test(previewUrl) ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Document Uploaded</p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline mt-1"
                  >
                    📄 View Document
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg border shadow-sm mb-2" 
                  />
                  <p className="text-sm font-medium text-gray-700">Image Uploaded</p>
                  <p className="text-xs text-gray-500">Click to change</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, PDF, DOC up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    
    {previewUrl && (
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          File uploaded successfully
        </span>
        <button
          type="button"
          onClick={() => {
            // Clear the file input
            const fileInput = document.getElementById(`file-${label.replace(/\s+/g, '-').toLowerCase()}`) as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            // Trigger change event to clear preview
            const event = new Event('change', { bubbles: true });
            fileInput?.dispatchEvent(event);
          }}
          className="text-xs text-red-600 hover:text-red-800 underline"
        >
          Remove
        </button>
      </div>
    )}
  </div>
);

export default Organization;
