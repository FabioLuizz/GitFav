import { GithubUsers } from './GithubUsers.js'

export class Favorite {
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()
  }

  load() {
    this.users = JSON.parse(localStorage.getItem('@github-favorite:')) || []
  }

  save() {
    localStorage.setItem('@github-favorite:', JSON.stringify(this.users))
  }

  async add(username) {
    try {
      const user = await GithubUsers.search(username)

      if (user.login === undefined) {
        throw new Error('Usúario não encontrado!')
      }

      const userExist = this.users.find(person => person.login === user.login)

      if (userExist) {
        throw new Error('Usuário ja cadastrado!')
      }

      this.users = [user, ...this.users]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredUsers = this.users.filter(
      person => person.login !== user.login
    )

    this.users = filteredUsers
    this.update()
    this.save()
  }
}

export class FavoriteView extends Favorite {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table .fav')

    this.update()
    this.addUser()
  }

  addUser() {
    const userSearch = this.root.querySelector('.search button')
    const inputSearch = this.root.querySelector('#input-search')

    inputSearch.onkeypress = keyPressed => {
      if (keyPressed.key === 'Enter' || userSearch.click === 'onclick') {
        const { value } = this.root.querySelector('#input-search')

        this.add(value)
      }
    }

    userSearch.onclick = () => {
      const { value } = this.root.querySelector('#input-search')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.users.forEach(user => {
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a span').textContent = user.name
      row.querySelector('.user a p').textContent = `${'/' + user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Deseja mesmo remover este usuário ?')

        if (isOk) {
          this.delete(user)
        }

        if (this.users.length === 0) {
          this.root.querySelector('.noFav').classList.remove('hide')
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
    <img
      src="https://github.com/fabioluizz.png"
      alt="Foto do Usuário"
      />
    <a href="https://github.com/fabioluizz">
      <span>Fabio Luiz</span>
      <p>/fabioluizz</p>
    </a>
    </td>
    <td class="repositories">123</td>
    <td class="followers">1234</td>
    <td>
    <button class="remove">Remover</button>
    </td>
    `

    return tr
  }

  removeAllTr() {
    if (this.users.length !== 0) {
      this.root.querySelector('.noFav').classList.add('hide')
    }

    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
