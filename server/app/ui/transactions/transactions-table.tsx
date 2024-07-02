import styles from '@/app/ui/css/responsive-table.module.scss';

import { Transaction } from '@/app/lib/model/transaction.model';
import TransactionTableRow from './transaction-table-row';

export default async function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className={styles.tableContainer}>
      <table
        className={styles.responsiveTable}
        aria-label="transactions table"
        data-test="transactionsTable"
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th className={styles.optionalCell}>Tags</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            return (
              <TransactionTableRow
                key={transaction.SK}
                transaction={transaction}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
