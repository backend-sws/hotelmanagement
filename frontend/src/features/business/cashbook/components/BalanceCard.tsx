import React from 'react';
import { Wallet, Landmark, ArrowUpRight } from 'lucide-react';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';

interface BalanceCardProps {
  title: string;
  amount: number;
  type: 'cash' | 'bank' | 'liquidity';
  subtitle?: string;
  onAddClick?: () => void;
  addLabel?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  type,
  subtitle,
  onAddClick,
  addLabel
}) => {
  const getIcon = () => {
    if (type === 'cash') return <Wallet className="w-5 h-5 text-white" />;
    if (type === 'bank') return <Landmark className="w-5 h-5 text-white" />;
    return <ArrowUpRight className="w-5 h-5 text-white" />;
  };

  const getGlowColor = () => {
    if (type === 'cash') return 'emerald';
    if (type === 'bank') return 'blue';
    return 'indigo';
  };

  const formattedAmount = `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const displaySubtitle = onAddClick && addLabel ? `${subtitle ? subtitle + ' • ' : ''}Click to ${addLabel}` : subtitle;

  return (
    <div className="transition-transform hover:-translate-y-1 duration-300 w-full">
      <CustomKpiCard
        title={title}
        value={formattedAmount}
        subtitle={displaySubtitle}
        icon={getIcon()}
        glowColor={getGlowColor() as any}
        onClick={onAddClick}
      />
    </div>
  );
};
