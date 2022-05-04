import React from 'react';
import { Button, Center, Checkbox, CheckboxGroup, Divider, Heading, Stack } from '@chakra-ui/react';
import type { Player } from '@prisma/client';
import type { PlayerWithStrokes } from '~/routes/play';

const SelectPlayers: React.FC<{
  players: PlayerWithStrokes[];
  chosenPlayers: PlayerWithStrokes[];
  eventType: string;
  setPlayStateKey: (key: string, value: any) => void;
}> = ({ players, chosenPlayers, eventType, setPlayStateKey }) => {
  const chosenPlayerIds = chosenPlayers.map((p) => p.id.toString());

  const toggleChecked = (id: string) => {
    if (chosenPlayerIds.includes(id)) {
      setPlayStateKey(
        'players',
        chosenPlayers.filter((p) => p.id.toString() !== id),
      );
    } else {
      const player = players.find((p) => p.id.toString() === id);
      if (player) {
        player.strokes = player.strokes || 10;
        setPlayStateKey('players', [...chosenPlayers, player]);
      }
    }
  };

  return (
    <div>
      <Heading size="md" marginBottom={5}>
        Välj spelare
      </Heading>

      <Stack spacing={2} direction="column">
        {players.map((player: Player) => (
          <Checkbox
            name="playerIds"
            key={player.id}
            value={player.id}
            onChange={(e) => toggleChecked(e.target.value)}
            isChecked={chosenPlayerIds.includes(`${player.id}`)}
          >
            {player.firstName} {player.lastName}
          </Checkbox>
        ))}
      </Stack>
      <Center height="40px">
        <Divider />
      </Center>
      {chosenPlayers.length !== 0 && (
        <Button colorScheme="green" onClick={() => setPlayStateKey('step', 'setup')}>
          {eventType === 'individual' ? 'Ställ in slag' : 'Sätt upp lag'}
        </Button>
      )}
    </div>
  );
};

export default SelectPlayers;
