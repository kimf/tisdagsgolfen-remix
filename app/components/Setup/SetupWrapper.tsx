import { Button, Container, Divider, Spacer } from '@nextui-org/react';
import React from 'react';
import type { definitions } from 'types/supabase';

import Initial from '~/components/Setup/Initial';
import SelectPlayers from '~/components/Setup/SelectPlayers';
import Setup from '~/components/Setup/Setup';

export interface ScoringPlayer {
  id: number;
  strokes: number;
  first_name: string;
  last_name: string;
  photo?: string;
}
export interface ScoringTeam {
  id: number;
  strokes: number;
  playerIds: number[];
}

export interface PlayState {
  step: 'initial' | 'players' | 'setup';
  special: boolean;
  eventType: definitions['events']['type'];
  scoringType: definitions['events']['scoring'];
  course?: definitions['courses'];
  players: ScoringPlayer[];
  teams: ScoringTeam[];
}

const steps = ['initial', 'players', 'setup'];

export default function SetupWrapper({
  courses,
  players,
}: {
  courses: definitions['courses'][];
  players: definitions['players'][];
}) {
  const [playState, setPlayState] = React.useState<PlayState>(() => {
    const data = window.localStorage.getItem('PLAY_STATE');
    if (data !== null) {
      return JSON.parse(data);
    } else {
      return {
        step: 'initial',
        special: false,
        eventType: 'INDIVIDUAL',
        scoringType: 'POINTS',
        course: undefined,
        players: [],
        teams: [],
      };
    }
  });

  React.useEffect(() => {
    window.localStorage.setItem('PLAY_STATE', JSON.stringify(playState));
  }, [playState]);

  const setPlayStateKey = (key: string, value: any) =>
    setPlayState((prev) => ({ ...prev, [key]: value }));

  const stepBack = () => {
    const index = steps.findIndex((s) => s === playState.step);
    if (index > 0) {
      setPlayStateKey('step', steps[index - 1]);
    }
  };

  return (
    <Container css={{ paddingTop: '25px' }}>
      {playState.step !== 'initial' && (
        <>
          <Button light color="secondary" size="sm" onClick={stepBack}>
            &larr; Tillbaka
          </Button>
          <Spacer />
          <Divider />
          <Spacer />
        </>
      )}
      {playState.step === 'initial' && (
        <Initial playState={playState} setPlayStateKey={setPlayStateKey} courses={courses} />
      )}
      {playState.step === 'players' && (
        <SelectPlayers
          players={players}
          eventType={playState.eventType}
          setPlayStateKey={setPlayStateKey}
          chosenPlayers={playState.players}
        />
      )}
      {playState.step === 'setup' && (
        <Setup playState={playState} setPlayStateKey={setPlayStateKey} />
      )}
    </Container>
  );
}
