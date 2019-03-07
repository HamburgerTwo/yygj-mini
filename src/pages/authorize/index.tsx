import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GETUSERINFO, GETPHONENUMBER } from '../../constants/user';
import { goToAction } from '../../actions/activity'
import { decodeData } from '../../services/index';
import s from './index.module.scss'
import { User } from '../../types/user';
import classnames from 'classnames';
import { saveUserInfoAction, bindingPhoneAction } from '../../actions/user';
import { DbqbUrl } from '../../config';

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
    current: string
  }
  user: {
    identity: string,
    userinfo: User,
    authToken: string,
    isSign: boolean,
  }
}

type PageDispatchProps = {
  goTo: (url: string) => Promise<any>,
  saveUserInfo: (userinfo: User) => void,
  bindingPhone: (phone: string) => Promise<any>,
}

type PageOwnProps = {
}

type PageState = {
  nickName: string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  userinfo: any,
}

@connect(({ activity, user }) => ({
  activity,
  user,
}), (dispatch) => ({
  goTo: (url) => {
    return Promise.resolve().then(() =>
      dispatch(goToAction(url))
    )
  },
  saveUserInfo(user) {
    dispatch(saveUserInfoAction(user));
  },
  bindingPhone(phone) {
    return Promise.resolve().then(() => dispatch(bindingPhoneAction(phone)))
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
    navigationBarTitleText: '授权页',
    navigationStyle: 'default',
  }

  constructor(props) {
    super(props);
    this.state = {
      nickName: '',
    }
  }
  componentWillMount() {
    const { user } = this.props;
    const { userinfo = {
      nickName: '',
      telephone: '',
    } } = user || {};
    const { nickName = '', telephone = '' } = userinfo || {};
    this.userinfo = {};
    if (!nickName) {
      Taro.getUserInfo().then((res) => {
        console.log(res)
        this.userinfo = res.userInfo;
        this.setState({
          nickName: res.userInfo.nickName,
        })
      })
    } else {
      if (telephone) {
        this.redirectToPage();
      } else {
        this.userinfo = userinfo;
        this.setState({
          nickName,
        })
      }
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  public onGetPhoneNumber = (e) => {
    const {
      errMsg,
      encryptedData,
      iv
    } = e.detail;
    const { user,
      bindingPhone,
    } = this.props;
    if (errMsg === GETPHONENUMBER) {
      decodeData(user.identity, encryptedData, iv).then((res) => (
        bindingPhone(res.purePhoneNumber))
      ).then((res) => {
        Taro.setStorageSync('jwt', res.payload.authToken);
        const {
          avatarUrl,
          nickName,
          gender
        } = this.userinfo;
        this.props.saveUserInfo({
          nickName,
          gender,
          headimg: avatarUrl,
        })
      }
      ).then(() => {
        this.redirectToPage();
      })
        .catch(err => {
          console.log()
          Taro.showToast({
            title: '出错了',
            icon: 'none'
          });
        });
    }
  }
  public redirectToPage = () => {
    const { user,
      goTo } = this.props;
    const { page } = this.$router.params;
    console.log(user)
    return goTo(`${DbqbUrl}?jwt=${Taro.getStorageSync('jwt')}&t=${new Date().getTime()}`).then(() => {
      if (page && page !== 'news') {
        if (user.isSign) {
          Taro.redirectTo({
              url: `/pages/${page}/index`
            })
        } else {
          Taro.redirectTo({
            url: `/pages/roleselection/index?page=${page}`
          })
        }
      } else {
        Taro.navigateBack({
          delta: 1,
        })
      }
    })

  }
  public onGetUserInfo = (e) => {
    if (e.detail.errMsg === GETUSERINFO) {
      const { nickName, } = e.detail.userInfo;
      this.userinfo = e.detail.userInfo
      this.setState({
        nickName,
      })
    }
  }


  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { nickName } = this.state;
    const { user } = this.props;
    const { userinfo = {
      telephone: '',
    } } = user || {};
    const { telephone = '' } = userinfo || {};
    return ( telephone ? null :
      <View>
        <View className={s.tip}>第一步</View>
        <Button className={classnames(s.login,
          {
            [s.disabled]: nickName,
          })} open-type="getUserInfo" disabled={!!nickName} onGetUserInfo={this.onGetUserInfo} type="primary">绑定个人信息</Button>

        <View className={s.tip}>第二步</View>
        <Button className={classnames(s.login,
          {
            [s.disabled]: !nickName,
          })} open-type="getPhoneNumber" disabled={!nickName} onGetPhoneNumber={this.onGetPhoneNumber} type="primary">绑定手机</Button>
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
