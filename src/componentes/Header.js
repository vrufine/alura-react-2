import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {
  render = () => (
    <header className="header container">
      <Link to="/timeline" className="header-logo">
        Instalura
      </Link>
      <form lpformnum="1" className="header-busca">
        <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" />
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