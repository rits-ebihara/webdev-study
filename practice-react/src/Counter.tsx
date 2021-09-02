// /** @jsx jsx */
// import { css, jsx } from "@emotion/react";
import React, { useCallback, useState } from "react";

// const button = css`
//   padding: 0.5em 1em;
//   font-size: 120%;
//   margin: 1em;
// `;

export const Counter: React.FC = () => {
  const [counter, setCounter] = useState(0);

  const increment = useCallback(() => {
    setCounter(counter + 1);
  }, [counter]);

  const decrement = useCallback(() => {
    setCounter(counter - 1);
  }, [counter]);

  return (
    <div>
      <button type="button" onClick={decrement}>
        -
      </button>
      <span>{counter}</span>
      <button type="button" onClick={increment}>
        +
      </button>
    </div>
  );
};
