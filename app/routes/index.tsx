import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Button, Container } from '@nextui-org/react';

import Stats from '~/components/Stats';
import SeasonLeaderboard from '~/components/SeasonLeaderboard';
import Event from '~/components/Event';
import type { definitions } from 'types/supabase';
import supabase from '~/lib/supabase.server';
import { ThemeToggle } from '~/components/ThemeToggle';

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
    <Container>
      <header>
        <h2>Tisdagsgolfen {season.name}</h2>
        <ThemeToggle />
        <Link to="/play">
          <Button size="sm" color="gradient">
            NY RUNDA
          </Button>
        </Link>
      </header>
      <main>
        <Stats />
        <SeasonLeaderboard season={season} events={events} />
        <Event />
      </main>
    </Container>
  );
}
