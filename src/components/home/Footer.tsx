import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { BsSendFill } from "react-icons/bs";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAppConfig } from "../../context/AppConfigContext";
import { useState } from "react";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import { toast } from "react-toastify";

const Footer: React.FC = () => {
  const { config } = useAppConfig();
  const [data, setData] = useState<any>();

  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/social`);
      setData(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="w-full flex flex-col gap-8 font-sans">
      <div className="max-w-[1200px] mx-auto p-4">
        <div className="flex flex-col md:flex-row items-center justify-between bg-secondary max-h-[300px] rounded-xl overflow-hidden">
          {/* Left Section */}
          <div className="w-full md:w-1/2 h-full flex justify-center md:justify-start">
            <img
              src="/footer-img.jpg"
              alt="logo"
              className="w-full md:block hidden md:w-[90%] max-h-[300px] rounded-r-full object-cover"
            />
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-3 w-full p-2 md:w-1/2 text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-xl md:text-4xl font-bold text-white font-onest">
              Empower Change with every Donation!
            </h1>
            <p className="text-sm md:text-xs text-white">
              Join us in creating brighter futures by providing hope, delivering
              help, and fostering lasting change for schools in need across
              South Africa.
            </p>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-start">
              <Link
                to={"/home/campaigns/create"}
                className="text-white px-4 py-2 rounded-full flex items-center gap-2 "
              >
                START CAMPAIGN
                <img
                  src="/arrow-1.png"
                  alt="arrow"
                  className="w-[20px] h-[20px]"
                />
              </Link>
              <Link
                to={"/home/campaigns"}
                className="bg-white font-bold text-secondary px-4 py-2 rounded-full flex items-center gap-2"
              >
                Donate Now
                <ArrowRightIcon className="w-[20px] h-[20px]" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full mt-[40px]">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-sm text-secondary font-bold mb-2 font-onest">
                GROW WITH US
              </h2>

              <Link
                to="/signup"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                Register
              </Link>

              <Link
                to="/works"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                How it works
              </Link>

              <Link
                to="/guides"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                Help guides
              </Link>

              <Link
                to="/terms"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                Fees and payouts
              </Link>

              <Link
                to="/faqs"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                FAQs
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-sm text-secondary font-bold mb-2 font-onest uppercase">
                Quick Links
              </h2>

              {/*<Link
                to="/about"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                About us
              </Link>*/}

              <Link
                to="/support"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                Contact us
              </Link>

              <Link
                to="/support"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                Support
              </Link>
              {/* <a
                href="/blog"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                Articles
              </a> */}

              <Link
                to="/privacy"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                Privacy policy
              </Link>

              <Link
                to="/terms"
                className="text-sm hover:text-secondary transition-colors duration-300"
              >
                Terms and conditions
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-bold mb-2 text-secondary font-onest">POWERED BY</h2>
              <div className="flex">
                <img
                  src="SBBluelogo.png"
                  alt="logo"
                  className="w-[230px] h-[60px]"
                />
              </div>
              <div className="flex gap-2">
                <img
                  src="/mastercard_visa_logo.png"
                  alt="/"
                  className="w-[140px] h-[40px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-bold mb-2 font-onest text-secondary">CONTACT</h2>

              
              {/* <p className="text-sm font-bold mb-2 font-onest">
                General Contact
              </p> */}
              <p className="text-sm mb-2 ">Email us: info@givetogrow.co.za or</p>
              {/* <p className="text-sm mb-2 ">+27 87 474 2215</p> */}

              {/* <p className="text-sm font-bold mb-2 font-onest">Support</p> */}
              <p className="text-sm">support@givetogrow.co.za</p>
              <p className="text-sm">Monday to Friday</p>
              <p className="text-sm">9:00 - 16:00</p>
              <p className="text-sm">Weekends and Public Holidays: Closed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full py-8 px-2 text-white bg-secondary">
        <p>
          © GivetoGrow operates under the license of The Standard Bank of South Africa Limited, an authorised Financial Services Provider.
          
        </p>
       
      </div>

    </div>
  );
};

export default Footer;
