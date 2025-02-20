import PropTypes from "prop-types";
import styles from "./card.module.css";

const Card = ({ title, number, change }) => {
  return (
    <div className={styles.container}>
      <div className={styles.texts}>
        <span className={styles.title}>{title}</span>
        <span className={styles.number}>{number}</span>
        <span className={styles.detail}>
          <span className={change > 0 ? styles.positive : styles.negative}>
            {change}%
          </span>{" "}
          {change > 0 ? "more" : "less"} than previous week
        </span>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.number.isRequired,
};

export default Card;
