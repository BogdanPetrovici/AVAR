'use client';

import { styled } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&.${tableRowClasses.head}`]: {
    border: 'none',
  },
  [`&.${tableRowClasses.root}`]: {
    width: '100%',
    borderBottomWidth: '1px',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
