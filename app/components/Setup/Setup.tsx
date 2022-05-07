import React from 'react';
import { useSubmit } from '@remix-run/react';
import invariant from 'tiny-invariant';
import type { PlayState } from './SetupWrapper';
import { User, Button, Text, Input, Card, Divider, Spacer, Grid } from '@nextui-org/react';

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
    <>
      <Text h4>{isTeamEvent ? `Sätt ihop lag (+slag)` : `Ställ in slag`}</Text>

      {isTeamEvent && (
        <>
          {playState.teams.map((team, index: number) => {
            if (availablePlayers.length === 0 && team.playerIds.length === 0) {
              return null;
            }
            return (
              <Card key={index} hoverable css={{ marginTop: 25 }}>
                <Card.Header>
                  <Text>Lag {`${index + 1}`}</Text>
                  <Spacer />
                  <Input
                    type="number"
                    bordered
                    value={team.strokes}
                    onChange={(e) => setTeamStrokes(index, parseInt(e.target.value, 10))}
                  />
                </Card.Header>
                <Divider />
                <Divider />
                <Card.Body css={{ py: '$10' }}>
                  <Text>Spelare i laget</Text>
                  <Spacer />
                  {playState.players
                    .filter((p) => team.playerIds.includes(p.id))
                    .map((player) => (
                      <User
                        src={player.photo}
                        name={`${player.first_name} ${player.last_name}`}
                        size="sm"
                        key={player.id}
                        onClick={() => removePlayerFromTeam(player.id, index)}
                        pointer
                      />
                    ))}
                  <Spacer y={2} />
                  <Divider />
                  <Spacer y={1} />
                  <Text>Tillgängliga spelare</Text>
                  <Spacer />
                  {availablePlayers.map((player) => (
                    <User
                      src={player.photo}
                      name={`${player.first_name} ${player.last_name}`}
                      size="sm"
                      key={player.id}
                      onClick={() => addPlayerToTeam(player.id, index)}
                      pointer
                    />
                  ))}
                </Card.Body>
              </Card>
            );
          })}
        </>
      )}

      {!isTeamEvent && (
        <>
          {playState.players.map((player) => (
            <Card key={player.id} hoverable css={{ marginTop: 25 }}>
              <Card.Header>
                <User
                  src={player.photo}
                  name={`${player.first_name} ${player.last_name}`}
                  size="sm"
                />
              </Card.Header>
              <Card.Body>
                <Input
                  type="number"
                  bordered
                  value={player.strokes}
                  onChange={(e) => setStrokes(player.id, parseInt(e.target.value, 10))}
                />
              </Card.Body>
            </Card>
          ))}
        </>
      )}

      <Button onClick={submitForm}>SKAPA RUNDA</Button>
    </>
  );
};

export default Setup;
