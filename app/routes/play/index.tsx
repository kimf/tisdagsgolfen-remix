import React from 'react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils';

import supabase from '~/lib/supabase.server';
import type { definitions } from 'types/supabase';
import SetupWrapper from '~/components/Setup/SetupWrapper';
import { Container } from '@chakra-ui/react';

export const loader: LoaderFunction = async () => {
  const { data: courses } = await supabase.from('courses');
  const { data: players } = await supabase.from('players');
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
    <Container maxW="md" padding={10}>
      <ClientOnly fallback={<p>Loading...</p>}>
        {() => <SetupWrapper courses={courses} players={players} />}
      </ClientOnly>
    </Container>
  );
}
