"use client";

import { useState } from "react";
import { addProduct } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/products/addProduct/addProduct.module.css";

const AddProductPage = () => {
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.target);

    try {
      const result = await addProduct(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        event.target.reset();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <input type="text" placeholder="Title" name="title" required />
        
        <select name="cat" id="cat">
          <option value="general">Choose a Category</option>
          <option value="kitchen">Kitchen</option>
          <option value="phone">Phone</option>
          <option value="computer">Computer</option>
        </select>

        <input type="number" placeholder="Price" name="price" required />
        <input type="number" placeholder="Stock" name="stock" required />
        <input type="text" placeholder="Color" name="color" />
        <input type="text" placeholder="Size" name="size" />

        <textarea required name="desc" id="desc" rows="16" placeholder="Description"></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProductPage;
