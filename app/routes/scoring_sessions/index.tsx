import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';

import supabase from '~/lib/supabase.server';
import type { definitions } from 'types/supabase';
import type { PlayState } from '~/components/Setup/SetupWrapper';

// TODO: Move all business logic here to Postgres or Supabase RPC
const findOrCreateEvent = async (playState: PlayState) => {
  const eventParams: Omit<definitions['events'], 'id'> = {
    season_id: 1,
    course_id: playState.course!.id,
    special: playState.special,
    scoring: playState.scoringType,
    type: playState.eventType,
    status: 'STARTED',
  };
  let eventId = null;

  const { data: foundEvent } = await supabase
    .from<definitions['events']>('events')
    .select('id')
    .eq('season_id', 1)
    .eq('course_id', playState.course!.id)
    .eq('special', playState.special)
    .eq('scoring', playState.scoringType)
    .eq('type', playState.eventType)
    .single();

  if (!foundEvent) {
    const { data: createdEvent } = await supabase
      .from<definitions['events']>('events')
      .insert([eventParams])
      .single();
    eventId = createdEvent?.id;
  } else {
    eventId = foundEvent.id;
  }
  invariant(eventId, 'Vi har inget event!');
  return eventId;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const json = formData.get('json') as string;
  const playState: PlayState = JSON.parse(json);

  const eventId = await findOrCreateEvent(playState);

  const { data: scoringSession } = await supabase
    .from<definitions['scoring_sessions']>('scoring_sessions')
    .insert([{ event_id: eventId, scorer_id: 1 }])
    .single();

  invariant(scoringSession, 'Kunde inte skapa scoringSession');

  if (playState.eventType === 'INDIVIDUAL') {
    const players = playState.players.map((player) => {
      return {
        strokes: player.strokes,
        player_id: player.id,
        scoring_session_id: scoringSession.id,
      };
    });
    await supabase.from('scoring_players').insert(players);
  }

  if (playState.eventType === 'TEAM') {
    const teams = playState.teams.filter((t) => t.playerIds.length > 0);
    for (const team of teams) {
      const { data: scoringTeam } = await supabase
        .from('scoring_teams')
        .insert([{ strokes: team.strokes, scoring_session_id: scoringSession.id }])
        .single();

      await supabase
        .from('scoring_team_players')
        .insert(team.playerIds.map((pid) => ({ scoring_team_id: scoringTeam.id, player_id: pid })));
    }
  }

  return redirect(`/scoring_sessions/${scoringSession.id}`);
};
