import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import supabase from '~/lib/supabase.server';
import invariant from 'tiny-invariant';

// scoring_teams(id, strokes, players:scoring_team_players(id, user:player_id(id, first_name, last_name, photo))
const user_fields = `id, first_name, last_name, photo`;
export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, 'ID är inte angett!');
  const { data, error } = await supabase
    .from('scoring_sessions')
    .select(
      `
      id,
      current_hole,
      scorer:scorer_id (${user_fields}),
      event:event_id (
        id,
        special,
        scoring,
        status,
        type,
        course:course_id(
          id,
          club,
          name,
          par,
          holes(
            id,
            index,
            number,
            par
          )
        )
      ),
      scoring_players(
        id,
        strokes,
        user:player_id(${user_fields})
      ),
      scoring_teams(
        id,
        strokes,
        players:scoring_team_players(
          id,
          user:player_id(${user_fields})
        )
      )
    `,
    )
    .eq('id', parseInt(params.id, 10));

  if (error) {
    console.log(error);
  }

  return json({ scoringSession: data });
};

export default function ScoringSessionRoute() {
  const { scoringSession } = useLoaderData();

  return (
    <div>
      <pre>{JSON.stringify({ scoringSession }, undefined, 2)}</pre>
    </div>
  );
}
