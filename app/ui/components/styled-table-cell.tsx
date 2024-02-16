'use client';

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { inter } from '@/app/ui/fonts';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: '#111827',
    fontWeight: 500,
    fontSize: 14,
    fontFamily: inter.style.fontFamily,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: theme.palette.common.white,
    fontSize: 14,
    fontFamily: inter.style.fontFamily,
  },
}));
