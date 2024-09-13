import "./css/Button.css";

type ButtonProps = {
  onClick: () => void;
};

const Button = ({ onClick }: ButtonProps) => {
  return (
    <button className="button" onClick={onClick}>
      <span className="button-text">Compare</span>
      <span className="reflection"></span>
    </button>
  );
};
export default Button;
