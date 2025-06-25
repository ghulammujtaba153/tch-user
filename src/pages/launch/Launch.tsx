import React from "react";
import { useAppConfig } from "../../context/AppConfigContext";
import { Link } from "react-router-dom";

const Launch = () => {
  const { config } = useAppConfig();

  return (
    <div className="min-h-screen w-full">

      {/* <Link to={"/home-sec"} >H</Link> */}
      {/* Logo Section */}
      <div className="flex justify-center items-center bg-[#DFEEFD] py-5">
        <img
          src={config?.logo}
          alt="launch"
          width={150}
          height={150}
          className="text-center"
        />
      </div>

      {/* Launch Image Section */}
      <div className="relative w-full h-[calc(100vh-60px)]">
        <img
          src="/launch.png"
          alt="launch"
          className="w-full h-full object-cover"
        />
        <h1 className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-white">
          WE ARE LAUNCHING SOON <Link to={"/home-sec"} >!</Link>
        </h1>
      </div>
    </div>
  );
};

export default Launch;
