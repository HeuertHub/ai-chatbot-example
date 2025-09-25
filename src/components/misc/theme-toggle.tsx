'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  if (!mounted) {
    return <button aria-label="Toggle theme" style={fabStyle} />;
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      style={fabStyle}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}

const fabStyle: React.CSSProperties = {
  position: 'fixed',
  left: '95%',
  transform: 'translateX(-50%)',
  bottom: '3%',
  width: 56,
  height: 56,
  borderRadius: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--fab-bg, rgba(0,0,0,0.75))',
  color: 'white',
  border: 'none',
  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  cursor: 'pointer',
  zIndex: 50,
};