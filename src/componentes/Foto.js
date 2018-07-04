import React, { Component } from 'react'
import { Link } from "react-router-dom";
import PubSub from 'pubsub-js'

class FotoHeader extends Component {
  render = () => (
    <header className="foto-header">
      <figure className="foto-usuario">
        <img src={this.props.foto.urlPerfil} alt="foto do usuario" />
        <figcaption className="foto-usuario">
          <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
            {this.props.foto.loginUsuario}
          </Link>
        </figcaption>
      </figure>
      <time className="foto-data">{this.props.foto.horario}</time>
    </header>
  )
}

class FotoInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      likers: this.props.foto.likers,
      comentarios: this.props.foto.comentarios
    }
  }

  componentDidMount() {
    PubSub.subscribe('atualiza-liker', (topic, dados) => {
      if (this.props.foto.id === dados.fotoId) {
        const possivelLiker = dados.quemCurtiu
        const index = this.state.likers.findIndex(item => item.login === dados.quemCurtiu.login)
        const novosLikers = this.state.likers
        if (index > -1) {
          novosLikers.splice(index, 1)
          this.setState({ likers: novosLikers })
        } else {
          novosLikers.push(possivelLiker)
          this.setState({ likers: novosLikers })
        }
      }
    })
    PubSub.subscribe('novos-comentarios', (topic, infoComentario) => {
      if (this.props.foto.id === infoComentario.fotoId) {
        const novosComentarios = this.state.comentarios.concat(infoComentario.novoComentario)
        this.setState({ comentarios: novosComentarios })
      }
    })
  }

  render = () => (
    <div className="foto-info">
      <div className="foto-info-likes">
        {
          this.props.foto.likers.map(liker => {
            return (<Link key={JSON.stringify(liker)} to={`/timeline/${liker.login}`}>{liker.login},</Link>)
          })
        } curtiram
      </div>
      <p className="foto-info-legenda">
        <Link className="foto-info-autor" to={`/timeline/${this.props.foto.loginUsuario}`}>{this.props.foto.loginUsuario}</Link> {this.props.foto.comentario}
      </p>

      <ul className="foto-info-comentarios">
        {
          this.state.comentarios.map(comentario => {
            return (
              <li key={JSON.stringify(comentario)} className="comentario">
                <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login} </Link> {comentario.texto}
              </li>
            );
          })
        }
      </ul>
    </div>
  )
}

class FotoAtualizacoes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      likeada: this.props.foto.likeada
    }
  }

  like = (event) => {
    event.preventDefault()
    fetch(`http://localhost:8080/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${window.localStorage.getItem('auth-token')}`, {
      method: 'POST'
    }).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Erro ao dar like na foto')
      }
    }).then(quemCurtiu => {
      this.setState({ likeada: !this.state.likeada })
      PubSub.publish('atualiza-liker', { fotoId: this.props.foto.id, quemCurtiu })
    }).catch(error => {
      console.log(error)
    })
  }

  comentar = (event) => {
    event.preventDefault()
    fetch(`http://localhost:8080/api/fotos/${this.props.foto.id}/comment?X-AUTH-TOKEN=${window.localStorage.getItem('auth-token')}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        texto: this.comentario.value
      })
    }).then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Erro ao comentar')
      }
    }).then(novoComentario => {
      PubSub.publish('novos-comentarios', { fotoId: this.props.foto.id, novoComentario })
      this.comentario.value = ''
    }).catch(err => {
      alert(err.message)
    })
  }

  render = () => (
    <section className="fotoAtualizacoes">
      <a onClick={this.like} className={this.state.likeada ? 'fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'}>Likar</a>
      <form className="fotoAtualizacoes-form" onSubmit={this.comentar}>
        <input
          type="text"
          placeholder="Adicione um comentário..."
          className="fotoAtualizacoes-form-campo"
          ref={input => this.comentario = input}
        />
        <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
      </form>
    </section>
  )
}

export default class Foto extends Component {
  render = () => (
    <div className="foto">
      <FotoHeader foto={this.props.foto} />
      <img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
      <FotoInfo foto={this.props.foto} />
      <FotoAtualizacoes foto={this.props.foto} />
    </div>
  )
}