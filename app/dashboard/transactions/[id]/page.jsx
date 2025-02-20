import { updateTransaction } from "@/app/lib/actions";
import { fetchTransaction } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/transactions/singleTransaction/singleTransaction.module.css";
import Link from "next/link";

const SingleTransactionPage = async ({ params }) => {
  const { id } = params;
  const transaction = await fetchTransaction(id);

  return (
    <div className={styles.container}>
      <Link className={styles.links} href="/dashboard/transactions">
          <button className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
          </button>
      </Link>
      <div className={styles.formContainer}>
        <form action={updateTransaction} className={styles.form}>
          <input type="hidden" name="id" value={transaction.id} />
          
          <label>Transaction ID</label>
          <input type="text" name="transactionId" placeholder={transaction.id} readOnly />

          <label>Name</label>
          <input type="text" name="name" placeholder={transaction.name || "N/A"} readOnly />

          <label>Payment Method</label>
          <input
            type="text"
            name="paymentmethod"
            placeholder={transaction.paymentmethod || "N/A"} readOnly
          />

          <label>Status</label>
          <select name="status" defaultValue={transaction.status || "Pending"} disabled>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <label>Amount</label>
          <input
            type="number"
            name="amount"
            placeholder={transaction.amount || "0"} readOnly
          />

          <label>Date & Time</label>
          <input
            type="text"
            name="createdAt"
            placeholder={new Date(transaction.createdAt).toLocaleString()}
            readOnly
          />
        </form>
      </div>
    </div>
  );
};

export default SingleTransactionPage;
