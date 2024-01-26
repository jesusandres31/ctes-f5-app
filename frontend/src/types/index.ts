export interface IColumn<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  render?: (item: T) => JSX.Element | string | null;
}

export interface DrawerSection {
  title: string;
  menuItems: IMenuItem[];
}

export interface IMenuItem {
  text: string;
  icon: React.ReactNode;
  to: string;
  onClick?: () => void;
}

export type GetList = {
  page: number;
  perPage: number;
};
