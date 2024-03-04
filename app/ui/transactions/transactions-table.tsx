import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import { StyledTableCell } from '@/app/ui/components/styled-table-cell';
import { StyledTableRow } from '@/app/ui/components/styled-table-row';
import Paper from '@mui/material/Paper';

import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchLatestTransactions } from '@/app/lib/data';

import {
  DeleteTransaction,
  UpdateTransaction,
} from '@/app/ui/components/buttons';

import { Dayjs } from 'dayjs';
import { Chip } from '@mui/material';

export default async function TransactionsTable({
  fromDate,
  toDate,
  currentPage,
}: {
  fromDate: Dayjs;
  toDate: Dayjs;
  currentPage: number;
}) {
  let transactions = await fetchLatestTransactions(fromDate, toDate);
  return (
    <TableContainer
      sx={{
        borderRadius: '0.5rem',
        backgroundColor: '#F9FAFBFF',
        padding: '0.5rem',
      }}
      component={Paper}
      elevation={0}
    >
      <Table aria-label="transactions table" data-testid="transactionsTable">
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
            const rangeKeyTokens: string[] = transaction.SK.split('#');
            const transactionId: string =
              rangeKeyTokens.length == 3
                ? `${rangeKeyTokens[1]}_${rangeKeyTokens[2]}`
                : '-';
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
                  <div className="flex justify-end gap-2">
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
