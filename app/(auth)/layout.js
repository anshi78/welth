import React from 'react';

const Authlayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-screen overflow-auto bg-black">
      {children}
    </div>
  );
};

export default Authlayout;
