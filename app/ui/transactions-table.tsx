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
      <Table aria-label="transactions table">
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
          {transactions.Items?.map((transaction, index) => (
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
                {Array.from(transaction.Tags).join(', ')}
              </StyledTableCell>
              <StyledTableCell align="left" variant="body">
                <div className="flex justify-end gap-2">
                  <UpdateTransaction id={''} />
                  <DeleteTransaction id={''} />
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
