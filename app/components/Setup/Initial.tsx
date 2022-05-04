import React from 'react';
import { Button, Center, Divider, Heading, Radio, RadioGroup, Stack } from '@chakra-ui/react';

import type { Course } from '@prisma/client';
import type { PlayState } from '~/routes/play';

const Initial: React.FC<{
  playState: PlayState;
  courses: Course[];
  setPlayStateKey: (key: string, value: any) => void;
}> = ({ playState, courses, setPlayStateKey }) => {
  const setCourseId = (id: string) => {
    const course = courses.find((c) => `${c.id}` === id);
    setPlayStateKey('course', course);
  };

  return (
    <div>
      <RadioGroup
        name="weekType"
        onChange={(val) => setPlayStateKey('weekType', val)}
        value={playState.weekType}
      >
        <Stack spacing={5} direction="row">
          <Radio size="lg" colorScheme="green" value="normal">
            Vanlig vecka
          </Radio>
          <Radio size="lg" colorScheme="green" value="special">
            Specialvecka
          </Radio>
        </Stack>
      </RadioGroup>
      <Center height="20px">
        <Divider />
      </Center>
      <RadioGroup
        name="eventType"
        onChange={(val) => setPlayStateKey('eventType', val)}
        value={playState.eventType}
      >
        <Stack spacing={5} direction="row">
          <Radio size="lg" colorScheme="green" value="individual">
            Individuellt
          </Radio>
          <Radio size="lg" colorScheme="green" value="team">
            Lag
          </Radio>
        </Stack>
      </RadioGroup>
      <Center height="20px">
        <Divider />
      </Center>
      <RadioGroup
        name="scoringType"
        onChange={(val) => setPlayStateKey('scoringType', val)}
        value={playState.scoringType}
      >
        <Stack spacing={5} direction="row">
          <Radio size="lg" colorScheme="green" value="points">
            Poäng
          </Radio>
          <Radio size="lg" colorScheme="green" value="strokes">
            Slag
          </Radio>
        </Stack>
      </RadioGroup>
      <Center height="40px">
        <Divider />
      </Center>
      <Heading size="md" marginBottom={5}>
        Välj bana
      </Heading>
      <RadioGroup
        name="courseId"
        onChange={setCourseId}
        value={playState.course ? playState.course.id : ''}
      >
        <Stack spacing={2} direction="column">
          {courses.map((course: Course) => (
            <Radio size="lg" colorScheme="green" key={course.id} value={course.id}>
              {course.club} - {course.name}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <Center height="40px">
        <Divider />
      </Center>
      {playState.course && (
        <Button colorScheme="green" onClick={() => setPlayStateKey('step', 'players')}>
          Välj Spelare
        </Button>
      )}
    </div>
  );
};

export default Initial;
