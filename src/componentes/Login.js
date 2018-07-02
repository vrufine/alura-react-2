import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: this.props.location.state ? this.props.location.state.msg : '',
      loginAutorizado: false
    }
  }
  logar = (event) => {
    event.preventDefault()
    const requestInfo = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: this.login.value,
        senha: this.senha.value
      })
    }
    fetch('http://localhost:8080/api/public/login', requestInfo)
      .then(res => {
        if (res.ok) {
          this.setState({ msg: '' })
          return res.text()
        } else {
          throw new Error('Login e/ou senha incorretos.')
        }
      })
      .then(token => {
        window.localStorage.setItem('auth-token', token)
        this.props.history.push('/timeline')
      })
      .catch(error => {
        this.setState({ msg: error.message })
      })
  }
  render = () => {

    return (
      <div className="login-box">
        <div className="header-logo login">
          InstAlura
          </div>
        <span className="msg-login">{this.state.msg}</span>
        <form onSubmit={this.logar} action="post">
          <input ref={input => this.login = input} type="text" />
          <input ref={input => this.senha = input} type="password" />
          <input type="submit" value="Fazer login" />
        </form>
      </div>
    )
  }
}

export default withRouter(Login)