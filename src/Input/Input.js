/**
 * Компонент Input
 */
import React, { Component, createElement, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { injectSheet } from '../theme'
import { isolateMixin, placeholderMixin, ifMobile } from '../utils/mixins'
import Tooltip from '../Tooltip'
import Eye from '../icons/forms/Eye'
import ClosedEyeIcon from '../icons/forms/ClosedEyeIcon'

const activeBorder = borderColor => ({
  borderColor,
  transform: 'none'
})

@injectSheet(theme => ({
  input: {
    extend: isolateMixin,
    fontFamily: theme.field.fontFamily,
    boxSizing: 'border-box',
    display: 'block',
    padding: 0,
    outline: 0,
    width: '100%',
    fontStyle: theme.field.fontStyle,
    fontWeight: theme.field.fontWeight,
    letterSpacing: theme.field.letterSpacing,
    appearance: 'none',
    lineHeight: 'normal',
    background: theme.field.colors.default.background,
    boxShadow: 'none',
    border: '0 solid',
    borderColor: theme.field.colors.default.outline,
    transition: `all ${theme.field.animationDuration}ms ease`,
    ...ifMobile({
      fontWeight: theme.field.mobile.fontWeight,
      letterSpacing: theme.field.mobile.letterSpacing
    }),
    'textarea&&': {
      resize: 'vertical',
      height: '100%',
      paddingTop: theme.input.sizes.medium.padding,
      paddingBottom: theme.input.sizes.medium.padding
    },
    '&::-ms-reveal, &::-ms-clear': {
      display: 'none'
    },
    '&:enabled:hover': {borderColor: theme.field.colors.hover.outline},
    '&:disabled': {
      background: theme.field.colors.disabled.background,
      color: theme.field.colors.disabled.text,
      cursor: 'not-allowed',
      borderColor: theme.field.colors.disabled.outline
    },
    '&$filled[type="password"]': {
      fontFamily: 'monospace'
    },
    // ...placeholderMixin('$inGroup &', {
    //   color: theme.field.colors.default.text
    // }),
    ...placeholderMixin('&', {
      color: theme.field.colors.default.placeholder,
      opacity: 1,
      transition: `opacity ${Math.round(theme.field.animationDuration * 0.7)}ms linear`
    }),
    ...placeholderMixin('&:disabled', {
      color: theme.field.colors.disabled.placeholder,
      opacity: 1
    }),
    ...placeholderMixin('&:focus', {
      opacity: 0.54
    }),
    ...placeholderMixin('$isEnabled$isFocused &', {
      opacity: 0.54
    })
  },
  withStatusLine: {
    '& $activeBorder': {
      borderWidth: '0 0 2px',
      transform: 'scaleX(0.6) scaleY(0)',
      transformOrigin: 'center bottom'
    },
    '& $input': {
      paddingBottom: 1
    }
  },
  withOutline: {
    '& $input': {
      borderRadius: theme.field.borderRadius,
      borderWidth: 1
    }
  },
  regular: {
    composes: ['$withOutline'],
    '& $activeBorder': {
      borderRadius: theme.field.borderRadius,
      borderWidth: 1
    }
  },
  awesome: {
    composes: ['$withOutline', '$withStatusLine'],
    '& $activeBorder': {
      borderRadius: theme.field.borderRadius
    }
  },
  promo: {
    composes: ['$withStatusLine'],
    '& $input': {
      paddingTop: 1,
      borderBottomWidth: 1
    },
    '& $input, & $input:disabled': {
      background: 'none'
    }
  },
  ...['medium', 'small'].reduce((result, size) => ({
    ...result,
    [size]: {
      '& $input': {
        fontSize: theme.field.sizes[size].fontSize,
        ...ifMobile({
          fontSize: theme.field.mobile.sizes[size].fontSize
        })
      },
      '& input$input': {
        height: theme.field.sizes[size].height,
        lineHeight: 'normal'
      },
      '& $icon': {
        height: theme.field.sizes[size].icon,
        width: theme.field.sizes[size].icon,
        lineHeight: theme.field.sizes[size].icon + 'px'
      },
      '& $eye': {
        height: theme.field.sizes[size].eyeIcon,
        width: theme.field.sizes[size].eyeIcon,
        lineHeight: theme.field.sizes[size].eyeIcon + 'px'
      },
      '& $eyeWrapper': {
        '&:after': {
          display: 'block',
          content: '" "',
          position: 'absolute',
          top: -Math.floor((theme.field.sizes[size].height - theme.field.sizes[size].eyeIcon) / 2),
          bottom: -Math.floor((theme.field.sizes[size].height - theme.field.sizes[size].eyeIcon) / 2),
          left: -10,
          right: -10
        }
      },
      '&$withOutline $input': {
        paddingLeft: theme.input.sizes[size].padding,
        paddingRight: theme.input.sizes[size].padding
      },
      '&$withLeftIcon$regular $input': {
        paddingLeft: theme.field.sizes[size].withIconPadding - 1
      },
      '&$withLeftIcon$awesome $input': {
        paddingLeft: theme.field.sizes[size].withIconPadding
      },
      '&$withLeftIcon$promo $input': {
        paddingLeft: theme.field.sizes[size].withIconPadding - theme.input.sizes[size].padding
      },
      '&$withRightIcon$regular $input, &$withEye$regular $input': {
        paddingRight: theme.field.sizes[size].withIconPadding - 1
      },
      '&$withEye$withRightIcon$regular $input': {
        paddingRight: theme.field.sizes[size].withIconsPadding - 1
      },
      '&$withRightIcon$awesome $input, &$withEye$awesome $input': {
        paddingRight: theme.field.sizes[size].withIconPadding
      },
      '&$withEye$withRightIcon$awesome $input': {
        paddingRight: theme.field.sizes[size].withIconsPadding
      },
      '&$withRightIcon$promo $input, &$withEye$promo $input': {
        paddingRight: theme.field.sizes[size].withIconPadding - theme.input.sizes[size].padding
      },
      '&$withEye$withRightIcon$promo $input': {
        paddingRight: theme.field.sizes[size].withIconsPadding - theme.input.sizes[size].padding
      },
      '&$withEye$regular $iconRight, &$withEye$awesome $iconRight': {
        right: theme.field.sizes[size].withIconPadding
      },
      '&$withEye$promo $iconRight': {
        right: theme.field.sizes[size].withIconPadding - theme.input.sizes[size].padding
      },
      '&$regular $iconLeft, &$awesome $iconLeft': {
        left: theme.field.sizes[size].iconMargin
      },
      '&$promo $iconLeft': {
        left: 0
      },
      '&$regular $iconRight, &$awesome $iconRight': {
        right: theme.field.sizes[size].iconMargin
      },
      '&$promo $iconRight': {
        right: 0
      },
      '&$inGroup$regular, &$inGroup$awesome': {
        '&:not($startPosition)': {
          '& $input, & $activeBorder': {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }
        },
        '&:not($endPosition)': {
          '& $input, & $activeBorder': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }
        }
      },
      '&$inGroup$promo': {
        '&:not($startPosition)': {
          '&$withLeftIcon $input': {
            paddingLeft: theme.field.sizes[size].withIconPadding
          },
          '& $iconLeft': {
            left: theme.field.sizes[size].iconMargin
          }
        },
        '&:not($endPosition)': {
          '&$withRightIcon $input, &$withEye $input': {
            paddingRight: theme.field.sizes[size].withIconPadding
          },
          '&$withEye$withRightIcon $input': {
            paddingRight: theme.field.sizes[size].withIconsPadding - 1
          },
          '&$withEye $iconRight': {
            right: theme.field.sizes[size].withIconPadding
          },
          '& $iconRight': {
            right: theme.field.sizes[size].iconMargin
          }
        }
      }
    }
  }), {}),
  root: {
    extend: isolateMixin,
    position: 'relative',
    boxSizing: 'border-box',
    fontFamily: theme.fontFamily
  },
  activeBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    transition: `all ${Math.round(theme.field.animationDuration * 0.7)}ms linear`,
    border: '0 solid transparent',
    '$input:focus + &, $isEnabled$isFocused &': activeBorder(theme.field.colors.focus.border),
    '$success$isEnabled &': activeBorder(theme.colors.success),
    '$error$isEnabled &': activeBorder(theme.colors.danger),
    '$warning$isEnabled &': activeBorder(theme.colors.warn)
  },
  icon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    margin: 'auto',
    fontSize: 0,
    color: theme.field.icon.colors.default
  },
  eye: {
    composes: '$icon',
    pointerEvents: 'auto',
    border: 0,
    outline: 0,
    cursor: 'pointer',
    '&:hover': {
      color: theme.field.icon.colors.active
    },
    '$regular &, $awesome &': {
      right: theme.input.eyeMargin
    },
    '$promo &': {
      right: 0
    }
  },
  withLeftIcon: {},
  withRightIcon: {},
  withEye: {},
  iconLeft: {
    composes: '$icon',
    pointerEvents: 'none'
  },
  iconRight: {
    composes: '$icon'
  },
  isFocused: {},
  filled: {},
  isDisabled: {},
  isEnabled: {},
  inGroup: {},
  success: {},
  error: {},
  warning: {},
  eyeWrapper: {},
  endPosition: {},
  startPosition: {},
  middlePosition: {}
}), {name: 'Input'})
export default class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: this.props.type
    }
  }

  static propTypes = {
    /**
    *  Значение введённое в поле, возвращается в callback onChange.
    *  Можно задать дефолтное значение.
    */
    value: PropTypes.any.isRequired,
    /**
    *  Значение placeholder для input
    */
    placeholder: PropTypes.string,
    /**
    * Задизэйблить input true или false
    */
    disabled: PropTypes.bool,
    /**
    * Тип поля (на данный момент, cо временем добавим другие типы полей).
    */
    type: PropTypes.oneOf([
      'email',
      'number',
      'password',
      'tel',
      'text',
      'url'
    ]),
    /**
     * Размер инпута
     */
    size: PropTypes.oneOf(['small', 'medium']),
    /**
     * Разновидность инпута
     */
    variation: PropTypes.oneOf(['regular', 'awesome', 'promo']),
    /**
     * Имя элемента
     */
    name: PropTypes.string,
    /**
     * Валидация input'a
     */
    status: PropTypes.oneOf(['error', 'warning', 'success', null]),
    /**
     * Подсветка импута, как в состоянии `:focus`
     */
    isFocused: PropTypes.bool,
    /**
     * Класс контейнера
     */
    className: PropTypes.string,
    /**
     * Класс элемента input
     */
    inputClassName: PropTypes.string,
    /**
     * По умолчанию элемент input растягивается на всю ширину родительского контейнера.
     * Т.е. задавать ширину через родительский контейнер - объект style.
     * Сюда не стоит передавать какое-либо значение.
     */
    fullWidth: PropTypes.any,
    /**
     * Переопределение стандартных стилей input
     */
    inputStyle: PropTypes.object,
    /**
    * Переопределение стилей контейнера для input
    */
    style: PropTypes.object,
    /**
    * Callback onChange возвращает event и event.target.value
    */
    onChange: PropTypes.func.isRequired,
    /**
     * Callback onBlur
     */
    onBlur: PropTypes.func,
    /**
     * Callback onFocus
     */
    onFocus: PropTypes.func,
    /**
     * Callback onKeyUp
     */
    onKeyUp: PropTypes.func,
    /**
     * Callback onKeyDown
     */
    onKeyDown: PropTypes.func,
    /**
     *  icon слева
     */
    iconLeft: PropTypes.node,
    /**
     *  icon справа
     */
    iconRight: PropTypes.node,
    /**
     * Текст подсказки для кнопки смены статуса типа password, ожидается `String`
     * или функция возвращающая `String`: currentType => 'Показать пароль'
     */
    passwordIconTooltip: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    /**
     * Позиция инпута в группе
     */
    groupPosition: PropTypes.oneOf(['start', 'middle', 'end', null]),
    /**
     * Дополнительный класс правой иконки
     */
    iconRightClassName: PropTypes.string,
    /**
     * Дополнительный класс левой иконки
     */
    iconLeftClassName: PropTypes.string
  };

  static defaultProps = {
    status: null,
    size: 'medium',
    variation: 'awesome'
  };

  saveRef = (ref) => {
    this.input = ref
    if (this.props.inputRef)
      this.props.inputRef(ref)
  }

  inputTypeHelper = () => {
    this.input.type = this.state.type === 'password' ? 'text' : 'password'
    this.setState({ type: this.input.type })
  }

  onChangeHelper = (e) => {
    if (this.props.onChange) this.props.onChange(e, e.target.value)
  }

  renderPasswordIcon() {
    const { type } = this.state

    const {
      type: trueType,
      size,
      theme,
      classes,
      passwordIconTooltip
    } = this.props

    if (trueType !== 'password')
      return null

    const Icon = type === 'password' ? ClosedEyeIcon : Eye

    const icon = (
      <span className={classes.eyeWrapper} onClick={this.inputTypeHelper}>
        <Icon
          size={theme.field.sizes[size].eyeIcon}
          className={classes.eyeIcon}
          color="currentColor" />
      </span>
    )

    if (passwordIconTooltip) {
      const content = typeof passwordIconTooltip === 'function'
        ? passwordIconTooltip(type)
        : passwordIconTooltip

      return (
        <Tooltip content={content} className={classes.eye}>
          {icon}
        </Tooltip>
      )
    }

    return (
      <div className={classes.eye}>
        {icon}
      </div>
    )
  }

  renderIcon(Icon, className) {
    const {props} = this
    const {field} = props.theme
    return (
      <div className={className}>
        {cloneElement(Icon, {
          color: props.disabled
            ? field.colors.disabled.text
            : Icon.props.color || 'currentColor',
          size: Icon.props.size || field.sizes[props.size].icon
        })}
      </div>
    )
  }

  render() {
    const {
      tag = 'input',
      className,
      style,
      disabled,
      inputStyle,
      inputClassName,
      iconLeftClassName,
      iconRightClassName,
      name,
      size,
      variation,
      placeholder,
      iconLeft,
      iconRight,
      status,
      isFocused,
      classes,
      value,
      groupPosition,
      theme, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
      passwordIconTooltip, // eslint-disable-line no-unused-vars
      inputRef, // eslint-disable-line no-unused-vars
      ...other
    } = this.props

    const trueType = this.props.type
    const resultClassName = classnames(
      className,
      classes.root,
      classes[variation],
      classes[status],
      isFocused && classes.isFocused,
      disabled ? classes.isDisabled : classes.isEnabled,
      classes[size],
      iconLeft && classes.withLeftIcon,
      iconRight && classes.withRightIcon,
      trueType === 'password' && classes.withEye,
      groupPosition && classes[`${groupPosition}Position`],
      groupPosition && classes.inGroup
    )


    const inputElement = createElement(tag, {
      name,
      value,
      disabled,
      ref: this.saveRef,
      className: classnames(classes.input, inputClassName, value !== '' && value != null && classes.filled),
      style: inputStyle,
      onChange: this.onChangeHelper,
      tabIndex: 0,
      placeholder,
      ...other
    })

    return (
      <div style={style} className={resultClassName}>
        {iconLeft && this.renderIcon(iconLeft, classnames(iconLeftClassName, classes.iconLeft))}
        {inputElement}
        <div className={classes.activeBorder} />
        {iconRight && this.renderIcon(iconRight, classnames(iconRightClassName, classes.iconRight))}
        {this.renderPasswordIcon()}
      </div>
    )
  }
}
