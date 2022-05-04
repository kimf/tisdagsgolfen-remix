import React from 'react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Button, Center, Divider, Heading, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { Form, Link, useLoaderData } from '@remix-run/react';
import type { Course, Player, Team } from '@prisma/client';

import db from '~/lib/db.server';
import Initial from '~/components/Setup/Initial';
import SelectPlayers from '~/components/Setup/SelectPlayers';
import Setup from '~/components/Setup/Setup';

export const loader: LoaderFunction = async () => {
  const courses = await db.course.findMany();
  const players = await db.player.findMany();
  return json({ courses, players });
};

export interface PlayerWithStrokes extends Player {
  strokes: number;
}
export interface PlayState {
  step: string;
  weekType: string;
  eventType: string;
  scoringType: string;
  course?: Course;
  players: PlayerWithStrokes[];
  teams: Team[];
}

const steps = ['initial', 'players', 'setup'];

export default function Index() {
  const { courses, players } = useLoaderData<{ courses: Course[]; players: Player[] }>();
  const [playState, setPlayState] = React.useState<PlayState>({
    step: 'initial',
    weekType: 'normal',
    eventType: 'individual',
    scoringType: 'points',
    course: undefined,
    players: [],
    teams: [],
  });

  const setPlayStateKey = (key: string, value: any) => setPlayState({ ...playState, [key]: value });
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
      <pre>{JSON.stringify(playState, undefined, 2)}</pre>
    </div>
  );
}
