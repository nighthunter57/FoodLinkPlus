import React from 'react';

const ReservationsList: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Reservations</h2>
      <p className="text-muted-foreground">No reservations yet</p>
    </div>
  );
};

export default ReservationsList;