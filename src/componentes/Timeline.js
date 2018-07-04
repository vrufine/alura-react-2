import React, { Component } from 'react'
import FotoItem from './Foto'
import Header from './Header'
import PubSub from 'pubsub-js'

export default class Timeline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fotos: []
    }
    this.login = this.props.login
  }

  componentWillMount() {
    PubSub.subscribe('timeline', (topic, { fotos }) => {
      this.setState({ fotos })
    })
  }

  componentDidMount() {
    this.buscarFotos()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login) {
      this.login = nextProps.login
      this.buscarFotos()
    }
  }

  buscarFotos() {
    const endpoint =
      this.login
        ? `http://localhost:8080/api/public/fotos/${this.login}`
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
}
