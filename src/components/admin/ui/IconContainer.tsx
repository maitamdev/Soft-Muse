import React from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export type IconColor = 
  | 'purple'
  | 'blue'
  | 'emerald'
  | 'cyan'
  | 'orange'
  | 'yellow'
  | 'pink'
  | 'slate'
  | 'indigo'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

interface IconContainerProps {
  icon: React.ReactNode;
  color?: IconColor;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isAnimated?: boolean;
}

const colorVariants: Record<IconColor, string> = {
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
  primary: 'bg-[var(--admin-primary-muted)] text-[var(--admin-primary)]',
  success: 'bg-[var(--admin-success-muted)] text-[var(--admin-success)]',
  danger: 'bg-[var(--admin-danger-muted)] text-[var(--admin-danger)]',
  warning: 'bg-[var(--admin-warning-muted)] text-[var(--admin-warning)]',
  info: 'bg-[var(--admin-info-muted)] text-[var(--admin-info)]',
};

const sizeVariants = {
  xs: 'w-7 h-7 rounded p-1',
  sm: 'w-8 h-8 rounded-md p-1.5',
  md: 'w-10 h-10 rounded-lg p-2',
  lg: 'w-12 h-12 rounded-xl p-2.5',
  xl: 'w-16 h-16 rounded-2xl p-4',
};

export function IconContainer({
  icon,
  color = 'primary',
  size = 'md',
  className,
  isAnimated = false,
}: IconContainerProps) {
  const Container = isAnimated ? motion.div : 'div';
  const animationProps = isAnimated ? { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } } : {};

  return (
    <Container
      {...animationProps}
      className={cn(
        'flex items-center justify-center shrink-0 transition-colors duration-200',
        colorVariants[color],
        sizeVariants[size],
        className
      )}
    >
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: cn('w-full h-full', (icon as React.ReactElement<{ className?: string }>).props.className),
      })}
    </Container>
  );
}
