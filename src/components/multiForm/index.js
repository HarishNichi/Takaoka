import React from "react";
import { Card } from "primereact/card";

export const MultiStepForm = (props) => {
  const { content, activeIndex } = props;

  return (
    <div className="multistep-form">
      <Card className="card p-0 pt-0">{content[activeIndex]}</Card>
    </div>
  );
};