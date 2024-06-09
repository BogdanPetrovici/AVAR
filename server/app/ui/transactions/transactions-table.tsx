import styles from '@/app/ui/css/transactions.module.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import { StyledTableCell } from '@/app/ui/components/styled-table-cell';
import { StyledTableRow } from '@/app/ui/components/styled-table-row';
import Paper from '@mui/material/Paper';
import { Chip } from '@mui/material';

import { UpdateTransaction } from '@/app/ui/components/buttons';

import {
  formatDateToLocal,
  formatCurrency,
  getTransactionId,
} from '@/app/lib/utils';
import { Transaction } from '@/app/lib/model/transaction';

export default async function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <TableContainer
      sx={{
        borderRadius: '0.5rem',
        backgroundColor: '#F9FAFBFF',
        padding: '0.5rem',
        marginTop: '1.5rem',
      }}
      component={Paper}
      elevation={0}
    >
      <Table aria-label="transactions table" data-test="transactionsTable">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="left" variant="head">
              Date
            </StyledTableCell>
            <StyledTableCell align="left" variant="head">
              Amount
            </StyledTableCell>
            <StyledTableCell align="left" variant="head">
              Tags
            </StyledTableCell>
            <StyledTableCell align="left" variant="head"></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => {
            const transactionId = getTransactionId(transaction.SK);
            return (
              <StyledTableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCell align="left" variant="body">
                  {formatDateToLocal(transaction.Date)}
                </StyledTableCell>
                <StyledTableCell align="left" variant="body">
                  {formatCurrency(transaction.Amount, 'RON')}
                </StyledTableCell>
                <StyledTableCell align="left" variant="body">
                  {transaction.Tags.map((tag) => {
                    return (
                      <Chip
                        variant="outlined"
                        sx={{ marginRight: '5px' }}
                        key={tag}
                        label={tag}
                      />
                    );
                  })}
                </StyledTableCell>
                <StyledTableCell align="left" variant="body">
                  <div className={styles.editButtonContainer}>
                    <UpdateTransaction id={transactionId} />
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
