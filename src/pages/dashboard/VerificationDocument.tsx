import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import uploadPDF from "../../utils/uploadPDF";
import { BASE_URL, SOCKET_URL } from "../../config/url";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/userContext";
import Loading from "../../components/Loading";
import { FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";

const initialState = {
  registeration: "",
  VATRegisteration: "",
  bankVerification: "",
  SARSSection18A: "",
  NPOCertification: "",
  PBOCertification: "",
  principalID: "",
  AuthorisationLetter: "",
  status: "pending",
};

const docFields = [
  { key: "registeration", label: "Registration Certificate", required: true },
  { key: "VATRegisteration", label: "VAT Registration", required: false },
  { key: "bankVerification", label: "Bank Verification", required: true },
  { key: "SARSSection18A", label: "SARS Section 18A", required: false },
  { key: "NPOCertification", label: "NPO Certification", required: false },
  { key: "PBOCertification", label: "PBO Certification", required: false },
  { key: "principalID", label: "Principal ID", required: true },
  { key: "AuthorisationLetter", label: "Authorisation Letter", required: false },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <FaCheckCircle className="inline-block ml-1 text-sm" />;
    case "rejected":
      return <FaTimesCircle className="inline-block ml-1 text-sm" />;
    case "pending":
      return <FaClock className="inline-block ml-1 text-sm" />;
    default:
      return null;
  }
};

const VerificationDocuments = () => {
  const { user } = useContext<any>(AuthContext);
  const [form, setForm] = useState<any>(initialState);
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState<{ [key: string]: boolean }>({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [issues, setIssues] = useState<any>([]);
  const [stats, setStats] = useState<{ approved: number; pending: number; rejected: number }>({
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  // Helper for full URL
  const getFullUrl = (filePath: string) =>
    filePath?.startsWith("http") ? filePath : `${SOCKET_URL}/${filePath}`;

  // Fetch existing document if any
  useEffect(() => {
    const fetchDocs = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/verification-documents/${user.userId}`);
        if (res.data && res.data._id) {
          setForm(res.data);
          setIsUpdate(true);
        } else {
          setForm(initialState);
          setIsUpdate(false);
        }
      } catch {
        setForm(initialState);
        setIsUpdate(false);
      } finally {
        setPageLoading(false);
      }
    };
    if (user?.userId) fetchDocs();
  }, [user]);

  // Fetch issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/issue-report/${user.userId}?type=verificationDocuments`);
        if (res.data.type === "verificationDocuments") {
          setIssues(res.data);
        }
      } catch {}
    };
    if (user?.userId) fetchIssues();
  }, [user]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/verification-documents/stats/${user.userId}`);
        setStats(res.data);
      } catch {}
    };
    if (user?.userId) fetchStats();
  }, [user]);

  // Handle file upload for each field
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocLoading((prev) => ({ ...prev, [key]: true }));
    try {
      toast.loading("Uploading...");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${BASE_URL}/upload/upload-single`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss();
      setForm((prev) => ({
        ...prev,
        [key]: res.data.filePath ? `${SOCKET_URL}/${res.data.filePath}` : "",
      }));
      toast.success("File uploaded!");
    } catch {
      toast.error("Upload failed");
    }
    setDocLoading((prev) => ({ ...prev, [key]: false }));
  };

  // Handle remove file
  const handleRemoveFile = (key: string) => {
    setForm((prev: any) => ({ ...prev, [key]: "" }));
    
    // Clear the file input
    const fileInput = document.getElementById(`file-${key}`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Validate form before submission
  const validateForm = () => {
    for (const field of docFields) {
      if (field.required && !form[field.key]) {
        toast.error(`Please upload ${field.label}`);
        return false;
      }
    }
    return true;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      if (isUpdate) {
        await axios.put(`${BASE_URL}/verification-documents/${form._id}`, { ...form, user: user.userId });
        toast.success("Documents updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/verification-documents`, { ...form, user: user.userId });
        toast.success("Documents uploaded successfully!");
      }
      setIsEditable(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error saving documents.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Issues Alert - Show if rejected */}
        {form.status === "rejected" && issues?.issue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Issues Found with Your Submission
                </h3>
                <div className="text-sm text-red-700">
                  <p className="mb-2">Please address the following issues:</p>
                  <div className="bg-white border border-red-200 rounded-md p-3">
                    <p className="font-medium">Issue:</p>
                    <p className="mt-1">{issues.issue}</p>
                  </div>
                  <p className="mt-2 text-xs">
                    Please make the necessary corrections and resubmit your document.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4 sm:p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
              Verification Documents
            </h1>
            {form.status && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(form.status)}`}>
                {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                {getStatusIcon(form.status)}
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            These documents are required for compliance and verification purposes.
          </p>
        </div>

        {/* Main Form */}
        <div className="relative bg-white shadow-sm rounded-lg p-4 sm:p-6 lg:p-8">
          {/* Edit Button */}
          {!isEditable && (
            <button
              className="absolute top-4 right-4 bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 transition"
              onClick={() => setIsEditable(true)}
            >
              Edit Documents
            </button>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {docFields.map((field) => (
              <div key={field.key} className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <FileUpload
                  label={field.label}
                  onChange={(e) => isEditable && handleFileChange(e, field.key)}
                  previewUrl={form[field.key]}
                  required={field.required && !form[field.key]} // Only require if no existing file
                  isLoading={docLoading[field.key]}
                  disabled={!isEditable}
                  fieldKey={field.key}
                  onRemove={() => handleRemoveFile(field.key)}
                />
              </div>
            ))}

            <div className="flex justify-end pt-6 border-t border-gray-200">
              {isEditable && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditable(false)}
                    className="mr-4 w-full sm:w-auto bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : isUpdate ? "Update Documents" : "Add Documents"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FileUpload = ({
  label,
  onChange,
  previewUrl,
  required = false,
  isLoading = false,
  disabled = false,
  fieldKey,
  onRemove,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  required?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  fieldKey: string;
  onRemove: () => void;
}) => (
  <div className="w-full">
    <div className="relative">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
        onChange={onChange}
        required={required}
        disabled={isLoading || disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        id={`file-${fieldKey}`}
      />
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 ${
        isLoading || disabled
          ? 'opacity-50 cursor-not-allowed bg-gray-50'
          : 'hover:border-secondary hover:bg-gray-50 cursor-pointer'
      }`}>
        <div className="flex flex-col items-center justify-center space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-secondary"></div>
              </div>
              <p className="text-sm font-medium text-gray-700">Uploading...</p>
            </div>
          ) : previewUrl ? (
            <div className="flex flex-col items-center">
              {previewUrl.includes('.pdf') ? (
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <img 
                  src={previewUrl} 
                  alt={`${label} Preview`} 
                  className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg border shadow-sm mb-2" 
                />
              )}
              <p className="text-sm font-medium text-gray-700">{label} Uploaded</p>
              <p className="text-xs text-gray-500">Click to change</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-6 h-6 sm:w-8 sm:w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WebP, PDF up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    {previewUrl && !disabled && (
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          File uploaded successfully
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-600 hover:text-red-800 underline transition-colors duration-200"
        >
          Remove
        </button>
      </div>
    )}
  </div>
);

export default VerificationDocuments;