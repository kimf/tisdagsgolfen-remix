import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Heading } from '@chakra-ui/react';
import { useLoaderData } from '@remix-run/react';
import type { Season } from '@prisma/client';

import db from '~/lib/db.server';
import Stats from '~/components/Stats';
import SeasonLeaderboard from '~/components/SeasonLeaderboard';
import Event from '~/components/Event';

export type SeasonWithEventCount = Season & {
  _count: {
    events: number;
  };
};

export const loader: LoaderFunction = async () => {
  const data = await db.season.findFirst({
    include: {
      _count: {
        select: { events: true },
      },
    },
  });
  return json(data);
};

export default function Index() {
  const season = useLoaderData<SeasonWithEventCount | null>();

  if (!season) {
    return <h1>Kunde inte hitta säsong.. Kim har gjort bort sig</h1>;
  }

  return (
    <div>
      <Heading>Tisdagsgolfen {season.name}</Heading>
      <Stats />
      <SeasonLeaderboard season={season} />
      <Event />
    </div>
  );
}
