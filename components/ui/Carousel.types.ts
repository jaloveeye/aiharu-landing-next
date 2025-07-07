import { ReactNode } from "react";

export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => ReactNode;
  minHeight?: string;
  minWidth?: string;
  dotColor?: string;
}
