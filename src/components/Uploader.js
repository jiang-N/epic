import React, {useRef} from 'react'
import {useStores} from '../stores'
import {observer, useLocalObservable} from 'mobx-react'
import {Upload, message, Spin} from 'antd'
import {InboxOutlined} from '@ant-design/icons'
import styled from 'styled-components'

const {Dragger} = Upload

const Result = styled.div`
  margin-top: 30px;
  border: 1px dashed #ccc;
  padding: 20px;

  & > h1 {
    margin: 20px 0;
    text-align: center;
  }

  & > img {
    max-width: 300px;
  }

  & > dl > dt {
    margin-top: 15px;
  }
`

const StyledInput = styled.input`
  border: 1px solid #ccc;
`

const Component = observer(() => {
    const {ImageStore, UserStore} = useStores()
    const ref1 = useRef()
    const ref2 = useRef()

    const store = useLocalObservable(() => ({
      width: null,
      setWidth(width) {
        store.width = width
      },
      get widthStr() {
        return store.width ? `/w/${store.width}` : ''
      },
      height: null,
      setHeight(height) {
        store.height = height
      },
      get heightStr() {
        return store.height ? `/h/${store.height}` : ''
      },
      get fullStr() {
        return ImageStore.serverFile.attributes.url.attributes.url + '?imageView2/0' + store.widthStr + store.heightStr
      }
    }))

    const bindWidthChange = () => {
      store.setWidth(ref1.current.value)
    }

    const bindHeightChange = () => {
      store.setHeight(ref2.current.value)
    }

    const props = {
      showUploadList: false,
      beforeUpload: file => {
        ImageStore.setFile(file)
        ImageStore.setFilename(file.name)
        if (UserStore.currentUser === null) {
          message.warning('请先登录再上传')
          return false
        }
        if (!/(svg$)|(png$)|(jpg$)|(jpeg$)|(gif$)/.test(file.type)) {
          message.error('只能上传svg/png/jpg/gif格式的图片')
          return false
        }
        if (file.size > 1024 * 1024) {
          message.error('图片大于1M')
          return false
        }
        ImageStore.upload().then(() => {
          console.log('上传成功')
        }).catch(() => {
          console.log('上传失败')
        })
        return false
      }
    }

    return (
      <div>
        <Spin tip='上传中' spinning={ImageStore.isUploading}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined/>
            </p>
            <p className="ant-upload-text">点击或者拖拽上传图片</p>
            <p className="ant-upload-hint">
              仅支持.png/.gif/.jpg/.svg格式的图片，图片最大1M
            </p>
          </Dragger>
        </Spin>
        {
          ImageStore.serverFile ? <Result>
            <h1>上传结果</h1>
            <dl>
              <dt>图片地址</dt>
              <dd>
                <a href={ImageStore.serverFile.attributes.url.attributes.url}
                   target='_blank' rel='noreferrer'>{ImageStore.serverFile.attributes.url.attributes.url}</a>
              </dd>
              <dt>文件名</dt>
              <dd>{ImageStore.filename}</dd>
              <dt>图片预览</dt>
              <dd>
                <img src={ImageStore.serverFile.attributes.url.attributes.url} alt="预览图"/>
              </dd>
              <dt>自定义尺寸</dt>
              <dd>
                <StyledInput type="text" placeholder='宽度' onChange={bindWidthChange} ref={ref1}/>
                <StyledInput type="text" placeholder='高度' onChange={bindHeightChange} ref={ref2}/>
              </dd>
              <dd>
                <a href={store.fullStr} target='_blank' rel='noreferrer'>{store.fullStr}</a>
              </dd>
            </dl>
          </Result> : null
        }
      </div>
    )
  }
)

export default Component