import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import AuthorizeItem from '../../components/authorize-item/index';
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
  user: any
}

type PageDispatchProps = {
}

type PageOwnProps = {
}

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
class Index extends Component<PageOwnProps, PageState> {
  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '登录',
    navigationStyle: 'default',
  }

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { changeuser } = this.$router.params;
    if (!changeuser) {
      const { user } = this.props;
      const { userinfo = {
        nickName: '',
        mobilePhone: '',
      } } = user || {};
      const { mobilePhone = '' } = userinfo || {};

      if (mobilePhone) {
        this.redirectToPage(false);
      } else {
        this.setState({
          show: true,
        })
      }
    } else {
      this.setState({
        show: true,
      })
    }
    


  }
  componentWillReceiveProps(nextProps) {

  }
  
  public redirectToPage = (isSign) => {
    const { page } = this.$router.params;
    return Promise.resolve().then(() => {
      if (page) {
        if (isSign) {
          if (page === 'my') {
            Taro.navigateBack({
              delta: 1,
            })
          } else {
            Taro.redirectTo({
              url: `/pages/${page}/index`
            })
          }
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
  

  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { page } = this.$router.params;
    return (
      <View>
        <AuthorizeItem page={page} onCallBack={this.redirectToPage} />
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
