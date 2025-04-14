
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CaseStatus } from '@/types/case';
import { getStatusColor } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CaseStatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({ status, className }) => {
  return (
    <Badge variant="outline" className={cn("font-medium", getStatusColor(status), className)}>
      {status}
    </Badge>
  );
};
