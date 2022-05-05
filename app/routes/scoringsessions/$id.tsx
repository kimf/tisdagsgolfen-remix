import { useLoaderData, useParams } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { ActionFunction, json } from '@remix-run/node';

import db from '~/lib/db.server';
import invariant from 'tiny-invariant';

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, 'ID är inte angett!');
  const data = await db.scoringSession.findUnique({
    where: { id: parseInt(params.id, 10) },
    select: {
      id: true,
      currentHole: true,
      scorerId: true,
      event: { include: { course: { include: { holes: true } } } },
      players: {
        select: { id: true, strokes: true, player: true },
      },
      teams: {
        select: { id: true, strokes: true, players: true },
      },
    },
  });
  return json(data);
};

export default function ScoringSessionRoute() {
  const data = useLoaderData();

  return (
    <div>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </div>
  );
}
