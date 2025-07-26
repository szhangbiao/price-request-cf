import { FC } from 'hono/jsx'

export interface LayoutProps {
  title?: string;
}

export type LayoutComponent = FC<LayoutProps>