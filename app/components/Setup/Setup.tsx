import React from 'react';
import { Button, Center, Divider, Heading, List, ListItem, Stack, Text } from '@chakra-ui/react';
import { useSubmit } from '@remix-run/react';
import invariant from 'tiny-invariant';
import NumberStepper from '../NumberStepper';
import type { PlayState } from './SetupWrapper';

const Setup: React.FC<{
  playState: PlayState;
  setPlayStateKey: (key: string, value: any) => void;
}> = ({ playState, setPlayStateKey }) => {
  invariant(playState.course, 'Course has to be set');
  const submit = useSubmit();

  const setStrokes = (id: number, val: number) => {
    const updatedPlayers = playState.players.map((p) => {
      if (p.id === id) {
        p.strokes = val;
      }
      return { ...p };
    });
    setPlayStateKey('players', updatedPlayers);
  };

  const setTeamStrokes = (index: number, val: number) => {
    const updatedTeams = playState.teams.map((t, tIndex) => {
      if (tIndex === index) {
        t.strokes = val;
      }
      return { ...t };
    });
    setPlayStateKey('teams', updatedTeams);
  };

  const removePlayerFromTeam = (id: number, teamIndex: number) => {
    const newTeams = [...playState.teams];
    newTeams[teamIndex].playerIds = newTeams[teamIndex].playerIds.filter((pid) => pid !== id);
    setPlayStateKey('teams', newTeams);
  };

  const addPlayerToTeam = (id: number, teamIndex: number) => {
    const newTeams = [...playState.teams];
    newTeams[teamIndex].playerIds.push(id);
    setPlayStateKey('teams', newTeams);
  };

  const submitForm = () => {
    window.localStorage.removeItem('PLAY_STATE');
    submit(
      { json: JSON.stringify(playState) },
      { method: 'post', action: '/scoring_sessions?index' },
    );
  };

  const isTeamEvent = playState.eventType === 'TEAM';
  const selectedPlayerIds = playState.teams.map((t) => t.playerIds).flat();
  const availablePlayers = playState.players.filter((p) => !selectedPlayerIds.includes(p.id));

  return (
    <div>
      <Heading size="md" marginBottom={5}>
        {isTeamEvent ? `Sätt ihop lag (+slag)` : `Ställ in slag`}
      </Heading>

      {isTeamEvent && (
        <Stack spacing={2} direction="column">
          {playState.teams.map((team, index: number) => {
            if (availablePlayers.length === 0 && team.playerIds.length === 0) {
              return null;
            }
            return (
              <li key={index}>
                <Stack direction="row">
                  <Text>Lag {`${index + 1}`}</Text>
                  <NumberStepper
                    value={team.strokes}
                    setValue={(val: number) => setTeamStrokes(index, val)}
                  />
                </Stack>
                <List spacing={3}>
                  {playState.players
                    .filter((p) => team.playerIds.includes(p.id))
                    .map((player) => (
                      <ListItem
                        bg="green.500"
                        color="white"
                        key={player.id}
                        onClick={() => removePlayerFromTeam(player.id, index)}
                      >
                        {player.first_name} {player.last_name}
                      </ListItem>
                    ))}
                  {availablePlayers.map((player) => (
                    <ListItem key={player.id} onClick={() => addPlayerToTeam(player.id, index)}>
                      {player.first_name} {player.last_name}
                    </ListItem>
                  ))}
                </List>
              </li>
            );
          })}
        </Stack>
      )}

      {!isTeamEvent && (
        <Stack spacing={2} direction="column">
          {playState.players.map((player) => (
            <li key={player.id}>
              {player.first_name} {player.last_name}
              <NumberStepper
                value={player.strokes}
                setValue={(val: number) => setStrokes(player.id, val)}
              />
            </li>
          ))}
        </Stack>
      )}

      <Center height="40px">
        <Divider />
      </Center>

      <Button colorScheme="green" onClick={submitForm}>
        SKAPA RUNDA
      </Button>
    </div>
  );
};

export default Setup;
