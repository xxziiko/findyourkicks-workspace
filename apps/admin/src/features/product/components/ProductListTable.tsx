import type { Product } from '@/features/product';
import { NoData } from '@/shared/components';
import {
  Button,
  commaizeNumberWithUnit,
  formatDateDefault,
} from '@findyourkicks/shared';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import styles from './ProductListTable.module.scss';

const statusMap = {
  pending: '판매 대기',
  selling: '판매 중',
  soldOut: '품절',
} as const;

type Status = keyof typeof statusMap;

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'title',
    header: '상품명',
  },
  {
    accessorKey: 'status',
    header: '판매 상태',
    cell: (info) => {
      const status = info.getValue() as Status;
      return <div className={styles.status}>{statusMap[status]}</div>;
    },
  },
  {
    accessorKey: 'price',
    header: '판매가',
    cell: (info) => commaizeNumberWithUnit(info.getValue() as number, '원'),
  },
  {
    accessorKey: 'size',
    header: '사이즈',
  },
  {
    accessorKey: 'stock',
    header: '재고',
  },
  {
    accessorKey: 'brand',
    header: '브랜드',
  },
  {
    accessorKey: 'category',
    header: '카테고리',
  },
  {
    accessorKey: 'description',
    header: '상세 설명',
    cell: (info) => {
      const description = info.getValue() as string;
      return <div className={styles.cellDescription}>{description}</div>;
    },
  },
  {
    accessorKey: 'image',
    header: '이미지',
    cell: (info) => (
      <Button variant="secondary" size="small">
        <Link to={info.getValue() as string} target="_blank" rel="noreferrer">
          미리보기
        </Link>
      </Button>
    ),
  },
  {
    accessorKey: 'created_at',
    header: '등록일',
    cell: (info) => {
      const date = info.getValue() as string;
      return <div className={styles.date}>{formatDateDefault(date)}</div>;
    },
  },
];

interface ProductListTableProps {
  products: Product[];
}

export function ProductListTable({ products }: ProductListTableProps) {
  const table = useReactTable({
    data: products,
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
          {products.length === 0 && <NoData text="상품 데이터가 없습니다." />}

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
