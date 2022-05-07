import React from 'react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils';

import supabase from '~/lib/supabase.server';
import type { definitions } from 'types/supabase';
import SetupWrapper from '~/components/Setup/SetupWrapper';

export const loader: LoaderFunction = async () => {
  const coursesPromise = supabase.from('courses');
  const playersPromise = supabase.from('players');

  let [{ data: courses }, { data: players }] = await Promise.all([coursesPromise, playersPromise]);

  return json({
    courses,
    players: players ? players.map((p) => ({ ...p, playerId: p.id, strokes: 10 })) : [],
  });
};

export default function PlayIndex() {
  const { courses, players } = useLoaderData<{
    courses: definitions['courses'][];
    players: definitions['players'][];
  }>();

  return (
    <ClientOnly fallback={<p>Loading...</p>}>
      {() => <SetupWrapper courses={courses} players={players} />}
    </ClientOnly>
  );
}
