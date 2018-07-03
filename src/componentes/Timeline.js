import React, { Component } from 'react'
import FotoItem from './Foto'
import Header from './Header'

export default class Timeline extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      fotos: []
    }
  }
  componentDidMount() {
    this.buscarFotos()
  }
  render = () => {
    return (
      <div id='timeline'>
        <Header />
        <div className='fotos container'>
          {
            this.state.fotos.map((foto, i) => (
              <FotoItem key={JSON.stringify(foto)} foto={foto} />
            ))
          }
        </div>
      </div>
    )
  }

  buscarFotos() {
    const endpoint =
      this.props.login
        ? `http://localhost:8080/api/public/fotos/${this.props.login}`
        : `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${window.localStorage.getItem('auth-token')}`
    fetch(endpoint)
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error('Não foi possível buscar as fotos.')
        }
      })
      .then(fotos => {
        this.setState({ fotos })
      })
      .catch(error => {
        console.error(error.message)
      })
  }
}
