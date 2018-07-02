import React, { Component } from 'react'
import FotoItem from './Foto'
import Header from './Header'

export default class Timeline extends Component {
  constructor() {
    super()
    this.state = {
      fotos: []
    }
  }
  componentDidMount() {
    this.buscarFotos();
  }
  render = () => (
    <div id="timeline">
      <Header/>
      <div className="fotos container">
        {
          this.state.fotos.map((foto, i) => (
            <FotoItem key={JSON.stringify(foto)} foto={foto} />
          ))
        }
      </div>
    </div>
  )

  buscarFotos = () => {
    fetch(`http://localhost:8080/api/fotos?X-AUTH-TOKEN=${window.localStorage.getItem('auth-token')}`)
      .then(res => res.json())
      .then(fotos => {
        this.setState({ fotos });
      });
  }
}