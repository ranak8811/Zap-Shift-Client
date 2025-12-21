import React from "react";

const ServiceCard = ({ service }) => {
  return (
    <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        {service.title}
      </h3>
      <p className="text-gray-600">{service.description}</p>
    </div>
  );
};

export default ServiceCard;
