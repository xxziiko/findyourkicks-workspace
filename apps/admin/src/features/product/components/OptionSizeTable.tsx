import { InputWithUnit } from '@/shared';
import { commaizeNumber } from '@findyourkicks/shared';
import { Trash2Icon } from 'lucide-react';
import styles from './OptionSizeTable.module.scss';

interface OptionSizeTableProps {
  selectedSizes: { size: string; stock: number }[];
  onChange: (size: string, stock: number) => void;
  onDelete: (size: string) => void;
}
export function OptionSizeTable({
  selectedSizes,
  onChange,
  onDelete,
}: OptionSizeTableProps) {
  return (
    <div>
      <div className={styles.sizeHeader}>
        <p>사이즈</p>
        <p>재고</p>
        <div />
      </div>

      {selectedSizes.map(({ size, stock }) => (
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
      <div className={styles.sizeCell}>
        <p>{size}</p>
      </div>

      <div className={styles.sizeCell}>
        <InputWithUnit
          id="stock"
          placeholder="숫자만 입력해주세요."
          unit="개"
          value={commaizeNumber(stock)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(size, Number(e.target.value))
          }
        />
      </div>

      <div className={styles.sizeCell}>
        <button type="button" onClick={() => onDelete(size)}>
          <Trash2Icon width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
