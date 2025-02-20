import { fetchRevenue, fetchTransactions } from "@/app/lib/data";
import { formatCurrency } from "@/app/lib/utils";
import Card from "@/app/ui/dashboard/revenue/card/card";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import styles from "@/app/ui/dashboard/revenue/RevenueDashboard.module.css"; // Import CSS module
import Chart from "@/app/ui/dashboard/chart/LineChart/linechart";
import RevenueByCategoryChart from "@/app/ui/dashboard/chart/PieChart/piechart";
import Button from "@/app/ui/dashboard/button/button";

const mockCategoryData = [
  { name: "Electronics", value: 40 },
  { name: "Fashion", value: 30 },
  { name: "Home & Living", value: 20 },
  { name: "Services", value: 10 },
];

const RevenueDashboard = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, transactions } = await fetchTransactions(q, page);

  const { totalRevenue, totalTransactions, averageTransactionValue, revenueGrowth, monthlyRevenue, categoryRevenue } =
    await fetchRevenue();

    const revenueData = (monthlyRevenue || []).map((entry) => ({
      date: entry.month,
      revenue: entry.totalRevenue,
    }));
    
    const categoryData = Array.isArray(categoryRevenue)
    ? categoryRevenue.map((entry) => ({
        name: entry.name || "Unknown",
        value: entry.value || 0,
      }))
    : [];



  return (
    <div className={styles.container}>
      <div className={styles.ExportContainer}>
        <Button>View More</Button>
        <Button>Export CSV</Button>
      </div>

      <div className={styles.cardGrid}>
        <Card item={{ title: "Total Revenue", number: formatCurrency(totalRevenue), change: revenueGrowth }} />
        <Card item={{ title: "Avg. Transaction", number: formatCurrency(averageTransactionValue), change: 0 }} />
        <Card item={{ title: "Revenue Growth", number: `${revenueGrowth.toFixed(2)}%`, change: revenueGrowth }} />
        <Card item={{ title: "Total Transactions", number: totalTransactions, change: 0 }} />
      </div>

      {/* Charts */}
      <div className={styles.chartGrid}>
        <Chart revenueData={revenueData} />
        {categoryData.length > 0 ? (
          <RevenueByCategoryChart categoryData={categoryData} />
        ) : (
          <p>No category revenue data available</p>
        )}
      </div>

      {/* Recent Transactions */}
        <h3>Recent Transactions</h3>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>ID</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 8).map((tx) => (
              <tr key={tx.id} className={styles.tableRow}>
                <td>{tx.id}</td>
                <td>{tx.name.replace(/\b\w/g, (char) => char.toUpperCase()).trim()}</td>
                <td>{formatCurrency(tx.amount)}</td>
                <td>{tx.paymentmethod.replace(/_/g, " ").toUpperCase()}</td>
                <td>
                  <span className={`${styles.status} ${tx.status === "success" ? styles.success : styles.pending}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination count={count} />
    </div>
  );
};

export default RevenueDashboard;
