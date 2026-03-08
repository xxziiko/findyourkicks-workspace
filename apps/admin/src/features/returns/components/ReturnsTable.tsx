import { Button, formatDateDefault } from '@findyourkicks/shared';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ReturnItem } from '../types';
import styles from './ReturnsTable.module.scss';

const statusLabelMap = {
  requested: '처리 대기',
  approved: '승인',
  rejected: '거부',
} as const;

const returnTypeLabelMap = {
  return: '반품',
  exchange: '교환',
} as const;

interface ReturnsTableProps {
  returns: ReturnItem[];
  onApprove: (returnId: string) => void;
  onReject: (returnId: string) => void;
  isProcessing: boolean;
}

export function ReturnsTable({
  returns,
  onApprove,
  onReject,
  isProcessing,
}: ReturnsTableProps) {
  const columns: ColumnDef<ReturnItem>[] = [
    {
      accessorKey: 'order_id',
      header: '주문 ID',
      cell: (info) => {
        const val = info.getValue() as string;
        return <div className={styles.cellId}>{val}</div>;
      },
    },
    {
      id: 'product_title',
      header: '상품명',
      cell: (info) => {
        const items = info.row.original.orders?.order_items ?? [];
        const titles = items
          .map((i) => i.products?.title ?? '-')
          .join(', ');
        return <div className={styles.cellText}>{titles || '-'}</div>;
      },
    },
    {
      accessorKey: 'return_type',
      header: '유형',
      cell: (info) => {
        const val = info.getValue() as keyof typeof returnTypeLabelMap;
        return returnTypeLabelMap[val] ?? val;
      },
    },
    {
      accessorKey: 'reason',
      header: '사유',
      cell: (info) => (
        <div className={styles.cellText}>{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: (info) => {
        const val = info.getValue() as keyof typeof statusLabelMap;
        return (
          <div className={styles[`status_${val}`]}>
            {statusLabelMap[val] ?? val}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: '신청일',
      cell: (info) => formatDateDefault(info.getValue() as string),
    },
    {
      id: 'actions',
      header: '처리',
      cell: (info) => {
        const row = info.row.original;
        if (row.status !== 'requested') {
          return <span className={styles.processed}>처리 완료</span>;
        }
        return (
          <div className={styles.actions}>
            <Button
              variant="primary"
              size="small"
              onClick={() => onApprove(row.return_id)}
              disabled={isProcessing}
            >
              승인
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => onReject(row.return_id)}
              disabled={isProcessing}
            >
              거부
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: returns,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.header}>
                  {header.isPlaceholder
                    ? null
                    : (header.column.columnDef.header as string)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.cell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
