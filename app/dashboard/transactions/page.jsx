import { fetchTransactions } from "@/app/lib/data";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/transactions/transactions.module.css";
import Link from "next/link";

const TransactionsPage = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, transactions } = await fetchTransactions(q, page);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return styles.pending;
      case "success":
        return styles.done;
      case "failed":
        return styles.cancelled;
      default:
        return styles.pending;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a transactions..." />
        <Link href="/dashboard/transactions/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>Payment Method</td>
            <td>Status</td>
            <td>Date & Time</td>
            <td>Amount</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                {transaction.id}
              </td>
              <td><div className={styles.name}>{transaction.name || "N/A"}</div></td>
              <td>
                {transaction.paymentmethod
                  ? transaction.paymentmethod
                      .replace(/_/g, " ")
                      .split(" ")
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(" ")
                  : "N/A"}
              </td>
              <td>
                <button className={`${styles.statusButton} ${getStatusClass(transaction.status)}`}>
                  {transaction.status.toUpperCase() || "Pending"}
                </button>
              </td>
              <td>{new Date(transaction.createdAt).toLocaleString()}</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(transaction.amount || 0)}
              </td>

              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/transactions/${transaction.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default TransactionsPage;
