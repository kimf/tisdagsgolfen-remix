import React from 'react';
interface Props {
  // TODO: FIX!
  season: any;
  events: any;
}

const SeasonLeaderboard: React.FunctionComponent<Props> = ({ season, events }) => {
  return (
    <div>
      <h2>Ledartavla efter {events.length} rundor</h2>
    </div>
  );
};

export default SeasonLeaderboard;
