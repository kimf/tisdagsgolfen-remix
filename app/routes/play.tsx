import { Container } from '@chakra-ui/react';
import { Outlet } from '@remix-run/react';

export default function PlayLayout() {
  return (
    <div>
      <Container maxW="md" padding={10}>
        <Outlet />
      </Container>
    </div>
  );
}
