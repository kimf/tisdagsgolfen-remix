import React from 'react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Button, Center, Divider, Heading, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { Form, Link, useLoaderData } from '@remix-run/react';
import type { Course } from '@prisma/client';

import db from '~/lib/db.server';

export const loader: LoaderFunction = async () => {
  const data = await db.course.findMany({
    include: {
      holes: true,
    },
  });
  return json(data);
};

export default function Index() {
  const courses = useLoaderData<Course[]>();
  const [weekType, setWeekType] = React.useState('normal');
  const [eventType, setEventType] = React.useState('individual');
  const [scoringType, setScoringType] = React.useState('points');
  const [courseId, setCourseId] = React.useState('');

  return (
    <div>
      <Form action="/play/players">
        <RadioGroup onChange={setWeekType} value={weekType}>
          <Stack direction="row">
            <Radio value="normal">Vanlig vecka</Radio>
            <Radio value="special">Specialvecka</Radio>
          </Stack>
        </RadioGroup>
        <Center height="20px">
          <Divider />
        </Center>
        <RadioGroup onChange={setEventType} value={eventType}>
          <Stack direction="row">
            <Radio value="individual">Individuellt</Radio>
            <Radio value="team">Lag</Radio>
          </Stack>
        </RadioGroup>
        <Center height="20px">
          <Divider />
        </Center>
        <RadioGroup onChange={setScoringType} value={scoringType}>
          <Stack direction="row">
            <Radio value="points">Poäng</Radio>
            <Radio value="strokes">Slag</Radio>
          </Stack>
        </RadioGroup>
        <Center height="20px">
          <Divider />
        </Center>
        <Heading size="md">Välj bana</Heading>
        <RadioGroup onChange={setCourseId} value={courseId}>
          <Stack direction="column">
            {courses.map((course) => (
              <Radio key={course.id} value={`${course.id}`}>
                {course.club} - {course.name}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
        {courseId !== '' && (
          <Button type="submit" colorScheme="green">
            Välj Spelare
          </Button>
        )}
      </Form>
    </div>
  );
}
