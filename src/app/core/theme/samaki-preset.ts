import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * PrimeNG preset built on Aura and pointed at the site's own design tokens
 * (src/styles/_tokens.scss). Both colour schemes read the same CSS variables,
 * which switch with [data-theme], so PrimeNG controls and the rest of the site
 * never disagree about a colour.
 */
const scheme = {
  primary: {
    color: 'var(--c-brand)',
    contrastColor: 'var(--c-brand-ink)',
    hoverColor: 'var(--c-brand-hover)',
    activeColor: 'var(--c-brand-hover)',
  },
  highlight: {
    background: 'var(--c-brand-soft)',
    focusBackground: 'var(--c-brand-soft)',
    color: 'var(--c-brand-soft-ink)',
    focusColor: 'var(--c-brand-soft-ink)',
  },
  mask: { background: 'var(--c-scrim)', color: 'var(--c-ink)' },
  formField: {
    background: 'var(--c-surface)',
    disabledBackground: 'var(--c-surface-3)',
    filledBackground: 'var(--c-surface-2)',
    filledHoverBackground: 'var(--c-surface-2)',
    filledFocusBackground: 'var(--c-surface)',
    borderColor: 'var(--c-line-strong)',
    hoverBorderColor: 'var(--c-ink-3)',
    focusBorderColor: 'var(--c-brand)',
    invalidBorderColor: 'var(--c-danger)',
    color: 'var(--c-ink)',
    disabledColor: 'var(--c-ink-3)',
    placeholderColor: 'var(--c-ink-3)',
    invalidPlaceholderColor: 'var(--c-danger)',
    floatLabelColor: 'var(--c-ink-3)',
    floatLabelFocusColor: 'var(--c-brand-text)',
    floatLabelActiveColor: 'var(--c-ink-3)',
    floatLabelInvalidColor: 'var(--c-danger)',
    iconColor: 'var(--c-ink-3)',
    shadow: 'none',
  },
  text: {
    color: 'var(--c-ink)',
    hoverColor: 'var(--c-ink)',
    mutedColor: 'var(--c-ink-2)',
    hoverMutedColor: 'var(--c-ink)',
  },
  content: {
    background: 'var(--c-surface)',
    hoverBackground: 'var(--c-surface-2)',
    borderColor: 'var(--c-line)',
    color: 'var(--c-ink)',
    hoverColor: 'var(--c-ink)',
  },
  overlay: {
    select: { background: 'var(--c-surface)', borderColor: 'var(--c-line)', color: 'var(--c-ink)' },
    popover: {
      background: 'var(--c-surface)',
      borderColor: 'var(--c-line)',
      color: 'var(--c-ink)',
    },
    modal: { background: 'var(--c-surface)', borderColor: 'var(--c-line)', color: 'var(--c-ink)' },
  },
  list: {
    option: {
      focusBackground: 'var(--c-surface-2)',
      selectedBackground: 'var(--c-brand-soft)',
      selectedFocusBackground: 'var(--c-brand-soft)',
      color: 'var(--c-ink)',
      focusColor: 'var(--c-ink)',
      selectedColor: 'var(--c-brand-soft-ink)',
      selectedFocusColor: 'var(--c-brand-soft-ink)',
      icon: { color: 'var(--c-ink-3)', focusColor: 'var(--c-ink-2)' },
    },
    optionGroup: { background: 'transparent', color: 'var(--c-ink-2)' },
  },
  navigation: {
    item: {
      focusBackground: 'var(--c-surface-2)',
      activeBackground: 'var(--c-surface-2)',
      color: 'var(--c-ink)',
      focusColor: 'var(--c-ink)',
      activeColor: 'var(--c-ink)',
      icon: {
        color: 'var(--c-ink-3)',
        focusColor: 'var(--c-ink-2)',
        activeColor: 'var(--c-ink-2)',
      },
    },
  },
};

export const SamakiPreset = definePreset(Aura, {
  primitive: {
    borderRadius: { none: '0', xs: '6px', sm: '10px', md: '14px', lg: '22px', xl: '32px' },
  },
  semantic: {
    primary: {
      50: '#eaf7f3',
      100: '#d9efe7',
      200: '#b0ddcf',
      300: '#7fc6b3',
      400: '#45a792',
      500: '#0b6e5f',
      600: '#085a4e',
      700: '#07463d',
      800: '#06352f',
      900: '#052823',
      950: '#031915',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: 'var(--c-focus)',
      offset: '2px',
      shadow: 'none',
    },
    formField: {
      paddingX: '0.9rem',
      paddingY: '0.7rem',
      borderRadius: 'var(--r-sm)',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: '0 0 0 3px color-mix(in srgb, var(--c-brand) 28%, transparent)',
      },
    },
    colorScheme: { light: scheme, dark: scheme },
  },
});
