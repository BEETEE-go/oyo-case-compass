
import React from 'react';
import { Link } from 'react-router-dom';
import { Case } from '@/types/case';
import { CaseStatusBadge } from './CaseStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/data/mockData';
import { ClipboardList, Calendar, User } from 'lucide-react';

interface CaseCardProps {
  caseData: Case;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData }) => {
  return (
    <Link to={`/cases/${caseData.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold truncate">{caseData.title}</CardTitle>
            <CaseStatusBadge status={caseData.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <ClipboardList size={16} />
              <span>Case #{caseData.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span>Opened: {formatDate(caseData.openDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 truncate">
              <User size={16} />
              <span className="truncate">{caseData.investigator}</span>
            </div>
            
            <div className="mt-3 line-clamp-2 text-gray-600">
              {caseData.description}
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {caseData.categories.slice(0, 2).map((category, index) => (
                <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {category}
                </span>
              ))}
              {caseData.categories.length > 2 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  +{caseData.categories.length - 2} more
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
