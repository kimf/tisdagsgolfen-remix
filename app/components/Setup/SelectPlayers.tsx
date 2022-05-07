import { Button, Checkbox, Spacer, Text, User } from '@nextui-org/react';
import React from 'react';
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
    <>
      <Text h4>Välj Spelare</Text>
      <Spacer />
      <Checkbox.Group defaultValue={chosenPlayerIds}>
        {players.map((player) => (
          <Checkbox
            key={player.id}
            name="playerIds"
            value={player.id.toString()}
            onChange={(e) => toggleChecked(player.id.toString())}
          >
            <User src={player.photo} name={`${player.first_name} ${player.last_name}`} size="md" />
          </Checkbox>
        ))}
      </Checkbox.Group>

      <Spacer y={1} />
      {chosenPlayers.length !== 0 && (
        <Button onClick={gotoSetup}>
          {eventType === 'INDIVIDUAL' ? 'Ställ in slag' : 'Sätt upp lag'}
        </Button>
      )}
    </>
  );
};

export default SelectPlayers;
