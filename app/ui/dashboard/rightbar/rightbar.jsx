import Image from "next/image";
import styles from "./rightbar.module.css";
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.bgContainer}>
          <Image className={styles.bg} src="/astronaut.png" alt="" fill/>
        </div>
        <div className={styles.text}>
          <span className={styles.notification}>🔥 Available Now</span>
          <h3 className={styles.title}>
            How to use the new version of the admin dashboard?
          </h3>
          <span className={styles.subtitle}>Takes 4 minutes to learn</span>
          <p className={styles.desc}>
          🚀 Easy to Learn, Quick to Master
          With an intuitive design and clear instructions, navigating the dashboard is a breeze.
          </p>
          <p className={styles.desc}>
          🔍 Powerful Features, Simplified
          Manage everything from users to products with just a few clicks. Your business, fully streamlined!
          </p>
          <button className={styles.button}>
            <MdPlayCircleFilled />
            Watch
          </button>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.text}>
          <span className={styles.notification}>🚀 Coming Soon</span>
          <h3 className={styles.title}>
            New payment gateway features, fully optimized for your business needs!
            Effortlessly handle transactions with ease.
          </h3>
          <span className={styles.subtitle}>Boost your productivity</span>
          <p className={styles.desc}>
            🔒 Secure & Reliable
            Your payments, protected with top-tier encryption, ensuring a seamless and trustworthy transaction process.
          </p>
          <p className={styles.desc}>
            ⚡ Fast Transactions
            Experience lightning-fast payment processing, reducing wait times and boosting your customer satisfaction.
          </p>
          <p className={styles.desc}>
            💡 Boost Your Productivity
            Streamline your payment workflow and spend more time focusing on what matters most—growing your business.
          </p>
          <button className={styles.button}>
            <MdReadMore />
            Learn
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
