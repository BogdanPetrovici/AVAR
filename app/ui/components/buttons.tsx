'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function UpdateTransaction({ id }: { id: string }) {
  return (
    <Link
      href={`/transactions/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTransaction({ id }: { id: string }) {
  return (
    <button className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
