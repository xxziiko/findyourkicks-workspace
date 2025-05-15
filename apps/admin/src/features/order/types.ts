export interface CardItem<T> {
  id: string;
  title: string;
  tableHeader: readonly string[];
  tableData: T[];
}
