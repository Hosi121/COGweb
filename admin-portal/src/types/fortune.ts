import { LucideIcon } from 'lucide-react';

export interface Fortune {
  luck: string;
  item: string;
  color: string;
  itemIcon: LucideIcon;
  colorHex: string;
}

export type FortuneItem = {
  name: string;
  icon: LucideIcon;
};

export type FortuneColor = {
  name: string;
  hex: string;
};