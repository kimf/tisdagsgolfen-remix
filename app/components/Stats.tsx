import { Card, Text } from '@nextui-org/react';
import React from 'react';
import { Heading } from '@chakra-ui/react';

const Stats = () => {
  return (
    <Card clickable bordered css={{ mw: '400px' }}>
      <Card.Header>
        <Text h4 color="gradient">
          Statistics
        </Text>
      </Card.Header>
    </Card>
  );
};

export default Stats;
