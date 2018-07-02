import React, { Component } from 'react'
import FotoItem from './Foto'

export default class Timeline extends Component {
  constructor() {
    super()
    this.state = {
      fotos: []
    }
  }
  componentDidMount() {
    fetch('http://localhost:8080/api/public/fotos/rafael')
      .then(res => res.json())
      .then(fotos => {
        this.setState({ fotos })
      })
  }
  render = () => (
    <div className="fotos container">
      {
        this.state.fotos.map((foto, i) => (
          <FotoItem key={JSON.stringify(foto)} foto={foto} />
        ))
      }
    </div>
  )
}