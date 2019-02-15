import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
}

type PageDispatchProps = {
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({

 }) => ({
}), (dispatch) => ({
}))

class Index extends Component {

  config: Config = {
    navigationBarTitleText: '绑定门店',
  }

  componentWillMount () {
    console.log('params', this.$router.params);
  }
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
  }
  componentWillUnmount () {

  }

  componentDidShow () { }

  componentDidHide () { }

  getName = () => {

  }

  getStoreCode = () => {

  }

  confirm = () => {

  }

  query = () => {

  }

  render () {
    return (
      <View className="container">
        <View className="inpuWrapName">
          <Input name="name" maxLength={11} placeholder="请输入名字" onInput={this.getName} />
        </View>
        <View className="inpuWrapCode">
          <Input type="number" name="code"  placeholder="请输入门店编号" onInput={this.getStoreCode} />
          <View className="queryWrap" >
            <Button className="query" plain={true} onClick={this.query}>查询</Button>
          </View>
        </View>
        <View className="storeName" >门店名称：<Text>xxxx</Text></View>
        <Button className="confirm" onClick={this.confirm}>确定</Button>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
