import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import shopowner from '../../assets/shopowner.png';
import clerk from '../../assets/clerk.png';
import { ROLE } from '../../constants/user';
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

@connect(({ }) => ({
}), (dispatch) => ({
}))

class Index extends Component {

  config: Config = {
    navigationBarTitleText: '选择角色',
  }

  componentWillReceiveProps (nextProps) {
  }
  componentDidMount() {
  }
  componentWillUnmount () {

  }

  componentDidShow () { }

  componentDidHide () { }

  onNextStep = (role) => {
    const { page } = this.$router.params;
    Taro.redirectTo({
      url: `/pages/bindingstore/index?role=${role}&page=${page}`
    })
  }
  render () {
    return (
      <View className="container">
        <View className="content">
          <Image src={shopowner} className="role" onClick={this.onNextStep.bind(this, ROLE.SHOPOWNER)} />
          <Image src={clerk} className="role" onClick={this.onNextStep.bind(this, ROLE.CLERK)} />
        </View>
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
