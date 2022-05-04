import React from 'react';
import { Button, Center, Divider, Heading, HStack, Input, Stack } from '@chakra-ui/react';
import { Form } from '@remix-run/react';
import type { Player } from '@prisma/client';

import type { PlayState } from '~/routes/play';
import invariant from 'tiny-invariant';
import NumberStepper from './NumberStepper';

const Setup: React.FC<{
  playState: PlayState;
  setPlayStateKey: (key: string, value: any) => void;
}> = ({ playState, setPlayStateKey }) => {
  invariant(playState.course, 'Course has to be set');

  const setStrokes = (id: number, val: number) => {
    const updatedPlayers = playState.players.map((p) => {
      if (p.id === id) {
        p.strokes = val;
      }
      return { ...p };
    });
    setPlayStateKey('players', updatedPlayers);
  };

  return (
    <div>
      <Form action="/scoringsession" method="post">
        <input name="courseId" value={playState.course.id} type="text" hidden readOnly />
        <input name="eventType" value={playState.eventType} type="text" hidden readOnly />
        <input name="weekType" value={playState.weekType} type="text" hidden readOnly />
        <input name="scoringType" value={playState.scoringType} type="text" hidden readOnly />
        <Heading size="md" marginBottom={5}>
          Välj spelare
        </Heading>

        <Stack spacing={2} direction="column">
          {playState.players.map((player: Player) => (
            <li key={player.id}>
              {player.firstName} {player.lastName}
              <NumberStepper setValue={(val: number) => setStrokes(player.id, val)} />
            </li>
          ))}
        </Stack>

        <Center height="40px">
          <Divider />
        </Center>

        <Button type="submit" colorScheme="green">
          SKAPA RUNDA
        </Button>
      </Form>
    </div>
  );
};

export default Setup;
