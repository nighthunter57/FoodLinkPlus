import React from 'react';
import { Button } from '@/components/ui/button';

const PostDonationForm: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Post Donation</h2>
      <p className="text-muted-foreground">Coming soon - form to post new donations</p>
      <Button disabled>Post Donation</Button>
    </div>
  );
};

export default PostDonationForm;