
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SecurityCard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="current-password" className="text-base">Current Password</Label>
          <Input id="current-password" type="password" />
        </div>
        
        <div>
          <Label htmlFor="new-password" className="text-base">New Password</Label>
          <Input id="new-password" type="password" />
        </div>
        
        <div>
          <Label htmlFor="confirm-password" className="text-base">Confirm Password</Label>
          <Input id="confirm-password" type="password" />
        </div>
        
        <Button className="w-full">Change Password</Button>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;
