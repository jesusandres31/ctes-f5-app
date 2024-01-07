export interface IColumn<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  render?: (item: T) => JSX.Element | string | null;
}

export interface IMenuItem {
  text: string;
  icon: React.ReactNode;
  to: string;
  onClick?: () => void;
}
