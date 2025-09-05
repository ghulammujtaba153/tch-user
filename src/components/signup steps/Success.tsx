import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/userContext";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import { toast } from "react-toastify";
import ScrollToTop from "../../utils/ScrollToTop";
// import ReactGA from "react-ga"; // Uncomment if using GA

const Success = ({ data }) => {
  const navigate = useNavigate();
  const { login, setUser } = useContext(AuthContext) || { login: () => {}, setUser: () => {} };
  const [loading, setLoading] = useState(false);
  console.log("data", data)

  const handleDone = async () => {
    try {
      setLoading(true);

      // Auto login after success
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email: data.email,
        password: data.password,
      });

      if (res.data.user.role === "admin") {
        toast.error("Admin can't login from this page");
        setLoading(false);
        return;
      }

      const token = res.data.token;
      const user = {
        userId: res.data.user._id,
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role,
        profilePicture: res.data.user.profilePicture,
        organization: res.data.user.organization,
      };

      // Save in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      const redirectToOrganization = data.wantsOrganization
      

      // Update context
      login(user, token);

      // Track event if GA is enabled
      // ReactGA.event({
      //   category: "User",
      //   action: "Login",
      //   label: "Login Form Submission",
      // });

      toast.success("Login successful!");

      // Use setTimeout to ensure context is updated before navigation
      setTimeout(() => {
        console.log("context user on login", user);
        
        // Redirect user
        if (redirectToOrganization) {
          navigate("/user/dashboard/organization");
        } else {
          navigate("/user/dashboard/stats");
        }
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xxxl shadow-lg">
      <ScrollToTop />
      <div className="flex flex-col items-center justify-center min-h-[300px] px-4 text-center">
        <h2 className="text-2xl font-bold text-secondary mb-4">Success!</h2>
        <p className="text-gray-700 mb-6">Your account has been created successfully.</p>
        <button
          onClick={handleDone}
          disabled={loading}
          className={`bg-secondary text-white px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Done"}
        </button>
      </div>
    </div>
  );
};

export default Success;
