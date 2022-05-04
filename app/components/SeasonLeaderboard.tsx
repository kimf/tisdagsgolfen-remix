import React from 'react';
import { Heading } from '@chakra-ui/react';

import type { SeasonWithEventCount } from '~/routes/index';

interface Props {
  season: SeasonWithEventCount;
}

const SeasonLeaderboard: React.FunctionComponent<Props> = ({ season }) => {
  return (
    <div>
      {' '}
      <Heading as="h2" size="md">
        Ledartavla efter {season._count.events} rundor
      </Heading>
    </div>
  );
};

export default SeasonLeaderboard;
