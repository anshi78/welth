import React from 'react';

const Authlayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-screen overflow-auto bg-white">
      {children}
    </div>
  );
};

export default Authlayout;
