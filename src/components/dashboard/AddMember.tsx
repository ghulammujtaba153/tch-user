import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import { AuthContext } from "../../context/userContext";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";

interface TeamMember {
  name: string;
  email: string;
  phone?: string;
  position?: string;
  role?: string;
  _id?: string;
}

interface MembersData {
  owner: TeamMember;
  teamMembers: TeamMember[];
}

interface Organization {
  _id: string;
  userId: TeamMember;
  teamMembers: TeamMember[];
}

const AddMember = () => {
  const [members, setMembers] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    organization: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    role: "",
  });
  const { user } = useContext<any>(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const fetchOrganization = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/organization/${user.userId}`);

      if (!res.data) {
        res = await axios.post(`${BASE_URL}/member/email`, {
          email: user?.email,
        });
        res = await axios.get(
          `${BASE_URL}/organization/orgId/${res.data.organization}`
        );
      }

      console.log("fetch organization", res.data);

      setOrganization(res.data);
      setOwner(res.data.userId);
    } catch (error) {
      console.error("No organization data found for user", error);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      if (!organization?._id) return;
      const res = await axios.get(`${BASE_URL}/member/${organization._id}`);
      console.log("fetch members", res.data);
      setMembers(res.data);
      setForm({
        organization: organization._id,
        name: "",
        email: "",
        phone: "",
        position: "",
        role: "",
      });
    } catch (error) {
      console.error("Error fetching members", error);
      toast.error("Error fetching members");
    }
  };

  useEffect(() => {
    if (organization) {
      fetchMembers();
    }
  }, [organization]);

  useEffect(() => {
    if (user?.userId) {
      fetchOrganization();
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/member`, form);
      toast.success("Member added!");
      setForm({
        organization: "",
        name: "",
        email: "",
        phone: "",
        position: "",
        role: "",
      });
      fetchOrganization();
    } catch (error) {
      toast.error(error.response.data.error);

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/member/${id}`);
      console.log(res.data);
      toast.success("Member deleted successfully");
      fetchMembers();
    } catch (error) {
      toast.error("Error deleting member");
    }
  };

  if (pageLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Team Members</h2>

      <div className="max-w-4xl mb-6 bg-white p-4 rounded-[20px] shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter member's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter member's email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter member's phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">Select position</option>
                <option value="admin">Admin</option>
                <option value="position1">Position 1</option>
                <option value="position2">Position 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">Select role</option>
                <option value="owner">Owner</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-[20px] shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Member List</h3>
        <ul className="space-y-2">
          {members && (
            <>
              {members?.length > 0 &&
                members.map((member, idx) => (
                  <li
                    key={idx}
                    className="border p-3 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {member.role}
                    </span>
                    {member.role !== "owner" && (
                      <span
                        onClick={() => handleDelete(member._id)}
                        className="text-xs text-gray-500 hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </span>
                    )}
                  </li>
                ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddMember;
