import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const SingleSelectButtonGroup = ({ names, onSelectionChange, isModal, id, SNames }) => {
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    setSelectedName(SNames)
  }, [])

  const handleButtonClick = (name) => {
    setSelectedName(name);
    // Notify the parent component about the selected name
    onSelectionChange(name, id);
  };

  return (
    <div className={`flex flex-wrap ${isModal ? 'col-12 w-full lg:w-25rem md:w-23rem sm:w-21rem p-0' : ''}`}>
      {names.map((name, index) => (
        <Button
          key={index}
          className={`p-button-rounded font-bold mr-2 mt-1 ${selectedName === name ? 'p-button-outlined' : ''}`}
          style={{
            height: "40px"
          }}
          onClick={() => handleButtonClick(name)}
          type='button'
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default SingleSelectButtonGroup;
