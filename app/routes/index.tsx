import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Button, Heading } from '@chakra-ui/react';
import { Link, useLoaderData } from '@remix-run/react';

import Stats from '~/components/Stats';
import SeasonLeaderboard from '~/components/SeasonLeaderboard';
import Event from '~/components/Event';
import type { definitions } from 'types/supabase';
import supabase from '~/lib/supabase.server';

export const loader: LoaderFunction = async () => {
  const { data: season } = await supabase.from('seasons').select('*').eq('name', '2022').single();
  const { data: events } = await supabase.from('events').select('id').eq('status', 'FINISHED');
  return json({ season, events });
};

export default function Index() {
  const { season, events } = useLoaderData<{
    season: definitions['seasons'];
    events: definitions['events'][];
  }>();

  if (!season) {
    return <h1>Kunde inte hitta säsong.. Kim har gjort bort sig</h1>;
  }

  return (
    <div>
      <Link to="/play">
        <Button colorScheme="green">NY RUNDA</Button>
      </Link>
      <Heading>Tisdagsgolfen {season.name}</Heading>
      <Stats />
      <SeasonLeaderboard season={season} events={events} />
      <Event />
    </div>
  );
}
