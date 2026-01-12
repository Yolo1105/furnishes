import { CSSProperties } from 'react';

// Shared font constant
export const FONT_MANROPE = 'var(--font-manrope), sans-serif';

// Shared style definitions
export const commonStyles = {
  topLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  topLabelLine: {
    width: '60px',
    height: '2px',
    background: '#FF7A1A',
  } as CSSProperties,
  topLabelText: {
    fontSize: '1.2rem',
    color: '#111',
    fontWeight: 500,
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  headingLarge: {
    fontSize: '3.5rem',
    fontWeight: 700,
    color: '#111',
    lineHeight: 1.1,
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  bodyText: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    color: '#333',
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
};
