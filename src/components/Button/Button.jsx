// Imports
import "./Button.css";

// Code
const Button = ({ text, onClick, className }) => {
  return (
    <button className={`${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

// Exports
export default Button;
