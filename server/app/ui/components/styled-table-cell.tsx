'use client';

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { inter } from '@/app/ui/fonts';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: '#111827',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    padding: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontFamily: inter.style.fontFamily,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: theme.palette.common.white,
    whiteSpace: 'nowrap',
    padding: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontFamily: inter.style.fontFamily,
  },
}));
