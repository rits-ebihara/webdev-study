import React, { useCallback, useState } from 'react';
import { DisplayNumber } from './DisplayNumber';
import { IncrementButton } from './IncrementButton';

export const Increment: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const increment = useCallback(() => {
    setCounter(counter + 1);
  }, [counter]);
  const decrement = useCallback(() => {
    setCounter(counter - 1);
  }, [counter]);
  return (
    <div>
      <IncrementButton caption="-" onClick={decrement} />
      <DisplayNumber num={counter} />
      <IncrementButton caption="+" onClick={increment} />
    </div>
  );
};
