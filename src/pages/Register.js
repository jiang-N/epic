import React from 'react'
import {Form, Input, Button} from 'antd'
import styled from 'styled-components'
import {useStores} from '../stores'
import {useHistory} from 'react-router-dom'

const Wrapper = styled.div`
  max-width: 600px;
  margin: 30px auto;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, .2);
  border-radius: 4px;
  padding: 20px;
`

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18,
  },
}

const Component = () => {
  const {AuthStore} = useStores()
  const history = useHistory()

  const onFinish = (values) => {
    AuthStore.setUsername(values.username)
    AuthStore.setPassword(values.password)
    AuthStore.register().then(() => {
      console.log('注册成功，跳转到首页')
      history.push('/')
    }).catch(() => {
      console.log('注册失败，什么都不做')
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const validateUsername = (rule, value) => {
    if (/\W/.test(value)) return Promise.reject('用户名只能为字母、数字、下划线')
    if (value.length < 4 || value.length > 10) return Promise.reject('用户名长度为4-10个字符')
    return Promise.resolve()
  }

  const validateConfirm = ({getFieldValue}) => ({
    validator(rule, value) {
      if (getFieldValue('password') === value) return Promise.resolve()
      return Promise.reject('两次密码不一致')
    }
  })

  return (
    <Wrapper>
      <Title>注册</Title>
      <Form
        {...layout}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
            {validator: validateUsername}
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            {
              min: 4,
              message: '最少4个字符'
            },
            {
              max: 10,
              message: '最多10个字符'
            }
          ]}
        >
          <Input.Password/>
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: '请确认密码',
            },
            validateConfirm
          ]}
        >
          <Input.Password/>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

export default Component