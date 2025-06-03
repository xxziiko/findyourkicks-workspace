import { ErrorMessage, InputWithUnit } from '@/shared';
import { commaizeNumber } from '@findyourkicks/shared';
import { Trash2Icon } from 'lucide-react';
import styles from './OptionSizeTable.module.scss';

interface OptionSizeTableProps {
  sizes: { size: string; stock: number }[];
  onChange: (size: string, stock: number) => void;
  onDelete: (size: string) => void;
}
export function OptionSizeTable({
  sizes,
  onChange,
  onDelete,
}: OptionSizeTableProps) {
  return (
    <div>
      <div className={styles.sizeHeader}>
        <p>사이즈</p>
        <p>재고</p>
        <p />
      </div>

      {sizes.map(({ size, stock }) => (
        <SizeItem
          size={size}
          key={size}
          stock={stock}
          onChange={onChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface SizeItemProps {
  size: string;
  stock: number;
  onChange: (size: string, stock: number) => void;
  onDelete: (size: string) => void;
}
function SizeItem({ size, stock, onChange, onDelete }: SizeItemProps) {
  return (
    <div className={styles.sizeItem}>
      <div className={styles.cell}>
        <p aria-label={size}>{size}</p>
      </div>

      <div className={styles.cellCol}>
        <InputWithUnit
          id={`${size}-stock-input`}
          placeholder="숫자만 입력해주세요."
          unit="개"
          value={commaizeNumber(stock)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(size, Number(e.target.value))
          }
        />

        {stock === 0 && (
          <ErrorMessage id="stock" error="재고를 입력해주세요." />
        )}
      </div>

      <div className={styles.cell}>
        <button type="button" onClick={() => onDelete(size)}>
          <Trash2Icon width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
