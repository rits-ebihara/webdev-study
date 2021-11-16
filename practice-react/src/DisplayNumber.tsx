import React from 'react';

type PropType = { num: number };

export const DisplayNumber: React.FC<PropType> = (props) => {
  return <span>{props.num}</span>;
};
