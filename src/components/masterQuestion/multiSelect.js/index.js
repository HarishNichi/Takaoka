import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const ButtonGroup = ({ names, onSelectionChange, isModal, id, SNames }) => {
  const [selectedNames, setSelectedNames] = useState([]);

  useEffect(() => {
    // Notify the parent component about the updated selection
    onSelectionChange(selectedNames, id);
  }, [selectedNames]);

  useEffect(() => {
    setSelectedNames(SNames)
  }, [])

  const handleButtonClick = (name) => {
    // Toggle the selection state of the button
    if (selectedNames?.includes(name)) {
      setSelectedNames(selectedNames?.filter((selectedName) => selectedName !== name));
    } else {
      let names = selectedNames && selectedNames
      setSelectedNames([...names, name]);
    }
  };

  return (
    <div className={`flex flex-wrap ${isModal ? 'col-12 w-full lg:w-25rem md:w-23rem sm:w-21rem p-0' : ''}`}>
      {names.map((name, index) => (
        <Button
          key={index}
          className={`p-button-rounded font-bold mr-2 mt-1 ${selectedNames?.includes(name) ? 'p-button-outlined' : ''}`}
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

export default ButtonGroup;
