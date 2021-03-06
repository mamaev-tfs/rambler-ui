import React, { PureComponent } from 'react'
import SvgIcon from '../SvgIcon'

export default class RamblerOrganizationsIcon extends PureComponent {

  static displayName = 'RamblerOrganizationsIcon'

  render() {
    return (
      <SvgIcon { ...this.props } viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 8.926c-.634 0-1.15-.517-1.15-1.15 0-.634.516-1.151 1.15-1.151.634 0 1.15.517 1.15 1.15 0 .634-.516 1.15-1.15 1.15m0-3.5a2.352 2.352 0 0 0-2.35 2.35 2.352 2.352 0 0 0 2.35 2.35 2.352 2.352 0 0 0 2.35-2.35A2.352 2.352 0 0 0 10 5.426m.003 10.147c-1.878-2.514-4.029-6.004-4.029-7.888 0-2.225 1.88-4.177 4.026-4.177 2.145 0 4.026 1.952 4.026 4.177 0 1.905-2.148 5.386-4.023 7.888M10 2.007c-3.053 0-5.526 2.715-5.526 5.677 0 2.946 3.517 7.753 4.94 9.577.3.384.874.384 1.174 0 1.424-1.815 4.938-6.601 4.938-9.577 0-2.962-2.474-5.677-5.526-5.677M0 20V0m20 0v20"/>
      </SvgIcon>
    )
  }
}
