"use client";

import { useState } from "react";
import { addUser } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/users/addUser/addUser.module.css";

const AddUserPage = () => {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    const formData = new FormData(e.target);
    const result = await addUser(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      alert("User added successfully!");
      e.target.reset();
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorPopup}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Close</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" placeholder="username" name="username" required />
        <input type="email" placeholder="email" name="email" required />
        <input type="password" placeholder="password" name="password" required />
        <input type="phone" placeholder="phone" name="phone" />
        <select name="isAdmin">
          <option value="false">Is Admin?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <select name="isActive">
          <option value="true">Is Active?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <textarea name="address" rows="4" placeholder="Address"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddUserPage;
