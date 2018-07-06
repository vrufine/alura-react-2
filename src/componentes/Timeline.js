import React, { Component } from 'react'
import FotoItem from './Foto'
import Header from './Header'
import PubSub from 'pubsub-js'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

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

  like = (fotoId) => {
    fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${window.localStorage.getItem('auth-token')}`, {
      method: 'POST'
    }).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Erro ao dar like na foto')
      }
    }).then(quemCurtiu => {
      PubSub.publish('atualiza-liker', { fotoId, quemCurtiu })
    }).catch(error => {
      console.log(error)
    })
  }

  comentar = (fotoId, comentario) => {
    fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${window.localStorage.getItem('auth-token')}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        texto: comentario
      })
    }).then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Erro ao comentar')
      }
    }).then(novoComentario => {
      PubSub.publish('novos-comentarios', { fotoId, novoComentario })
    }).catch(err => {
      alert(err.message)
    })
  }

  render = () => {
    return (
      <div id='timeline'>
        <Header />
        <div className='fotos container'>
          <TransitionGroup>
            {
              this.state.fotos.map((foto, i) => (
                <CSSTransition
                  key={JSON.stringify(foto)}
                  timeout={500}
                  classNames="fade"
                >
                  <FotoItem
                    key={JSON.stringify(foto)}
                    foto={foto}
                    like={this.like}
                    comentar={this.comentar}
                  />
                </CSSTransition>
              ))
            }
          </TransitionGroup>
        </div>
      </div>
    )
  }
}
