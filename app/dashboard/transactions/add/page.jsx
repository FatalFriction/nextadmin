"use client";

import { useState } from "react";
import { addTransaction } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import styles from "@/app/ui/dashboard/transactions/addTransaction/addTransaction.module.css";

const AddTransactionPage = () => {
  const [error, setError] = useState(null);
  const router = useRouter(); // ✅ Use Next.js router for client-side navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset previous errors

    const formData = new FormData(event.target);

    try {
      const result = await addTransaction(formData);

      if (result?.error) {
        setError(result.error); // ✅ Display error message if exists
      } else {
        event.target.reset(); // ✅ Clear form on success
        router.push("/dashboard/transactions"); // ✅ Redirect on success
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <input type="text" placeholder="Customer Name" name="name" required />

        <select name="paymentmethod" id="paymentmethod" required>
          <option value="">Select Payment Method</option>
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="qris">QRIS</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>

        <input type="number" placeholder="Amount" name="amount" min="0" required />

        <select name="status" id="status" required>
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddTransactionPage;
