import { eventstatus } from '@prisma/client';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import db from '~/lib/db.server';
import type { PlayState } from './play/index';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const json = formData.get('json') as string;
  const playState: PlayState = JSON.parse(json);

  const eventParams = {
    seasonId: 1,
    courseId: playState.course!.id,
    special: playState.special,
    scoring: playState.scoringType,
    type: playState.eventType,
    status: eventstatus['STARTED'],
  };

  let event = await db.event.findFirst({
    where: eventParams,
  });

  if (!event) {
    event = await db.event.create({ data: eventParams });
  }

  const players =
    playState.eventType === 'INDIVIDUAL'
      ? playState.players.map((player) => {
          return {
            strokes: player.strokes,
            player: { connect: { id: player.id } },
          };
        })
      : [];

  const teams =
    playState.eventType === 'TEAM'
      ? playState.teams
          .filter((t) => t.playerIds.length > 0)
          .map((team) => {
            return {
              strokes: team.strokes,
              players: { connect: team.playerIds.map((id) => ({ id })) },
            };
          })
      : [];

  const scoringSession = await db.scoringSession.create({
    data: {
      event: { connect: { id: event.id } },
      scorer: { connect: { id: 1 } },
      players: { create: players },
      teams: { create: teams },
    },
  });

  //   const project = await createProject(body);
  return redirect(`/scoringsessions/${scoringSession.id}`);
};
