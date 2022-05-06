import React from 'react';
import { Heading } from '@chakra-ui/react';
interface Props {
  // TODO: FIX!
  season: any;
  events: any;
}

const SeasonLeaderboard: React.FunctionComponent<Props> = ({ season, events }) => {
  return (
    <div>
      {' '}
      <Heading as="h2" size="md">
        Ledartavla efter {events.length} rundor
      </Heading>
    </div>
  );
};

export default SeasonLeaderboard;
