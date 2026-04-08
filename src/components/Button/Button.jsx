// Imports
import "./Button.css";

// Code
const Button = ({
  text,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`button-base ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

// Exports
export default Button;
