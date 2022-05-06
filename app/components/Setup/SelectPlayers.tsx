import React from 'react';
import { Button, Center, Checkbox, Divider, Heading, Stack } from '@chakra-ui/react';
import type { definitions } from 'types/supabase';
import type { ScoringPlayer } from './SetupWrapper';

const SelectPlayers: React.FC<{
  players: definitions['players'][];
  chosenPlayers: ScoringPlayer[];
  eventType: definitions['events']['type'];
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
        const scoringPlayer = { ...player, strokes: 10 };
        setPlayStateKey('players', [...chosenPlayers, scoringPlayer]);
      }
    }
  };

  const gotoSetup = () => {
    if (eventType === 'TEAM') {
      setPlayStateKey('teams', [
        { strokes: 10, playerIds: [] },
        { strokes: 10, playerIds: [] },
        { strokes: 10, playerIds: [] },
        { strokes: 10, playerIds: [] },
      ]);
    }
    setPlayStateKey('step', 'setup');
  };

  return (
    <div>
      <Heading size="md" marginBottom={5}>
        Välj spelare
      </Heading>

      <Stack spacing={2} direction="column">
        {players.map((player) => (
          <Checkbox
            name="playerIds"
            key={player.id}
            value={player.id}
            onChange={(e) => toggleChecked(e.target.value)}
            isChecked={chosenPlayerIds.includes(`${player.id}`)}
          >
            {player.first_name} {player.last_name}
          </Checkbox>
        ))}
      </Stack>
      <Center height="40px">
        <Divider />
      </Center>
      {chosenPlayers.length !== 0 && (
        <Button colorScheme="green" onClick={gotoSetup}>
          {eventType === 'INDIVIDUAL' ? 'Ställ in slag' : 'Sätt upp lag'}
        </Button>
      )}
    </div>
  );
};

export default SelectPlayers;
