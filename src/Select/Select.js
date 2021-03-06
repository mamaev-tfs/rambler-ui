import React, { PureComponent, createElement, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Menu from '../Menu/Menu'
import Input from '../Input'
import { TagsInput, TagsInputItem } from '../TagsInput'
import Dropdown from '../Dropdown'
import OnClickOutside from '../OnClickOutside'
import { TAB, UP, DOWN, ESCAPE, BACKSPACE, DELETE, ENTER } from '../constants/keys'
import { injectSheet } from '../theme'
import { isolateMixin, placeholderMixin } from '../utils/mixins'
import { ios, android } from '../utils/browser'
import ClearIconSmall from './ClearIconSmall'

const isNativeSelectAllowed = ios || android

const emptyArr = []
const noop = () => {}

const absolutePosition = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
}

/* Prevent strange behaviour of onChange event in multiple select */
/* http://stackoverflow.com/questions/34660500/mobile-safari-multi-select-bug */
const multipleSelectFix = <optgroup disabled hidden />

@injectSheet(theme => ({
  root: {
    extend: isolateMixin,
    position: 'relative',
    '&:hover, &$isFocused': {
      '& $arrow': {
        color: theme.field.colors.focus.arrow
      }
    },
    '&$isDisabled': {
      cursor: 'not-allowed',
      '& $input': {
        pointerEvents: 'none'
      },
      '& $arrow': {
        color: theme.field.colors.disabled.arrow + '!important',
        pointerEvents: 'none'
      }
    },
    ...placeholderMixin('&$isReadonly:not($lightPlaceholder):not($isDisabled) $input input', {
      opacity: 1,
      color: theme.field.colors.default.text
    }),
    ...placeholderMixin('&:not($isFocused):not($lightPlaceholder):not($isDisabled) $input input', {
      opacity: 1,
      color: theme.field.colors.default.text
    })
  },
  dropdownContainer: {
    '&&': {
      display: 'block'
    },
    '$isMultipleWithoutSearch &': {
      extend: absolutePosition,
      bottom: null
    }
  },
  icon: {
    '$isMultipleWithoutSearch &': {
      top: 'auto',
      bottom: 'auto',
      margin: 0,
      transform: 'translateY(-50%)'
    }
  },
  arrow: {
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: 0,
    color: theme.field.colors.default.arrow,
    '&:empty': {
      '&:after': {
        height: 8,
        width: 8,
        position: 'absolute',
        borderStyle: 'solid',
        borderWidth: '0 0 1px 1px',
        content: '""',
        pointerEvents: 'none',
        transform: 'rotate(-45deg) translateY(50%)'
      }
    },
    '& svg': {
      extend: absolutePosition,
      margin: 'auto',
      maxWidth: '100%',
      maxHeight: '100%'
    }
  },
  input: {
    '$withCustom &': absolutePosition
  },
  field: {
    '$isReadonly &': {
      cursor: 'pointer',
      userSelect: 'none'
    },
    '$withSearch &': {
      cursor: 'text'
    },
    '$withCustom &&': {
      extend: absolutePosition,
      height: '100%'
    }
  },
  withCustom: {
    position: 'relative'
  },
  custom: {
    position: 'relative',
    pointerEvents: 'none'
  },
  options: {
    composes: '$custom'
  },
  dropdown: {
    '&&': {
      boxShadow: 'none',
      border: `1px solid ${theme.field.colors.default.outline}`,
      borderBottom: 0,
      '&$isMultipleDropdown': {
        transitionProperty: 'opacity',
        top: '0 !important'
      }
    }
  },
  selected: {
    borderBottom: `1px solid ${theme.field.colors.default.outline}`,
    cursor: 'default'
  },
  menu: {
    borderBottom: `1px solid ${theme.field.colors.default.outline}`,
    '$medium &': {
      maxHeight: theme.menu.sizes.medium.height * 4 + 2
    },
    '$small &': {
      maxHeight: theme.menu.sizes.small.height * 4 + 2
    }
  },
  clear: {
    flex: 'none',
    alignSelf: 'center',
    color: theme.field.icon.colors.default,
    fill: 'currentColor',
    marginTop: 1,
    marginLeft: 1,
    cursor: 'pointer',
    pointerEvents: 'auto',
    '&:hover , &:active': {
      color: theme.field.icon.colors.active
    }
  },
  ...['medium', 'small'].reduce((result, size) => ({
    ...result,
    [size]: {
      '&$isMultipleWithoutSearch': {
        height: theme.field.sizes[size].height
      },
      '&$isMultipleWithoutSearch $icon': {
        top: theme.field.sizes[size].height / 2
      },
      '& $withCustom': {
        minHeight: theme.field.sizes[size].height
      },
      '& $arrow': {
        '&:before': {
          display: 'block',
          content: '" "',
          position: 'absolute',
          top: -Math.floor((theme.field.sizes[size].height - theme.field.sizes[size].icon) / 2),
          bottom: -Math.floor((theme.field.sizes[size].height - theme.field.sizes[size].icon) / 2),
          left: -10,
          right: -10
        },
        '&:empty:after': {
          top: size === 'small' ? -2 : -1,
          left:  size === 'small' ? 1 : 1
        }
      },
      '&$isOpened $arrow:empty:after': {
        transform: 'rotate(45deg) translateY(-50%) scaleY(-1)',
        top: size === 'small' ? 9 : 9,
        left:  size === 'small' ? 1 : 1
      },
      '& $custom': {
        paddingRight: theme.input.sizes[size].padding + 1,
        paddingLeft: theme.input.sizes[size].padding + 1
      },
      '&$withLeftIcon $custom': {
        paddingLeft: theme.field.sizes[size].withIconPadding + 1
      },
      '&$withRightIcon $custom': {
        paddingRight: theme.field.sizes[size].withIconPadding + 1
      },
      '& $options': {
        paddingTop: (theme.field.sizes[size].height - theme.tagsInput.height) / 2,
        paddingBottom:  (theme.field.sizes[size].height - theme.tagsInput.height) / 2
      },
      '& $selected': {
        padding: `${(theme.field.sizes[size].height - theme.tagsInput.height) / 2 - 1}px ${theme.input.sizes[size].padding - 1}px`
      }
    }
  }), {}),
  isNative: {
    '& $icon': {
      pointerEvents: 'none'
    }
  },
  nativeSelect: {
    extend: [
      isolateMixin,
      absolutePosition
    ],
    width: '100%',
    height: '100%',
    opacity: 0,
    overflow: 'hidden',
    outline: 0
  },
  isFocused: {},
  isOpened: {},
  isReadonly: {},
  isDisabled: {},
  isMultipleWithoutSearch: {},
  isMultipleDropdown: {},
  withSearch: {},
  withLeftIcon: {},
  withRightIcon: {},
  lightPlaceholder: {}
}), {name: 'Select'})
export default class Select extends PureComponent {

  static propTypes = {
    /**
     * Дополнительный CSS-класс поля
     */
    className: PropTypes.string,
    /**
     * Inline-стили поля
     */
    style: PropTypes.object,
    /**
     * Дополнительный CSS-класс `<Dropdown />`
     */
    dropdownClassName: PropTypes.string,
    /**
     * Inline-стили `<Dropdown />`
     */
    dropdownStyle: PropTypes.object,
    /**
     * Дополнительный CSS-класс `<Menu />`
     */
    menuClassName: PropTypes.string,
    /**
     * Inline-стили `<Menu />`
     */
    menuStyle: PropTypes.object,
    /**
     * Множественный выбор
     */
    multiple: PropTypes.bool,
    /**
     * Показывать кнопку очистки инпута
     */
    clearIcon: PropTypes.bool,
    /**
     * Дополнительный CSS-класс кнопки со стрелкой
     */
    arrowClassName: PropTypes.string,
    /**
     * Inline-стили кнопки со стрелкой
     */
    arrowStyle: PropTypes.object,
    /**
     * Выбранное значение, по-умолчанию считается, что это примитив. В случае множественного выбора - массив выбранных значений.
     */
    value: PropTypes.any,
    /**
     * Проверка равенства значений, задается, если
     * значением является объект. Ожидается, что возвращает `Boolean`
     */
    valuesEquality: PropTypes.func,
    /**
     * Функция рендера выбранного значения в поле, задается, если
     * значением является объект. Ожидается, что возвращает `String`
     */
    inputValueRenderer: PropTypes.func,
    /**
     * Плэйсхолдер
     */
    placeholder: PropTypes.string,
    /**
     * Светлый плейсхолдер, как в компоненте `<Input />`
     */
    lightPlaceholderColor: PropTypes.bool,
    /**
     * Доступность элемента
     */
    disabled: PropTypes.bool,
    /**
     * Опции поля, массив элементов
     */
    children: PropTypes.arrayOf(PropTypes.element),
    /**
     * Иконка
     */
    icon: PropTypes.node,
    /**
     * Иконка стрелки
     */
    arrowIcon: PropTypes.node,
    /**
     * Размер
     */
    size: PropTypes.oneOf(['small', 'medium']),
    /**
     * Разновидность инпута
     */
    variation: PropTypes.oneOf(['regular', 'awesome', 'promo']),
    /**
    * Статусы валидации
    */
    status: PropTypes.oneOf([
      'error',
      'warning',
      'success',
      'filled',
      null
    ]),
    /**
     * Вставлять ли dropdown внутри body
     */
    appendToBody: PropTypes.bool,
    /**
     * Коллбек вызывающийся при фокусе
     */
    onFocus: PropTypes.func,
    /**
     * Коллбек вызывающийся при блюре
     */
    onBlur: PropTypes.func,
    /**
     * Коллбек вызывающийся при изменении состояния
     */
    onChange: PropTypes.func,
    /**
     * Коллбек вызывающийся при изменении поискового запроса
     */
    onSearch: PropTypes.func,
    /**
     * Функция рендера кастомного элемента над input, получает `value` в качестве значения.
     * Должна возвращать `reactElement`.
     */
    customElementRenderer: PropTypes.func,
    /**
     * Дополнительный CSS-класс корневого контейнера
     */
    rootClassName: PropTypes.string,
    /**
     * Inline-стили корневого контейнера
     */
    rootStyle: PropTypes.object,
    /**
     * Дополнительный CSS-класс контейнера кастомного элемента и `<Input>`
     */
    containerClassName: PropTypes.string,
    /**
     * Inline-стили контейнера кастомного элемента и `<Input>`
     */
    containerStyle: PropTypes.object,
    /**
     * Позволяет вводить произвольное значение в поле, ожидается, что `value` типа `String`
     */
    inputMode: PropTypes.bool,
    /**
     * Применить логику выбора опций нативного select'a на мобильных устройствах.
     * При использовании `onSearch` - не применяется.
     * `<MenuItem>` в качестве `children` должен принимать элемент типа `String`
     */
    native: PropTypes.bool
  }

  static defaultProps = {
    value: null,
    multiple: false,
    clearIcon: false,
    status: null,
    size: 'medium',
    variation: 'awesome',
    disabled: false,
    appendToBody: false,
    inputMode: false,
    valuesEquality: (a, b) => a === b,
    inputValueRenderer: value => value,
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {}
  }

  state = {
    isOpened: false,
    inputFocused: false,
    searchText: '',
    value: this.initialValue
  }

  get initialValue() {
    const {multiple, value} = this.props
    return multiple
      ? Array.isArray(value) ? value : emptyArr
      : value || undefined
  }

  get showArrow() {
    const {children, clearIcon} = this.props
    return children && children.length > 0 && !clearIcon
  }

  get showClearIcon() {
    const {multiple, clearIcon} = this.props
    return !multiple && clearIcon && !this.isValueEmpty(this.state.value)
  }

  componentWillReceiveProps({ value }) {
    this.setValue(value)
  }

  handleDropdownClose = () => {
    if (this.state.isOpened || this.props.inputMode) return
    this.setSearchText('')
  }

  setValue(value) {
    const {valuesEquality, multiple} = this.props
    const oldValue = this.state.value
    if (multiple) {
      const currValue = Array.isArray(oldValue) ? oldValue : emptyArr
      const nextValue = Array.isArray(value) ? value : emptyArr
      if (nextValue.length === currValue.length && nextValue.every((item, index) => valuesEquality(item, currValue[index])))
        return
    } else if (valuesEquality(value, oldValue)) {
      return
    }
    this.setState({
      value
    })
  }

  setSearchText(searchText) {
    if (this.state.searchText === searchText) return
    this.setState({
      searchText
    })
    if (this.props.onSearch)
      this.props.onSearch(searchText)
  }

  requestItems = event => {
    this.setState({
      isOpened: true
    })
    this.setSearchText(event.target.value)
  }

  changeValue = value => {
    const {multiple, inputMode, onChange} = this.props
    if (!multiple)
      this.setState({isOpened: false})
    if (inputMode)
      this.setSearchText(value || '')
    this.setValue(value)
    onChange(value)
    if (!inputMode && !multiple)
      this.input.focus()
  }

  focusInput = event => {
    this.setState({
      inputFocused: true
    })
    if (!this.state.isOpened)
      this.props.onFocus(event)
  }

  blurInput = event => {
    if (!this.state.inputFocused)
      return
    const {inputMode, onBlur} = this.props
    this.setState({
      isOpened: false,
      inputFocused: false
    })
    if (inputMode)
      this.changeValue(this.state.searchText)
    onBlur(event)
  }

  preventBlurInput = event => {
    event.preventDefault()
  }

  preventSelect = event => {
    event.preventDefault()
    event.stopPropagation()
  }

  open = () => {
    if (this.props.disabled || this.state.isOpened) return
    this.setState({isOpened: true})
    setTimeout(() => {
      this.input.focus()
    }, 0)
  }

  close = () => {
    if (!this.state.isOpened) return
    this.setState({isOpened: false})
  }

  openOnArrowClick = () => {
    const {isOpened} = this.state
    if (isOpened)
      this.close()
    else
      this.open()
  }

  openOnArrowKey(event) {
    event.preventDefault()

    if (!this.state.isOpened)
      this.setState({
        isOpened: true
      })

    setTimeout(() => {
      this.setState({
        inputFocused: false
      })
    }, 0)
  }

  onClear = () => {
    this.setSearchText('')
    this.changeValue(null)
  }

  clearValueOnBackspace() {
    const {searchText, inputFocused} = this.state
    if (this.props.onSearch && inputFocused && searchText === '')
      this.changeValue(null)
  }

  closeOnEsc = event => {
    if (!this.state.isOpened)
      return
    event.stopPropagation()
    this.setState({
      isOpened: false
    })
    this.input.focus()
  }

  saveInputRef = ref => {
    this.input = ref
  }

  closeOnClickOutside = event => {
    const {isOpened, inputFocused} = this.state
    if (!isOpened || inputFocused)
      return
    this.setState({
      isOpened: false,
      inputFocused: false
    })
    this.props.onBlur(event)
  }

  keyDown = event => {
    const code = event.keyCode
    const {inputMode, multiple, customElementRenderer} = this.props
    if (code === ESCAPE)
      this.closeOnEsc(event)
    else if (code === TAB)
      this.setState({
        isOpened: false
      })
    else if (code === UP || code === DOWN)
      this.openOnArrowKey(event)
    else if (inputMode && code === ENTER)
      this.changeValue(this.state.searchText)
    else if (!multiple && !customElementRenderer && (code === DELETE || code === BACKSPACE))
      this.clearValueOnBackspace(event)
  }

  isValueEmpty(value) {
    return value == null || value === ''
  }

  getInputProps() {
    const {
      /* eslint-disable no-unused-vars */
      className,
      style,
      placeholder,
      icon,
      onSearch,
      dropdownClassName,
      dropdownStyle,
      menuClassName,
      menuStyle,
      valuesEquality,
      children,
      value,
      appendToBody,
      classes,
      onFocus,
      onBlur,
      onChange,
      inputValueRenderer,
      customElementRenderer,
      multiple,
      theme,
      arrowClassName,
      arrowStyle,
      arrowIcon,
      containerStyle,
      containerClassName,
      rootStyle,
      rootClassName,
      native,
      clearIcon,
      inputMode,
      lightPlaceholderColor,
      /* eslint-enable no-unused-vars */
      ...props
    } = this.props
    return props
  }

  Arrow = props => {
    const {arrowStyle, arrowClassName, arrowIcon, classes} = this.props
    const {
      className,
      size, // eslint-disable-line no-unused-vars
      color, // eslint-disable-line no-unused-vars
      ...otherProps
    } = props
    return (
      <div
        style={arrowStyle}
        className={classnames(className, classes.arrow, arrowClassName)}
        {...otherProps}
      >
        {arrowIcon}
      </div>
    )
  }

  Clear = () => (
    <ClearIconSmall
      className={this.props.classes.clear}
      size={15}
      color="currentColor"
      onMouseDown={this.preventBlurInput}
      onClick={this.onClear}
    />
  )

  renderSelectedItems() {
    const selected = Array.isArray(this.props.value) ? this.props.value : emptyArr
    return selected.map(item => {
      const text = this.props.inputValueRenderer(item)
      return (
        <TagsInputItem value={item} key={text}>
          {text}
        </TagsInputItem>
      )
    })
  }

  renderInput() {
    const {
      value,
      searchText,
      isOpened,
      inputFocused
    } = this.state

    const {
      className,
      style,
      classes,
      placeholder,
      icon,
      onSearch,
      multiple,
      inputValueRenderer,
      customElementRenderer,
      inputMode
    } = this.props

    const focusedInput = inputFocused || isOpened

    if (inputMode && value != null && typeof value !== 'string')
      throw new Error('In `inputMode` value of <Select /> should be a string')

    let resultInputValue = ''
    if ((onSearch || inputMode) && focusedInput && isOpened) {
      resultInputValue = searchText
    } else if (!multiple && !customElementRenderer) {
      const inputValue = inputValueRenderer(value)
      resultInputValue = this.isValueEmpty(inputValue) ? '' : inputValue
    }

    let resultPlaceholder = ''
    if (customElementRenderer) {
      if (this.isValueEmpty(value) || (isOpened && !!onSearch)) resultPlaceholder = placeholder
    } else if (multiple) {
      const withValue = Array.isArray(value) && value.length > 0
      if ((isOpened && onSearch) || !withValue) resultPlaceholder = placeholder
    } else {
      const inputValue = inputValueRenderer(value)
      resultPlaceholder = (this.isValueEmpty(inputValue) || (inputMode && searchText === ''))
        ? placeholder
        : (onSearch && !inputMode && focusedInput && searchText === '' ? inputValue : '')
    }

    const canBeModified = (inputMode || !!onSearch) && (
      (!customElementRenderer && !multiple) ||
      (customElementRenderer && (isOpened || this.isValueEmpty(value))) ||
      (multiple && (isOpened || !Array.isArray(value) || value.length === 0))
    )

    const rightIcon = this.showClearIcon
      ? createElement(this.Clear)
      : this.showArrow && createElement(this.Arrow, {
        role: 'button',
        onMouseDown: this.preventBlurInput,
        onClick: this.openOnArrowClick
      })

    return (
      <Input
        {...this.getInputProps()}
        inputStyle={style}
        className={classes.input}
        iconLeft={icon}
        iconRight={rightIcon}
        iconRightClassName={classes.icon}
        onKeyDown={this.keyDown}
        onClick={this.open}
        onFocus={this.focusInput}
        onBlur={this.blurInput}
        onTouchStart={onSearch ? undefined : this.open}
        onTouchEnd={onSearch ? undefined : this.preventSelect}
        inputClassName={classnames(className, classes.field)}
        placeholder={resultPlaceholder}
        readOnly={!canBeModified}
        value={resultInputValue}
        onChange={this.requestItems}
        inputRef={this.saveInputRef}
      />
    )
  }

  renderSelect() {
    const {
      value,
      inputFocused,
      isOpened
    } = this.state

    const {
      dropdownStyle,
      dropdownClassName,
      containerStyle,
      containerClassName,
      rootStyle,
      rootClassName,
      customElementRenderer,
      menuStyle,
      menuClassName,
      valuesEquality,
      onSearch,
      inputMode,
      children,
      appendToBody,
      multiple,
      disabled,
      size,
      icon,
      classes,
      lightPlaceholderColor
    } = this.props

    const focusedInput = inputFocused || isOpened
    const multipleWithValue = multiple && Array.isArray(value) && value.length > 0
    const options = multipleWithValue ? this.renderSelectedItems() : null
    const canBeModified = !!onSearch || inputMode

    const resultClassName = classnames(
      rootClassName,
      classes.root,
      !disabled && !canBeModified && classes.isReadonly,
      !disabled && canBeModified && classes.withSearch,
      icon && classes.withLeftIcon,
      this.showArrow && classes.withRightIcon,
      size && classes[size],
      disabled && classes.isDisabled,
      isOpened && classes.isOpened,
      focusedInput && classes.isFocused,
      lightPlaceholderColor && classes.lightPlaceholder,
      multiple && !onSearch && classes.isMultipleWithoutSearch
    )

    const dropdownResultClassName = classnames(
      dropdownClassName,
      classes.dropdown,
      multiple && classes.isMultipleDropdown
    )

    let customElement = null
    if (customElementRenderer) {
      if (!this.isValueEmpty(value) && !(isOpened && onSearch))
        customElement = cloneElement(customElementRenderer(value), {
          className: classes.custom
        })

    } else if (multipleWithValue && (!isOpened || !onSearch)) {
      customElement = (
        <TagsInput
          className={classes.options}
          onChange={this.changeValue}
          isExpanded={!isOpened || onSearch ? false : true}
        >
          {options}
        </TagsInput>
      )
    }

    const dropdownAnchor = (
      <div
        className={classnames(containerClassName, (multiple || customElementRenderer) && classes.withCustom)}
        style={containerStyle}
      >
        {this.renderInput()}
        {customElement}
      </div>
    )

    const resultIsOpened = isOpened && (children.length > 0 || (multiple && Array.isArray(value) && value.length > 0))

    return (
      <OnClickOutside handler={this.closeOnClickOutside}>
        <div className={resultClassName} style={rootStyle}>
          <Dropdown
            isOpened={resultIsOpened}
            anchor={dropdownAnchor}
            padding={false}
            style={dropdownStyle}
            className={dropdownResultClassName}
            overlayClassName={classes.dropdownContainer}
            appendToBody={appendToBody}
            anchorFullWidth={true}
            autoPositionY={false}
            anchorPointY="bottom"
            contentPointY="top"
            closeOnClickOutside={false}
            cachePositionOptions={false}
            onClose={this.handleDropdownClose}
          >
            {multipleWithValue && onSearch &&
              <TagsInput
                className={classes.selected}
                onChange={this.changeValue}
                isExpanded={true}
                onMouseDown={this.preventBlurInput}
                size={size}
              >
                {options}
              </TagsInput>
            }
            {children.length > 0 &&
              <Menu
                style={menuStyle}
                className={classnames(menuClassName, classes.menu)}
                autoFocus={resultIsOpened && !inputFocused}
                value={multiple ? Array.isArray(value) ? value : emptyArr : value}
                valuesEquality={valuesEquality}
                onChange={this.changeValue}
                onMouseDown={this.preventBlurInput}
                onEscKeyDown={this.closeOnEsc}
                multiple={multiple}
                size={size}
              >
                {children}
              </Menu>
            }
          </Dropdown>
        </div>
      </OnClickOutside>
    )
  }

  handleNativeSelectChange = ({target}) => {
    const nextValue = this.props.multiple
      ? Array.prototype.map.call(target.selectedOptions, item => this.values[item.value])
      : this.values[target.value]
    this.setValue(nextValue)
    this.props.onChange(nextValue)
  }

  renderNativeSelect() {
    const {
      placeholder,
      disabled,
      multiple,
      children,
      size,
      icon,
      valuesEquality,
      inputValueRenderer,
      className,
      classes,
      rootStyle,
      rootClassName,
      lightPlaceholderColor
    } = this.props

    const {
      value,
      inputFocused
    } = this.state

    let resultValue = multiple ? [] : ''
    this.values = []
    const options = []
    React.Children.forEach(children, (item, index) => {
      const {children} = item.props
      if (item.type.displayName !== 'ruiMenuItem')
        throw new Error('Child component should be instance of <MenuItem />')
      if (typeof children !== 'string')
        throw new Error('Children of <MenuItem /> should be a string')
      options[index] = <option key={children} value={index}>{children}</option>
      this.values[index] = item.props.value
      if (multiple) {
        if (value.some(selectedItem => valuesEquality(selectedItem, item.props.value)))
          resultValue.push(index)
      } else if (valuesEquality(value, item.props.value)) {
        resultValue = index
      }
    })

    const selectedOptions = multiple && Array.isArray(value) && value.length > 0 && this.renderSelectedItems()

    const resultClassName = classnames(
      rootClassName,
      classes.root,
      classes.isNative,
      classes.withRightIcon,
      icon && classes.withLeftIcon,
      size && classes[size],
      disabled && classes.isDisabled,
      inputFocused && classes.isFocused,
      multiple && classes.isMultipleWithoutSearch,
      multiple && classes.withCustom,
      lightPlaceholderColor && classes.lightPlaceholder
    )

    return (
      <div className={resultClassName} style={rootStyle}>
        <Input
          className={classes.input}
          inputClassName={classnames(className, classes.field)}
          disabled={disabled}
          onChange={noop}
          value={multiple ? '' : inputValueRenderer(value) || ''}
          iconLeft={icon}
          iconRight={createElement(this.Arrow)}
          iconRightClassName={classes.icon}
          tabIndex={-1}
          readOnly={true}
          placeholder={selectedOptions ? null : placeholder}
          isFocused={inputFocused}
        />
        {selectedOptions &&
          <TagsInput className={classes.options} size={size}>
            {selectedOptions}
          </TagsInput>
        }
        <select
          {...this.getInputProps()}
          className={classes.nativeSelect}
          multiple={multiple}
          value={resultValue}
          onChange={this.handleNativeSelectChange}
          onBlur={this.blurInput}
          onFocus={this.focusInput}
        >
          {placeholder
            ? <option disabled value="">{placeholder}</option>
            : multiple && multipleSelectFix
          }
          {options}
        </select>
      </div>
    )
  }

  render() {
    return this.props.native && isNativeSelectAllowed && !this.props.onSearch
      ? this.renderNativeSelect()
      : this.renderSelect()
  }
}
