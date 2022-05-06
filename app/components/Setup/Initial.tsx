import React from 'react';
import {
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from '@chakra-ui/react';

import type { definitions } from 'types/supabase';
import type { PlayState } from './SetupWrapper';

const Initial: React.FC<{
  playState: PlayState;
  courses: definitions['courses'][];
  setPlayStateKey: (key: string, value: any) => void;
}> = ({ playState, courses, setPlayStateKey }) => {
  const setCourseId = (id: string) => {
    const course = courses.find((c) => `${c.id}` === id);
    setPlayStateKey('course', course);
  };

  return (
    <div>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="special" mb="0">
          Specialvecka?
        </FormLabel>

        <Switch
          id="special"
          size="md"
          colorScheme="green"
          isChecked={playState.special}
          onChange={(e) => setPlayStateKey('special', e.target.checked)}
        />
      </FormControl>
      <Center height="20px">
        <Divider />
      </Center>
      <RadioGroup
        name="eventType"
        onChange={(val) => setPlayStateKey('eventType', val)}
        value={playState.eventType}
      >
        <Stack spacing={5} direction="row">
          <Radio size="lg" colorScheme="green" value="INDIVIDUAL">
            Individuellt
          </Radio>
          <Radio size="lg" colorScheme="green" value="TEAM">
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
          <Radio size="lg" colorScheme="green" value="POINTS">
            Poäng
          </Radio>
          <Radio size="lg" colorScheme="green" value="STROKES">
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
          {courses.map((course) => (
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
