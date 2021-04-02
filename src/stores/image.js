import {observable, action, makeObservable} from 'mobx'
import {Uploader} from '../models'

class ImageStore {
  constructor() {
    makeObservable(this)
  }

  @observable filename = ''
  @observable file = null
  @observable isUploading = false
  @observable serverFile = null

  @action setFilename(newFilename) {
    this.filename = newFilename
  }

  @action setFile(newFile) {
    this.file = newFile
  }

  @action upload() {
    this.isUploading = true
    return new Promise((resolve, reject) => {
      Uploader.add(this.file, this.filename).then(serverFile => {
        this.serverFile = serverFile
        resolve(serverFile)
      }).catch(err => {
        console.error('上传失败')
        reject(err)
      }).finally(() => {
        this.isUploading = false
      })
    })
  }
}

export default new ImageStore()