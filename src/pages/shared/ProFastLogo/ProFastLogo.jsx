import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

const ProFastLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-end">
        <img src={logo} alt="" className="mb-2" />
        <p className="text-3xl -ms-2 font-extrabold">ProFast</p>
      </div>
    </Link>
  );
};

export default ProFastLogo;
