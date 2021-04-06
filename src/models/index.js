import AV, {User} from 'leancloud-storage'

AV.init({
  appId: '91EgSCcUsxRrAcBJiYM9DKuo-gzGzoHsz',
  appKey: 'LxwvCb4f6hmo3ctrhH1DwFGE',
  serverURL: 'https://91egsccu.lc-cn-n1-shared.com'
})

const Auth = {
  register(username, password) {
    let user = new User()
    user.setUsername(username)
    user.setPassword(password)
    return new Promise((resolve, reject) => {
      user.signUp().then(loginUser => resolve(loginUser), error => reject(error))
    })
  },
  login(username, password) {
    return new Promise((resolve, reject) => {
      User.logIn(username, password).then(loginUser => resolve(loginUser), error => reject(error))
    })
  },
  logout() {
    return User.logOut()
  },
  getCurrentUser() {
    return User.current()
  }
}

const Uploader = {
  add(file, filename) {
    const item = new AV.Object('Image')
    const avFile = new AV.File(filename, file)
    item.set('filename', filename)
    item.set('owner', User.current())
    item.set('url', avFile)
    return new Promise((resolve, reject) => {
      item.save().then(serverFile => resolve(serverFile), error => reject(error))
    })
  },
  find({page = 0, limit = 10}) {
    const query = new AV.Query('Image')
    query.include('owner')
    query.limit(limit)
    query.skip(page * limit)
    query.descending('createAt')
    query.equalTo('owner', User.current())
    return new Promise((resolve, reject) => {
      query.find().then(results => resolve(results)).catch(error => reject(error))
    })
  }
}

export {Auth, Uploader}