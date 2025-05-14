
import React, { useEffect, useState, useContext } from 'react';
import upload from '../../utils/upload';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import AddMember from '../../components/dashboard/AddMember';

const initialFormData = {
  userId: '',
  name: '',
  address: '',
  postalCode: '',
  city: '',
  country: '',
  description: '',
  logo: '',
  email: '',
  phone: '',
  socialMediaLinks: [''],
  certificate: '',
  cnic: '',
  supportingDocument: '',
};

const Organization = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [supportingFile, setSupportingFile] = useState<File | null>(null); // For local use only
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { user } = useContext<any>(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchOrganization = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/organization/${user.userId}`);
      const mergedData = {
        ...initialFormData,
        ...res.data,
        socialMediaLinks: res.data.socialMediaLinks ?? [''],
        userId: user?.userId,
      };
      setFormData(mergedData);
      setIsUpdateMode(true);

      if (res.data.logo) setLogoPreview(res.data.logo);
      if (res.data.certificate) setCertificatePreview(res.data.certificate);
      if (res.data.supportingDocument) {
        setDocumentPreview(`${SOCKET_URL}/${res.data.supportingDocument}`);
        setFormData((prev) => ({ ...prev, supportingDocument: res.data.supportingDocument }));
      }
    } catch (error) {
      console.log('No organization data found for user');
      setFormData({ ...initialFormData, userId: user.userId });
      setIsUpdateMode(false);
    } finally {
      setPageLoading(false);
    }
  };

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
    type: 'logo' | 'certificate' | 'supportingDocument'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    if (type === 'logo') {
      const url = await upload(file);
      setFormData((prev) => ({ ...prev, logo: url }));
      setLogoPreview(previewURL);
    } else if (type === 'certificate') {
      const url = await upload(file);
      setFormData((prev) => ({ ...prev, certificate: url }));
      setCertificatePreview(previewURL);
    } else if (type === 'supportingDocument') {
      setSupportingFile(file);
      setFormData((prev) => ({ ...prev, supportingDocument: file.name }));
      setDocumentPreview(previewURL);
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
      if (key === 'socialMediaLinks') {
        value.forEach((link: string, index: number) => {
          formDataToSend.append(`${key}[${index}]`, link);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });

    if (supportingFile) {
      formDataToSend.set('supportingDocument', supportingFile); // or 'supportingDoc' based on backend
    }

    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value); // For debugging
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const url = isUpdateMode
      ? `${BASE_URL}/organization/${user.userId}`
      : `${BASE_URL}/organization`;

    const method = isUpdateMode ? 'put' : 'post';

    const response = await axios[method](url, formDataToSend, config);
    toast.success(`Organization ${isUpdateMode ? 'updated' : 'created'} successfully!`);

    if (isUpdateMode) {
      fetchOrganization();
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Error saving organization');
  } finally {
    setLoading(false);
  }
};


if (pageLoading) {
  return <div>Loading...</div>;
}


  return (
    <div className="min-h-screen  py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isUpdateMode ? 'Update Organization' : 'Organization Registration'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Organization Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="CNIC" name="cnic" value={formData.cnic} onChange={handleChange} />
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
            <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
            <Input label="Country" name="country" value={formData.country} onChange={handleChange} required />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Social Media Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
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
            <button
              type="button"
              onClick={addSocialLink}
              className="text-blue-600 text-sm hover:underline mt-1"
            >
              + Add Another Link
            </button>
          </div>

          {/* File Uploads */}
          <FileUpload
            label="Organization Logo"
            onChange={(e) => handleFileChange(e, 'logo')}
            previewUrl={logoPreview}
          />
          <FileUpload
            label="Certificate"
            onChange={(e) => handleFileChange(e, 'certificate')}
            previewUrl={certificatePreview}
          />
          <FileUpload
            label="S18A certification"
            onChange={(e) => handleFileChange(e, 'supportingDocument')}
            previewUrl={documentPreview}
          />

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      <AddMember/>
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
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="file"
      accept="image/*,.pdf,.doc,.docx"
      onChange={onChange}
      className="w-full mb-2"
    />
    {previewUrl && (
      <div className="mt-2">
        {/\.(pdf|doc|docx)$/i.test(previewUrl) ? (
          <a
            href={previewUrl}
            download
            className="text-blue-600 underline"
          >
            📄 Download Document
          </a>
        ) : (
          <img src={previewUrl} alt="Preview" className="h-24 object-contain border rounded-md shadow" />
        )}
      </div>
    )}
  </div>
);

export default Organization;
