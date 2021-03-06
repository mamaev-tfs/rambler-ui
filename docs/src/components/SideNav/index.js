import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {NavLink, withRouter} from 'react-router-dom'
import {ApplyTheme} from 'rambler-ui/theme'
import Dropdown from 'rambler-ui/Dropdown'
import OnClickOutside from 'rambler-ui/OnClickOutside'
import {Menu, MenuItem} from 'rambler-ui/Menu'
import {throttle} from 'rambler-ui/utils/raf'
import config from 'docs/src/config'
import injectSheet, {fontFamily} from 'docs/src/utils/theming'
import Logo from './Logo'
import ArrowIcon from './ArrowIcon'

const initOnDesktop = window.innerWidth >= 768

@withRouter
@injectSheet(theme => ({
  root: {
    top: 0,
    left: -230,
    width: 230,
    minHeight: '100%',
    backgroundColor: theme.colors.light,
    transitionDuration: 200,
    transitionProperty: 'left, box-shadow',
    zIndex: 1000,
    '& + div': {
      transitionDuration: 200,
      transitionProperty: 'margin-left'
    }
  },
  opened: {
    left: 0,
    boxShadow: '0 5px 15px 0 rgba(52, 59, 76, 0.16)',
    '@media screen and (min-width: 768px)': {
      boxShadow: 'none'
    },
    '& + div': {
      '@media screen and (min-width: 768px)': {
        marginLeft: 230
      }
    },
    '& $toggle span': {
      '@media screen and (max-width: 767px)': {
        '&:nth-child(1)': {
          transform: 'translate(-50%, -1px) rotate(45deg)'
        },
        '&:nth-child(2)': {
          transform: 'translate(-50%, -1px) scaleX(0)'
        },
        '&:nth-child(3)': {
          transform: 'translate(-50%, -1px) rotate(-45deg)'
        }
      }
    }
  },
  toggle: {
    position: 'absolute',
    top: 0,
    left: '100%',
    border: 0,
    width: 50,
    height: 50,
    margin: 0,
    padding: '14px 10px',
    backgroundColor: theme.colors.blue,
    outline: 0,
    cursor: 'pointer',
    '& span': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 30,
      height: 2,
      backgroundColor: theme.colors.light,
      transitionDuration: 200,
      transitionProperty: 'transform',
      '&:nth-child(1)': {
        transform: 'translate(-50%, -11px) rotate(0)'
      },
      '&:nth-child(2)': {
        transform: 'translate(-50%, -1px) scaleX(1)'
      },
      '&:nth-child(3)': {
        transform: 'translate(-50%, 9px) rotate(0)'
      }
    }
  },
  scroll: {
    padding: '22px 15px 30px 25px',
    height: '100%',
    overflowY: 'auto'
  },
  logo: {
    position: 'relative',
    marginLeft: 2,
    marginBottom: 27,
    '& svg': {
      display: 'block !important'
    }
  },
  shadow: {
    '&::after': {
      position: 'absolute',
      top: '100%',
      left: 0,
      content: '""',
      width: '100%',
      height: 20,
      backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.1))'
    }
  },
  list: {
    '& $list': {
      display: 'none',
      margin: 10,
      marginRight: 0
    }
  },
  item: {
    padding: '5px 0'
  },
  link: {
    display: 'inline-block',
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '25px',
    cursor: 'pointer',
    '&, &:visited': {
      color: theme.colors.black
    },
    '&:active': {
      color: theme.colors.alternativeBlue
    },
    '&:hover, &:active': {
      '& $linkIcon': {
        fill: theme.colors.alternativeBlue + '!important'
      }
    }
  },
  activeLink: {
    composes: '$link',
    '&, &:visited': {
      color: theme.colors.alternativeBlue
    }
  },
  openedLink: {
    composes: '$link',
    '& + $list': {
      display: 'block'
    }
  },
  linkIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginTop: -2,
    marginLeft: 3
  },
  version: {
    position: 'relative',
    marginTop: 25,
    '& button': {
      display: 'block',
      border: 0,
      margin: 0,
      padding: 0,
      backgroundColor: 'transparent',
      color: theme.colors.cloudGray,
      fontFamily: fontFamily.CorsicaRamblerLX,
      fontSize: 14,
      lineHeight: '20px',
      cursor: 'pointer',
      outline: 0,
      '& svg': {
        marginTop: -2,
        marginLeft: 3,
        verticalAlign: 'middle'
      }
    }
  },
  dropdown: {
    padding: '0 !important',
    marginTop: -7.5,
    marginLeft: -13,
    minWidth: 150,
    maxHeight: 160,
    overflowY: 'auto'
  }
}))
export default class SideNav extends PureComponent {

  static propTypes = {
    /**
     * Список страниц для вывода
     */
    pages: PropTypes.arrayOf(PropTypes.object)
  }

  pageY = initOnDesktop ? window.pageYOffset : 0
  position = initOnDesktop ? 'absolute' : 'fixed'

  state = {
    desktop: initOnDesktop,
    navOpened: initOnDesktop,
    top: this.pageY,
    position: this.position,
    activeSubtree: this.props.location.pathname,
    versions: [],
    showVersions: false
  }

  componentDidMount() {
    const req = new XMLHttpRequest()
    req.open('GET', `${config.pathPrefix}/versions.json`, true)
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200)
        this.setState({
          versions: JSON.parse(req.responseText)
        })
    }
    req.send(null)
    window.addEventListener('scroll', this.updatePosition)
    window.addEventListener('resize', this.updateViewport)
  }

  componentDidUpdate (prevProps, prevState) {
    const {desktop} = this.state
    const {location} = this.props
    this.pageY = desktop ? window.pageYOffset : 0
    this.position = desktop ? 'absolute' : 'fixed'
    if (desktop !== prevState.desktop)
      this.setState({
        navOpened: desktop,
        top: this.pageY,
        position: this.position
      })
    if (location === prevProps.location)
      return
    this.setState({
      activeSubtree: location.pathname,
      ...(!desktop && {
        navOpened: false
      }),
      ...(desktop && {
        top: 0,
        position: this.position
      })
    })
    window.scrollTo(0, 0)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updatePosition)
    window.removeEventListener('resize', this.updateViewport)
  }

  toggleNav = () => {
    this.setState({
      navOpened: !this.state.navOpened
    })
  }

  closeNavOnClickOutside = () => {
    const {desktop} = this.state
    if (desktop)
      return
    this.setState({
      navOpened: false
    })
  }

  changeVersion = version => {
    window.location = `${config.pathPrefix}/${version}${version ? '/' : ''}`
  }

  showVersions = () => {
    this.setState({
      showVersions: true
    })
  }

  hideVersions = () => {
    this.setState({
      showVersions: false
    })
  }

  activeSubtree(pathname) {
    const {activeSubtree} = this.state
    if (!activeSubtree)
      return false
    return activeSubtree.indexOf(pathname) === 0
  }

  toggleSubtree = event => {
    const pathname = event.currentTarget.getAttribute('data-href')
    this.setState({
      activeSubtree: this.activeSubtree(pathname) ? null : pathname
    })
  }

  updatePosition = throttle(() => {
    const {desktop} = this.state
    if (!desktop)
      return
    const {pageYOffset, innerHeight} = window
    const {offsetHeight, offsetTop} = this.rootNode
    if (offsetHeight >= document.body.clientHeight)
      return
    let position
    let top
    if (
      (this.pageY > pageYOffset && pageYOffset <= (offsetTop || pageYOffset)) ||
      innerHeight === offsetHeight
    ) {
      position = 'fixed'
      top = 0
    } else if (
      this.pageY < pageYOffset &&
      pageYOffset + innerHeight >= offsetTop + offsetHeight
    ) {
      position = 'fixed'
      top = innerHeight - offsetHeight
    } else {
      position = 'absolute'
      top = pageYOffset + offsetTop
    }
    this.pageY = pageYOffset
    if (position === this.position)
      return
    this.position = position
    this.setState({
      top,
      position
    })
  })

  updateViewport = throttle(() => {
    const desktop = window.innerWidth >= 768
    if (desktop === this.state.desktop)
      return
    this.setState({
      desktop
    })
  })

  setRoot = el => {
    this.rootNode = el
  }

  renderLink(page) {
    const {classes} = this.props

    if (!page.children)
      return (
        <NavLink
          to={page.pathname}
          className={classes.link}
          activeClassName={classes.activeLink}>
          {page.title}
        </NavLink>
      )

    return (
      <span
        className={this.activeSubtree(page.pathname) ? classes.openedLink : classes.link}
        data-href={page.pathname}
        onClick={this.toggleSubtree}>
        {page.title}
        {page.children &&
          <ArrowIcon size={20} className={classes.linkIcon} />
        }
      </span>
    )
  }

  renderList(pages) {
    const {classes} = this.props

    return (
      <div className={classes.list}>
        {pages.map(page => (
          <div className={classes.item} key={page.pathname}>
            {this.renderLink(page)}
            {page.children && this.renderList(page.children)}
          </div>
        ))}
      </div>
    )
  }

  renderVersion() {
    const {classes} = this.props
    const {versions, showVersions} = this.state

    if (versions.length === 0)
      return null

    let currentVersion = versions.reduce(
      (acc, v) => {
        const currentPath =
          window.location.pathname.replace(config.pathPrefix, '').replace(/^\//, '').split('/').join('/')
        if (currentPath === v.path)
          return v.title ? v.title.replace(/[^0-9.]/g, '') : v.path
        return acc
      },
      null
    )

    if (!currentVersion)
      currentVersion = versions[0].title.replace(/[^0-9.]/g, '')

    return (
      <div className={classes.version}>
        <ApplyTheme>
          <Dropdown
            className={classes.dropdown}
            anchorPointY="top"
            contentPointY="top"
            anchorPointX="left"
            contentPointX="left"
            isOpened={showVersions}
            anchor={
              <button onClick={this.showVersions}>
                Версия {currentVersion}
                <ArrowIcon color="currentColor" />
              </button>
            }
            onClose={this.hideVersions}>
            <Menu
              size="small"
              value={this.version}
              onChange={this.changeVersion}>
              {versions.map(v => (
                <MenuItem key={v.path} value={v.path}>
                  {v.title || v.path}
                </MenuItem>
              ))}
            </Menu>
          </Dropdown>
        </ApplyTheme>
      </div>
    )
  }

  render() {
    const {classes, pages} = this.props
    const {navOpened, top, position, desktop} = this.state

    return (
      <OnClickOutside handler={this.closeNavOnClickOutside}>
        <div
          ref={this.setRoot}
          style={{
            top,
            position,
            height: desktop ? null : '100%'
          }}
          className={classnames(classes.root, navOpened && classes.opened)}>
          <button
            type="button"
            className={classes.toggle}
            onClick={this.toggleNav}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={classes.scroll}>
            <Logo className={classes.logo} />
            {this.renderList(pages)}
            {this.renderVersion()}
          </div>
        </div>
      </OnClickOutside>
    )
  }

}
