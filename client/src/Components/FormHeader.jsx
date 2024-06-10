import React from "react";
import { Link } from "react-router-dom";
import logo2 from "../Assets/logo2.png";

function FormHeader({ heading, paragraph, linkName, linkUrl = "#" }) {
  return (
    <div className="mb-8">
      <div className="flex justify-center mt-6 mb-0">
        <img alt="" className="h-14 w-44 " src={logo2} />
      </div>
      <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 ">
        {paragraph}{" "}
        <Link
          to={linkUrl}
          className="font-medium text-indigo-900 hover:text-indigo-950"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}

export default FormHeader;
