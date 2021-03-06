import React, { PureComponent } from 'react'
import SvgIcon from '../SvgIcon'

export default class RamblerLoveIcon extends PureComponent {
  static displayName = 'RamblerLoveIcon'

  render() {
    return (
      <SvgIcon { ...this.props } viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M0 20V0m20 0v20M13.562 2.208c-1.312 0-2.642.5-3.562 1.37-.965-.87-2.308-1.37-3.616-1.37-2.225 0-4.35 1.448-4.35 4.99 0 3.953 5.795 8.869 7.499 10.23.276.219.659.22.935.002 1.706-1.354 7.498-6.244 7.498-10.232 0-3.542-2.175-4.99-4.404-4.99m0 1.5c.873 0 2.904.34 2.904 3.49 0 2.565-3.657 6.403-6.463 8.689-2.808-2.299-6.469-6.148-6.469-8.689 0-1.221.311-2.175.899-2.76.607-.603 1.396-.73 1.951-.73.951 0 1.928.368 2.612.984l.515.464a.749.749 0 0 0 1.016-.013l.503-.475c.636-.601 1.582-.96 2.532-.96"/>
      </SvgIcon>
    )
  }
}
