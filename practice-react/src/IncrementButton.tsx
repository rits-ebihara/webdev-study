/** @jsx jsx */
import { css, jsx } from '@emotion/react';

const styles = {
  button: css`
    background-color: #3399ff;
    border: 1px solid blue;
    margin: 0 1em;
    padding: 0.5em 1em;
  `,
};

type PropType = {
  caption: string;
  onClick: () => void;
};

export const IncrementButton: React.FC<PropType> = (props) => {
  return (
    <button css={styles.button} onClick={props.onClick}>
      {props.caption}
    </button>
  );
};
