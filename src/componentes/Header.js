import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PubSub from 'pubsub-js'

export default class Header extends Component {
  pesquisa = (event) => {
    event.preventDefault()
    fetch(
      `http://localhost:8080/api/public/fotos/${this.loginPesquisado.value}`
    ).then(response => response.json())
    .then(fotos => {
      PubSub.publish('timeline', { fotos })
    })
  }

  render = () => (
    <header className="header container">
      <Link to="/timeline" className="header-logo">
        Instalura
      </Link>
      <form
        onSubmit={this.pesquisa}
        className="header-busca"
      >
        <input required ref={input => this.loginPesquisado = input} type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" />
        <input type="submit" value="Buscar" className="header-busca-submit" />
      </form>
      <nav>
        <ul className="header-nav">
          <li className="header-nav-item">
            <a href="">
              ♡
            </a>
          </li>
          <li className="header-nav-item">
            <Link to="/logout">Sair</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}