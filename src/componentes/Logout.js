import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default class Logout extends Component {
  render = () => {
    window.localStorage.removeItem('auth-token')
    return <Redirect to="/" />
  }
}