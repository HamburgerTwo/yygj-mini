import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import avator from '../../assets/avator.png';
import arrow2 from '../../assets/icon-arrow2.png';
import arrow3 from '../../assets/icon-arrow3.png';
import list from '../../assets/icon-list.png';

import address from '../../assets/icon-address.png';
import { User } from '../../types/user';
import { ROLETEXT } from '../../constants/user'
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
  user: {
    isSign: boolean,
    userinfo: User,
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
    disableScroll: true,
  }

  componentWillReceiveProps(nextProps) {

  }
  componentDidMount() {
  }
  componentWillUnmount() {

  }
  public goAuthorize = (e) => {

    const { user } = this.props;
    const { userinfo = {
      nickName: '',
      mobilePhone: '',
    }, isSign = false } = user || {};
    const { mobilePhone = '' } = userinfo || {};
    if (!isSign) {
      if (mobilePhone) {
        Taro.navigateTo({
          url: '/pages/roleselection/index?page=my'
        })
      } else {
        Taro.navigateTo({
          url: '/pages/authorize/index?page=my'
        })

      }
    }

  }
  public onSwtichUser = () => {
    Taro.navigateTo({
      url: '/pages/authorize/index?page=my&&changeuser=true'
    })

  }
  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { user } = this.props;
    const { isSign = false, userinfo = {
      headimg: '', memberName: '', orgNo: '', orgName: '', roles: []
    } } = user || {};
    const { headimg = '', mobilePhone, memberName, orgName, orgNo, roles, nickName } = userinfo;
    let job = '店员';
    if (roles && roles.length > 0) {
      job = ROLETEXT[roles[0]];
    }
    return (
      <View className={s.container} onClick={this.goAuthorize}>
        <View className={s.avator}>
          <Image src={avator} />
          {mobilePhone ? <Image src={headimg} /> : null}
        </View>
        
        {isSign ? <View className={s.info} >
          <View className={s.login}>{memberName}</View>
          <View className={s.job}>职位:{job}</View>
          <View className={s.detail}><Image src={list} className={s.list} />门店编号：{orgNo}</View>
          <View className={s.detail}><Image src={address} className={s.address} />门店名称：{orgName}</View>
        </View> : mobilePhone ? <View className={s.info}>
        <View className={s.name}>
        <View className={s.login}>{nickName}</View>
        <View className={s.improve}>绑定门店<Image src={arrow3} className={s.arrow3} /></View>
        </View>
        <View className={s.right}><Image src={arrow2} className={s.arrow2}/></View>
        </View>:<View className={s.info} >
            <View className={s.login}>未登录/注册</View>
            <View className={s.tip}>点击头像可登录注册</View>
          </View>}
        {mobilePhone ? <Button className={s.swtichBtn} type="default" onClick={this.onSwtichUser}>
          切换账号
        </Button> : null}
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
