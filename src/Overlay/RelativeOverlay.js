import React, { PureComponent, PropTypes, cloneElement } from 'react'
import { findOverflowedParent } from '../utils/scroll'
import { injectSheet } from '../theme'
import classnames from 'classnames'
import EventEmitter from 'events'

/**
 * Правила переноса контента, если он выходит за пределы видимости
 */
const mappingPoints = {
  right: 'left',
  left: 'right',
  center: 'center',
  bottom: 'top',
  top: 'bottom'
}

/**
 * Не все браузеры содержат width и height
 * Дополняем этими свойствами результат
 */
function boundingRect(element) {
  const rect = element.getBoundingClientRect()
  if (rect.height === undefined)
    rect.height = rect.bottom - rect.top
  if (rect.width === undefined)
    rect.width = rect.left - rect.right
  return rect
}

/**
 * Получить стиль и, если необходимо, новые оффсеты
 * @param  {Object}  params       -
 * @param  {Object}  params.anchorRect    - объект с полями {left, right, top, bottom}
 * @param  {Object}  params.parentRect    - объект с полями {left, right, top, bottom}
 * @param  {Number}  params.contentHeight - высота элемента с контентом
 * @param  {Number}  params.contentWidth  - ширина элемента с контентом
 * @param  {String}  params.anchorPointX  - точка прикрепления
 * @param  {String}  params.anchorPointY  - точка прикрепления
 * @param  {String}  params.contentPointX - точка прикрепления
 * @param  {String}  params.contentPointY - точка прикрепления
 * @param  {Boolean} params.autoPositionX - автопозиционирование по оси X
 * @param  {Boolean} params.autoPositionY - автопозиционирование по оси Y
 * @param  {Boolean} params.noRecalculate - не пересчитывать
 * @return {Object}
 */
function getPositionOptions(params) {

  const {
    anchorRect,
    parentRect,
    contentHeight,
    contentWidth,
    anchorPointX,
    anchorPointY,
    contentPointX,
    contentPointY,
    autoPositionX,
    autoPositionY,
    noRecalculate
  } = params

  let left, right, top, bottom, translateX = '0%', translateY = '0%', overflowX = 0, overflowY = 0
  let newAnchorPointX, newAnchorPointY

  if (contentPointX === 'left') {
    if (anchorPointX === 'left') {
      left = '0%'
      if (autoPositionX)
        overflowX = anchorRect.left + contentWidth - parentRect.right
    } else if (anchorPointX === 'center') {
      left = '50%'
      if (autoPositionX)
        overflowX = anchorRect.left + anchorRect.width / 2 + contentWidth - parentRect.right
    } else if (anchorPointX === 'right') {
      left = '100%'
      if (autoPositionX)
        overflowX = anchorRect.right + contentWidth - parentRect.right
    }
  } else if (contentPointX === 'center') {
    translateX = '-50%'
    if (anchorPointX === 'left') {
      left = '0%'
      if (autoPositionX)
        overflowX = anchorRect.left + contentWidth / 2 - parentRect.right
    } else if (anchorPointX === 'center') {
      left = '50%'
      if (autoPositionX) {
        const overflowXLeft = parentRect.left - (anchorRect.left + anchorRect.width / 2 - contentWidth / 2)
        const overflowXRight = (anchorRect.left + anchorRect.width / 2 + contentWidth / 2) - parentRect.right
        overflowX = Math.max(overflowXRight, overflowXLeft)
        newAnchorPointX = overflowXLeft > overflowXRight ? 'left' : 'right'
      }
    } else if (anchorPointX === 'right') {
      left = '100%'
      if (autoPositionX)
        overflowX = anchorRect.right + contentWidth / 2 - parentRect.right
    }
  } else if (contentPointX === 'right') {
    if (anchorPointX === 'left') {
      right = '100%'
      if (autoPositionX)
        overflowX = parentRect.left - (anchorRect.left - contentWidth)
    } else if (anchorPointX === 'center') {
      right = '50%'
      if (autoPositionX)
        overflowX = parentRect.left - (anchorRect.left - contentWidth + anchorRect.width / 2)
    } else if (anchorPointX === 'right') {
      right = '0%'
      if (autoPositionX)
        overflowX = parentRect.left - (anchorRect.right - contentWidth)
    }
  }

  if (contentPointY === 'top') {
    if (anchorPointY === 'top') {
      top = '0%'
      if (autoPositionY) {
        overflowY = anchorRect.top + contentHeight - parentRect.bottom
        if (overflowY < 0)
          overflowY = anchorRect.top + contentHeight - window.innerHeight
      }
    } else if (anchorPointY === 'center') {
      top = '50%'
      if (autoPositionY) {
        overflowY = anchorRect.top + anchorRect.height / 2 + contentHeight - parentRect.bottom
        if (overflowY < 0)
          overflowY = anchorRect.top + anchorRect.height / 2 + contentHeight - window.innerHeight
      }
    } else if (anchorPointY === 'bottom') {
      top = '100%'
      if (autoPositionY) {
        overflowY = anchorRect.bottom + contentHeight - parentRect.bottom
        if (overflowY < 0)
          overflowY = anchorRect.bottom + contentHeight - window.innerHeight
      }
    }
  } else if (contentPointY === 'center') {
    translateY = '-50%'
    if (anchorPointY === 'top') {
      top = '0%'
      if (autoPositionY) {
        overflowY = parentRect.top - (anchorRect.top - contentHeight / 2)
        if (overflowY < 0)
          overflowY = anchorRect.top - contentHeight / 2
      }
    } else if (anchorPointY === 'center') {
      top = '50%'
      if (autoPositionX) {
        const overflowXTop = parentRect.top - (anchorRect.top + anchorRect.height / 2 - contentHeight / 2)
        const overflowXBottom = (anchorRect.top + anchorRect.height / 2 + contentHeight / 2) - parentRect.bottom
        overflowY = Math.max(overflowXTop, overflowXBottom)
        newAnchorPointY = overflowXTop > overflowXBottom ? 'top' : 'right'
      }
    } else if (anchorPointY === 'bottom') {
      top = '100%'
      if (autoPositionY) {
        overflowY = anchorRect.bottom + contentHeight / 2 - parentRect.bottom
        if (overflowY < 0)
          overflowY = anchorRect.bottom + contentHeight / 2 - window.innerHeight
      }
    }
  } else if (contentPointY === 'bottom') {
    if (anchorPointY === 'top') {
      bottom = '100%'
      if (autoPositionY) {
        overflowY = parentRect.top - (anchorRect.top - contentHeight)
        if (overflowY < 0)
          overflowY = contentHeight - anchorRect.top
      }
    } else if (anchorPointY === 'center') {
      bottom = '50%'
      if (autoPositionY) {
        overflowY = parentRect.top - (anchorRect.top + anchorRect.height / 2 - contentHeight)
        if (overflowY < 0)
          overflowY = contentHeight - (anchorRect.top + anchorRect.height / 2)
      }
    } else if (anchorPointY === 'bottom') {
      bottom = '0%'
      if (autoPositionY) {
        overflowY = parentRect.top - (anchorRect.bottom - contentHeight)
        if (overflowY < 0)
          overflowY = contentHeight - anchorRect.bottom
      }
    }
  }

  if (!noRecalculate) {
    if (autoPositionX && overflowX > 0) {
      const result = getPositionOptions({
        ...params,
        anchorPointX: newAnchorPointX || mappingPoints[anchorPointX],
        contentPointX: newAnchorPointX || mappingPoints[contentPointX],
        noRecalculate: true
      })
      if (result.overflowX < overflowX) {
        left = result.left
        right = result.right
        translateX = result.translateX
        overflowX = result.overflowX
      }
    }
    if (autoPositionY && overflowY > 0) {
      const result = getPositionOptions({
        ...params,
        anchorPointY: newAnchorPointY || mappingPoints[anchorPointY],
        contentPointY: newAnchorPointY || mappingPoints[contentPointY],
        noRecalculate: true
      })
      if (result.overflowY < overflowY) {
        top = result.top
        bottom = result.bottom
        translateY = result.translateY
        overflowY = result.overflowY
      }
    }
  }

  return {
    left,
    right,
    top,
    bottom,
    translateX,
    translateY,
    contentPointX,
    contentPointY,
    overflowX,
    overflowY
  }
}


function getContentProps(params) {
  const {
    left,
    right,
    top,
    bottom,
    translateX,
    translateY,
    contentPointX,
    contentPointY
  } = getPositionOptions(params)
  return {
    style: {
      left,
      right,
      top,
      bottom,
      transform: `translate(${translateX}, ${translateY})`
    },
    pointX: contentPointX,
    pointY: contentPointY
  }
}


/**
 * Оверлей, который оборачивает внутри children, и позиционируется относительно children рядом с ними
 */
@injectSheet(() => ({
  container: {
    position: 'relative',
    display: 'inline-block'
  },
  content: {
    position: 'absolute',
    zIndex: 1
  }
}))
export default class RelativeOverlay extends PureComponent {

  static propTypes = {
    /**
     * Класс контейнера
     */
    className: PropTypes.string,
    /**
     * Стиль контейнера
     */
    style: PropTypes.object,
    /**
     * Флаг управления показом оверлея
     */
    isShown: PropTypes.bool.isRequired,
    /**
     * Точка прицепления для achor X
     */
    anchorPointX: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
    /**
     * Точка прицепления для achor Y
     */
    anchorPointY: PropTypes.oneOf(['top', 'bottom', 'center']).isRequired,
    /**
     * Точка прицепления для overlay X
     */
    contentPointX: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
    /**
     * Точка прицепления для overlay Y
     */
    contentPointY: PropTypes.oneOf(['top', 'bottom', 'center']).isRequired,
    /**
     * Автоматическое позиционирование, если контент по оси X выходи за пределы scroll-контейнера
     */
    autoPositionX: PropTypes.bool,
    /**
     * Автоматическое позиционирование, если контент по оси Y выходи за пределы scroll-контейнера
     */
    autoPositionY: PropTypes.bool,
    /**
     * Элемент вокруг которого показываем overlay
     */
    anchor: PropTypes.node,
    /**
     * Инстанс компонент контента
     * Получает автоматически на вход следующие props:
     * - isVisible: true/false
     * при изменении это props, content должен показаться, opacity должен смениться
     * если isVisible=true, а потом стал false, колбеки анимации должны отмениться
     * - pointX: точка присоединения overlay к anchor, в зависимости от этой опции на тултипе можно рисоваться стрелочка по разному
     * - pointY: точка присоединения overlay к anchor, в зависимости от этой опции на тултипе можно рисоваться стрелочка по разному
     * - onBecomeVisible - колбек, который должен вызваться, когда контент стал видимым
     * - onBecomeInvisible - колбек, который должен вызваться, когда контент стал невидимым
     * - anchorWidth: ширина anchor
     * - anchorHeight: высота anchor
     */
    content: PropTypes.node,
    /**
     * Колбек, который дергается, когда контент открыт
     */
    onContentHide: PropTypes.func,
    /**
     * Колбек, который дергается, когда контент закрыт
     */
    onContentShow: PropTypes.func
  };

  constructor(props) {
    super(props)
    this.events = new EventEmitter
    // Идентификатор транзакции открытия/закрытия контента (чтобы правильно резолвить Promise)
    this.transactionIndex = 0
    this.state = {
      /**
       * Вставлен ли контент в DOM
       */
      isContentInDom: props.isShown || false,
      /**
       * является ли content видимым
       */
      isContentVisible: false,
      /**
       * Точка прикрепления контента X
       */
      contentPointX: props.contentPointX,
      /**
       * Точка прикрепления контента Y
       */
      contentPointY: props.contentPointY,
      /**
       * Ширина anchor элемента
       */
      anchorWidth: undefined,
      /**
       * Высота anchor элемента
       */
      anchorHeight: undefined,
      /**
       * Стиль контента
       */
      contentStyle: {}
    }
  }

  componentWillReceiveProps({isShown, anchorPointX, anchorPointY, contentPointX, contentPointY}) {
    if (isShown !== undefined && isShown !== this.props.isShown)
      if (isShown)
        this.show()
      else
        this.hide()

    else if (isShown &&
      (this.props.anchorPointX !== anchorPointX ||
        this.props.anchorPointY !== anchorPointY ||
        this.props.contentPointX !== contentPointX ||
        this.props.contentPointY !== contentPointY))
      this.show()

  }

  componentWillUnmount() {
    this.events.removeAllListeners()
    this.contentElement = null
    this.containerElement = null
  }

  componentDidMount() {
    if (this.props.isShown)
      this.show()
  }

  /**
   * Вызывается когда контент показан
   */
  onContentBecomeVisible = () => {
    this.events.emit('contentVisible')
  };

  /**
   * Вызывается когда контент стал невидимым
   */
  onContentBecomeInvisible = () => {
    this.events.emit('contentInvisible')
  };

  onContentMount = (element) => {
    this.contentElement = element
    this.updateContentPosition()
  };

  onContainerMount = (element) => {
    this.containerElement = element
  };

  /**
   * Вычислить позицию
   */
  updateContentPosition() {
    if (!this.state.isContentInDom || !this.contentElement)
      return
    // Вычисляем новый contentPoint, если нужно, в зависимости от ширины и высоты contentElement
    const {
      anchorPointX,
      anchorPointY,
      contentPointX,
      contentPointY,
      autoPositionX,
      autoPositionY
    } = this.props

    const parent = findOverflowedParent(this.containerElement, true)
    const anchorRect = boundingRect(this.containerElement)
    const parentRect = boundingRect(parent)

    const contentProps = getContentProps({
      anchorRect,
      parentRect,
      anchorPointX,
      anchorPointY,
      contentPointX,
      contentPointY,
      autoPositionX,
      autoPositionY,
      contentHeight: this.contentElement.offsetHeight,
      contentWidth: this.contentElement.offsetWidth
    })

    this.events.emit('newContentPosition', contentProps)
  }

  /**
   * Показать оверлей
   */
  show() {
    const transactionIndex = ++this.transactionIndex
    this.setState({
      isContentInDom: true
    })

    const whenPositioned = new Promise((resolve, reject) => {
      const handler = (result) => {
        if (transactionIndex === this.transactionIndex)
          resolve(result)
        if (transactionIndex <= this.transactionIndex)
          this.events.removeListener('newContentPosition', handler)
        if (transactionIndex < this.transactionIndex)
          reject()
      }
      this.events.on('newContentPosition', handler)
      this.updateContentPosition()
    })

    whenPositioned.then(({style, pointX, pointY}) => {
      this.setState({
        contentStyle: style,
        contentPointX: pointX,
        contentPointY: pointY,
        anchorWidth: this.containerElement.offsetWidth,
        anchorHeight: this.containerElement.offsetHeight,
        isContentVisible: true
      })
    })

    const whenVisible = new Promise((resolve, reject) => {
      const handler = () => {
        if (transactionIndex === this.transactionIndex)
          resolve()
        if (transactionIndex <= this.transactionIndex)
          this.events.removeListener('contentVisible', handler)
        if (transactionIndex < this.transactionIndex)
          reject()
      }
      this.events.on('contentVisible', handler)
    })

    return Promise.all([whenPositioned, whenVisible]).then(() => {
      if (this.props.onContentShow)
        this.props.onContentShow()
    })
  }

  /**
   * Скрыть оверлей
   */
  hide() {
    const transactionIndex = ++this.transactionIndex
    this.setState({
      isContentVisible: false
    })
    return new Promise((resolve, reject) => {
      const handler = () => {
        if (transactionIndex === this.transactionIndex)
          this.setState({isContentInDom: false}, resolve)
        if (transactionIndex <= this.transactionIndex)
          this.events.removeListener('contentInvisible', handler)
        if (transactionIndex < this.transactionIndex)
          reject()
      }
      this.events.on('contentInvisible', handler)
    }).then(() => {
      if (this.props.onContentHide)
        this.props.onContentHide()
    })
  }

  render() {
    const {
      className,
      style,
      anchor,
      content,
      sheet: { classes: css }
    } = this.props
    const {
      isContentVisible,
      isContentInDom,
      contentPointX,
      contentPointY,
      anchorWidth,
      anchorHeight,
      contentStyle
    } = this.state
    let contentElement = null
    if (isContentInDom)
      contentElement = (
        <div
          className={ css.content }
          style={ contentStyle }
          ref={ this.onContentMount} >
          {
            cloneElement(content, {
              isVisible: isContentVisible,
              pointX: contentPointX,
              pointY: contentPointY,
              anchorWidth,
              anchorHeight,
              onBecomeVisible: this.onContentBecomeVisible,
              onBecomeInvisible: this.onContentBecomeInvisible
            })
          }
        </div>
      )
    return (
      <div
        className={classnames(className, css.container)}
        style={style}
        ref={this.onContainerMount}>
        {anchor}
        {contentElement}
      </div>
    )
  }

}
