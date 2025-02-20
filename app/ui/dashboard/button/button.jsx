import styles from "./button.module.css";
import { Loader2 } from "lucide-react";
import classNames from "classnames";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        (isLoading || disabled) && styles.disabled
      )}
    >
      {isLoading && <Loader2 className={styles.loader} size={18} />}
      {children}
    </button>
  );
};

export default Button;
