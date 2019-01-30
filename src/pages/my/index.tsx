import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import avator from '../../assets/avator.png';

import list from '../../assets/icon-list.png';

import address from '../../assets/icon-address.png';
import { signAction } from '../../actions/user';
import './index.scss'
import { string } from 'prop-types';

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
  user: {
    userName: string,
    isSign: boolean,
  }
}

type PageDispatchProps = {
  sign: (phone: string) => void
}

type PageOwnProps = {}

type PageState = {
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({
  user
}), (dispatch) => ({
  sign: (phone) => {
    dispatch(signAction(phone))
  },
}))
class Index extends Component {

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '我的',
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)

  }
  componentDidMount() {
  }
  componentWillUnmount() {

  }
  public onGetPhoneNumber = (e) => {
    new Promise((reslove) => {
      this.props.sign('111');
      reslove();
    })
      .catch(err => {
        Taro.showModal({
          title: '出错了',
          content: ''
        });
      });
  }
  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { user } = this.props;
    const { isSign = false, userName = '' } = user || {};
    return (
      <View className='container'>
        <Image src={avator} className="avator" />
        {isSign ? <View className='info' >
          <View className='login'>{userName}</View>
          <View className='job'>职位:店员</View>
          <View className="detail"><Image src={list} className="list" />门店编号：001</View>
          <View className="detail"><Image src={address} className="address" />门店名称：XXX大药房</View>
        </View> : <View className='info' >
            <View className='login'>未登录/注册</View>
            <View className='tip'>点击头像可登录注册</View>
          </View>}
        {!isSign ? <Button className="register" open-type="getPhoneNumber" onGetPhoneNumber={this.onGetPhoneNumber}>&nbsp;</Button> : null}
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
