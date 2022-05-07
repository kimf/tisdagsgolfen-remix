import { Button, Col, Grid, Radio, Spacer, Switch, Text } from '@nextui-org/react';
import React from 'react';
import type { definitions } from 'types/supabase';
import type { PlayState } from './SetupWrapper';

const Initial: React.FC<{
  playState: PlayState;
  courses: definitions['courses'][];
  setPlayStateKey: (key: string, value: any) => void;
}> = ({ playState, courses, setPlayStateKey }) => {
  const setCourseId = (id: string | number) => {
    const course = courses.find((c) => c.id === id);
    setPlayStateKey('course', course);
  };

  console.log(playState);

  return (
    <>
      <Grid.Container gap={2}>
        <Grid>
          <Switch
            id="special"
            size="lg"
            checked={playState.special}
            onChange={(e) => setPlayStateKey('special', e.target.checked)}
          />
        </Grid>
        <Grid>
          <Text h4>Vanlig vecka</Text>
        </Grid>
      </Grid.Container>
      <Spacer y={1} />
      <Radio.Group
        onChange={(val) => setPlayStateKey('eventType', val)}
        value={playState.eventType}
        row
      >
        <Radio size="lg" value="INDIVIDUAL">
          Individuellt
        </Radio>
        <Radio size="lg" value="TEAM">
          Lag
        </Radio>
      </Radio.Group>
      <Spacer y={1} />
      <Radio.Group
        onChange={(val) => setPlayStateKey('scoringType', val)}
        value={playState.scoringType}
        row
      >
        <Radio size="lg" value="POINTS">
          Poäng
        </Radio>
        <Radio size="lg" value="STROKES">
          Slag
        </Radio>
      </Radio.Group>
      <Spacer y={1} />

      <Text h3>Välj bana</Text>
      <Radio.Group onChange={setCourseId} value={playState.course ? playState.course.id : ''}>
        {courses.map((course) => (
          <Radio size="lg" key={course.id} value={course.id}>
            {course.club} - {course.name}
          </Radio>
        ))}
      </Radio.Group>
      <Spacer y={1} />
      {playState.course && (
        <Button onClick={() => setPlayStateKey('step', 'players')}>Välj Spelare</Button>
      )}
    </>
  );
};

export default Initial;
