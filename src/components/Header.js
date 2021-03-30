import React from 'react'
import LogoUrl from '../logo.svg'
import {NavLink} from 'react-router-dom'
import styled from 'styled-components'

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 10px 100px;
  background-color: #02101f;
  color: #fff;
`
const Logo = styled.img`
  height: 30px;
`
const StyleLink = styled(NavLink)`
  color: #fff;
  margin-left: 30px;

  &.active {
    border-bottom: 1px solid #fff;
  }
`

function Component() {
  return (
    <Header>
      <Logo src={LogoUrl} alt="logo"/>
      <nav>
        <StyleLink to='/' activeClassName='active' exact>首页</StyleLink>
        <StyleLink to='/history' activeClassName='active'>上传历史</StyleLink>
        <StyleLink to='/about' activeClassName='active'>关于我</StyleLink>
      </nav>
    </Header>
  )
}

export default Component