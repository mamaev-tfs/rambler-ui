import React, { PureComponent } from 'react'
import SvgIcon from '../SvgIcon'

export default class RamblerVideoIcon extends PureComponent {

  static displayName = 'RamblerVideoIcon'

  render() {
    return (
      <SvgIcon { ...this.props } viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.948 2.105a.79.79 0 0 0-.79.792l.016 14.19a.79.79 0 0 0 1.174.689l12.73-7.095a.79.79 0 0 0 0-1.38L4.33 2.206a.778.778 0 0 0-.382-.1m.79 2.134l10.334 5.752L4.75 15.743 4.738 4.24"/>
      </SvgIcon>
    )
  }
}
