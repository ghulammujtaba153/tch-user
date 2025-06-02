import React, {
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";
import { AuthContext } from "../../context/userContext";
import { BASE_URL } from "../../config/url";

interface BankFormData {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: "Savings" | "Current";
  upiId: string;
}

const BankAccount: React.FC = () => {
  const [formData, setFormData] = useState<BankFormData>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    accountType: "Savings",
    upiId: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/bank/${user.userId}`);
        console.log("fetching bacnk", res.data);

        // Only set form and update flag if meaningful data is found
        if (res.data && res.data.accountNumber) {
          setFormData(res.data);
          setIsUpdate(true);
        }
      } catch (error: any) {
        console.log("No bank info found or error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchBankDetails();
    }
  }, [user?.userId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isUpdate ? `bank/${user.userId}` : "bank/create";
      const method = isUpdate ? "put" : "post";

      await axios[method](`${BASE_URL}/${endpoint}`, {
        userId: user.userId,
        ...formData,
      });

      alert(`Bank details ${isUpdate ? "updated" : "added"} successfully`);
    } catch (error: any) {
      alert("Error saving bank details: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Bank Account Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="accountHolderName">Account</label>
          <input
            type="text"
            name="accountHolderName"
            placeholder="Account Holder Name"
            value={formData.accountHolderName}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black outline-secondary"
            required
          />
        </div>

        <div>
          <label htmlFor="accountName">Account Name</label>
          <input
            type="text"
            name="bankName"
            placeholder="Bank Name"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black outline-secondary"
            required
          />
        </div>
        <div>
          <label htmlFor="accountNumber">Account Name</label>
          <input
            type="text"
            name="accountNumber"
            placeholder="Account Number"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black outline-secondary"
            required
          />
        </div>

        <div>
          <label htmlFor="ifscCode">ifscCode</label>
          <input
            type="text"
            name="ifscCode"
            placeholder="IFSC Code"
            value={formData.ifscCode}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black outline-secondary"
            required
          />
        </div>

        <div>
          <label htmlFor="branchName">Branch Name</label>
          <input
            type="text"
            name="branchName"
            placeholder="Branch Name"
            value={formData.branchName}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black outline-secondary"
          />
        </div>

        <div>
          <label htmlFor="accountType">Account Type</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black outline-secondary"
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>
        </div>

        <div>
          <label htmlFor="UPI">UPI ID (Optional)</label>
          <input
            type="text"
            name="upiId"
            placeholder="UPI ID (Optional)"
            value={formData.upiId}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black outline-secondary"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-secondary text-white py-2 rounded hover:scale-105 transition-transform duration-300"
        >
          {isLoading
            ? "Saving..."
            : isUpdate
            ? "Update Bank Info"
            : "Add Bank Info"}
        </button>
      </form>
    </div>
  );
};

export default BankAccount;
