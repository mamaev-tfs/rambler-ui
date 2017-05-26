import { borderMixin } from '../style/mixins'

const borderChampMixin = (color) => ({
  boxShadow: `0 3px 7px 0 ${color}`
})
const styleButtonChampMixin = (type, options) => ({
  [`type-${type}`]: {
    extend: type === 'secondary' ? borderMixin(options.defaultBorder) : null,
    color: `${options.textColor}`,
    borderRadius: options.borderRadius,
    background: options.defaultBg,
    '&:focus:not(:active)': {
      color: `${options.activeTextColor} !important`,
      background: `${options.focusBg} !important`
    },
    '&:focus:not(:active):before': {
      extend: type === 'primary' ? borderChampMixin(options.focusBorder) : type === 'secondary' ? borderMixin(options.focusBorder) : null,
      top: -options.focusOffset,
      bottom: -options.focusOffset,
      left: -options.focusOffset,
      right: -options.focusOffset,
      borderRadius: options.borderRadius
    },
    '&:hover:not(:active)': {
      extend: type === 'primary' ? borderChampMixin(options.hoverBorder) : type === 'secondary' ? borderMixin(options.hoverBorder) : null,
      color: `${options.activeTextColor} !important`,
      borderRadius: options.borderRadius,
      background: `${options.hoverBg} !important`
    },
    '&:active': {
      extend: type === 'primary' ? borderChampMixin(options.activeBorder) : type === 'secondary' ? borderMixin(options.activeBorder) : null,
      color: `${options.activeTextColor} !important`,
      borderRadius: options.borderRadius,
      background: options.activeBg
    },
    '&[disabled]': {
      extend: null,
      color: `${options.disabledTextColor} !important`,
      background: options.disabledBg
    }
  }
})

export default {
  sizes: {
    medium: {
      height: 40,
      icon: 20
    },
    small: {
      height: 30,
      icon: 15
    }
  },
  checkbox: {
    borderColor: '#a5acb2',
    borderRadius: 2,
    hoverBorderColor: '#ff4800',
    activeBorderColor: '#ff4800',
    checkedBorderColor: '#a5acb2'
  },
  button: {
    types: {
      primary: {
        textColor: '#fff',
        loaderColor: '#fff',
        disabledTextColor: '#fff',
        defaultBg: '#ff4800',
        defaultBorder: 'transparent',
        hoverBorder: 'rgba(255, 76, 7, 0.68)',
        hoverBg: '#ff4800',
        activeBorder: 'rgba(255, 76, 7, 0.68)',
        activeBg: '#ff4800',
        focusBorder: 'rgba(255, 76, 7, 0.68)',
        focusBg: '#ff4800',
        loadingBorder: 'rgba(255, 76, 7, 0.68)',
        disabledBorder: '#a5acb2',
        disabledBg: '#a5acb2',
        focusOffset: 0,
        opacity: 0.7,
        borderRadius: 2
      },
      secondary: {
        textColor: '#ff4800',
        activeTextColor: '#ff4800',
        loaderColor: '#ff4800',
        disabledTextColor: '#fff',
        defaultBg: 'rgba(255, 72, 0, 0.2)',
        defaultBorder: 'transparent',
        hoverBorder: 'transparent',
        hoverBg: 'rgba(255, 72, 0, 0.3)',
        activeBorder: 'transparent',
        activeBg: 'rgba(255, 72, 0, 0.4)',
        focusBorder: 'rgba(255, 72, 0, 0.4)',
        focusBg: 'rgba(255, 72, 0, 0.3)',
        loadingBorder: 'rgba(255, 72, 0, 0.3)',
        loadingDot: '#ff4800',
        disabledBorder: '#a5acb2',
        disabledBg: '#a5acb2',
        focusOffset: 0,
        borderRadius: 2
      },
      outline: {
        textColor: '#ff4800',
        activeTextColor: 'rgba(255, 72, 0, .3)',
        loaderColor: '#ff4800',
        disabledTextColor: 'rgba(38, 38, 38, .4)',
        defaultBg: '#fff',
        defaultBorder: '#ccc',
        hoverBorder: '#262626',
        hoverBg: '#fff',
        activeBorder: '#fff',
        activeBg: '#fff',
        focusBorder: 'rgba(255, 72, 0, .3)',
        focusBg: '#fff',
        loadingBorder: '#ccc',
        loadingDot: '#ff4800',
        disabledBorder: '#eee',
        disabledBg: '#eee',
        focusOffset: 0,
        borderRadius: 2
      }
    },
    buttonMixin: styleButtonChampMixin
  },
  field: {
    border: 0,
    borderBottom: '1px solid #d5d5d5',
    focusBorderBottom: '1px solid #000',
    successBorderBottom: '1px solid #28bc00',
    errorBorderBottom: '1px solid #ff564e',
    warningBorderBottom: '1px solid #f4c914',
    filledBorderBottom: '1px solid #000',
    withIconPadding: 30,
    withIconsPadding: 60,
    color: '#bebebe',
    activeIconColor: '#ff4800',
    filledIconColor: '#ff4800',
    fontSize: 14,
    iconMargin: 0
  },
  input: {
    padding: '0 5px 1px 5px',
    focusPaddingBottom: 1,
    height: 36,
    opacity: 0.7,
    eyeMargin: 3
  }
}
