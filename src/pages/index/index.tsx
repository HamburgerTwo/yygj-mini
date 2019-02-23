import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, WebView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { accountType } from '../../config';

import { add } from '../../actions/counter';
import { loginByWechatOauthAction, findEmployeeByJwtAction } from '../../actions/user';
import s from './index.module.scss'

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
 
  activity: {
    current: string,
  }
}

type PageDispatchProps = {
  add: () => void,
  loginByWechatOauth: (code: string, accountType: string) => Promise<any>,
  findEmployeeByJwt: () => Promise<any>
}

type PageOwnProps = {}

type PageState = {
  code: string,
  errorMsg: string,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ activity }) => ({
  activity
}), (dispatch) => ({
  add () {
    dispatch(add());
    Taro.navigateTo({
      url: '/pages/register/index'
    })
  },
  loginByWechatOauth(code, accountType) {
    return Promise.resolve().then(() => dispatch(loginByWechatOauthAction(code, accountType)))
  },
  findEmployeeByJwt() {
    return Promise.resolve().then(() => dispatch(findEmployeeByJwtAction))
  }
}))
class Index extends Component<PageOwnProps, PageState> {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '首页',
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
    
  }
  componentDidMount() {
  }
  componentWillMount () {
    Taro.checkSession().then(() => {
      return this.props.findEmployeeByJwt()
    }).catch(() => {
      return Taro.login().then((res) => {
        return res;
      }).then((res) => {
        return this.props.loginByWechatOauth(res.code, accountType);
      }).then((res) => {
        console.log(res)
        Taro.setStorageSync('jwt',res.payload.authToken);
        return res;
      });
    }).then(res => {
      console.log(res);
    })
    
  }
  public onCopy = () => {
    Taro.setClipboardData({data: this.state.code,})
    .then(() => {
      
    })
  }
  public onPostMessage = (e) => {
    console.log(e)
  }
  componentWillUnmount () { 
    
  }
  onShareAppMessage(res) {
    
    return {
      title: '自定义转发标题',
      path: '/pages/index/index?id=123'
    }
  }
  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { code, errorMsg } = this.state;
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>导航</Button>
        <Button className='add_btn' onClick={this.onCopy}>复制</Button>
        <View className={s.code}>code:{code}</View>
        <View>errorMsg:{errorMsg}</View>
        <WebView src={this.props.activity.current} onMessage={this.onPostMessage} />
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
