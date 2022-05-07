import React from 'react';
import type { CSS } from '@nextui-org/react';
import { styled, useTheme } from '@nextui-org/react';
import { MoonIcon, SunIcon } from '~/components/Icons';
import useDarkMode from '@fisch0920/use-dark-mode';

interface Props {
  className?: string;
  css?: CSS;
}

// @ts-ignore
const StyledButton = styled('button', {
  dflex: 'center',
  size: 'auto',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  padding: 0,
  '& .theme-selector-icon': {
    color: '$colors$headerIconColor',
  },
  '@xsMax': {
    px: '$2',
  },
});

export const ThemeToggle: React.FC<Props> = ({ className = '', css }) => {
  const darkMode = useDarkMode();
  const { isDark } = useTheme();

  const handleToggleTheme = React.useCallback(() => {
    darkMode.toggle();
  }, [darkMode]);

  return (
    <StyledButton
      aria-label="toggle a light and dark color scheme"
      className={`theme-selector-container ${className}`}
      onClick={handleToggleTheme}
      css={css}
    >
      {isDark ? (
        <SunIcon filled className="theme-selector-icon" size={20} />
      ) : (
        <MoonIcon filled className="theme-selector-icon" size={20} />
      )}
    </StyledButton>
  );
};

export default ThemeToggle;
