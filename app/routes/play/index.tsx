import React from 'react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Button } from '@chakra-ui/react';
import { useLoaderData } from '@remix-run/react';
import type { Course, eventscoring, eventtype, Player } from '@prisma/client';

import db from '~/lib/db.server';
import Initial from '~/components/Setup/Initial';
import SelectPlayers from '~/components/Setup/SelectPlayers';
import Setup from '~/components/Setup/Setup';

export const loader: LoaderFunction = async () => {
  const courses = await db.course.findMany();
  const players = await db.player.findMany();
  return json({ courses, players: players.map((p) => ({ ...p, playerId: p.id, strokes: 10 })) });
};
export interface UnsavedTeam {
  strokes: number;
  playerIds: number[];
}
export interface UnsavedPlayer extends Player {
  strokes: number;
}

export interface PlayState {
  step: 'initial' | 'players' | 'setup';
  special: boolean;
  eventType: eventtype;
  scoringType: eventscoring;
  course?: Course;
  players: UnsavedPlayer[];
  teams: UnsavedTeam[];
}

const steps = ['initial', 'players', 'setup'];

export default function PlayIndex() {
  const { courses, players } = useLoaderData<{ courses: Course[]; players: UnsavedPlayer[] }>();
  const [playState, setPlayState] = React.useState<PlayState>({
    step: 'initial',
    special: false,
    eventType: 'INDIVIDUAL',
    scoringType: 'POINTS',
    course: undefined,
    players: [],
    teams: [],
  });

  const setPlayStateKey = (key: string, value: any) =>
    setPlayState((prev) => ({ ...prev, [key]: value }));

  const stepBack = () => {
    const index = steps.findIndex((s) => s === playState.step);
    if (index > 0) {
      setPlayStateKey('step', steps[index - 1]);
    }
  };

  return (
    <div>
      {playState.step !== 'initial' && <Button onClick={stepBack}>&larr; Tillbaka</Button>}
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
    </div>
  );
}
