import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Block } from '@tarojs/components'
import Item from '../../components/member-activity-item/item';
import { connect } from '@tarojs/redux'
import { activity } from '../../types/activity';
import { getActivityAction } from '../../actions/activity';
import { User } from '../../types/user';
import s from './index.module.scss'
import { isAuthorized } from '../../utils/authorize';
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
    list: Array<activity>
  }
  user: {
    isSign: boolean,
    userinfo: User,
  }
}

type PageDispatchProps = {
  getActivity: () => Promise<any>
}

type PageOwnProps = {}

type PageState = {
  showContent: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}
@connect(({ activity, user }) => ({
  activity,
  user,
}), (dispatch) => ({
  getActivity() {
    return Promise.resolve().then(() => dispatch(getActivityAction));
  }
}))
class Index extends Component<PageOwnProps,PageState> {

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '会员活动',
    navigationStyle: "default"
  }
  constructor(props) {
    super(props)
    this.state = {
      showContent: false,
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    
  }


  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() {
    const { user, getActivity } = this.props;
    const { isSign = false} = user;
    if (isAuthorized(this) && !isSign) {
      Taro.redirectTo({
        url: '/pages/authorize/index?page=memberactivities'
      })
    }
    if(isSign){
      getActivity().catch((error) => {
        const { data = {}} = error;
        Taro.showToast({
          title: data.message || '出错了',
          icon: 'none'
        })
      })
    }
   
  }

  componentDidHide() { }

  render() {
    const { user, activity } = this.props;
    const { isSign = false, userinfo = {
      orgNo: '',
      mobilePhone: '',
      status: 0,
    } } = user || {};
    const { orgNo, mobilePhone } = userinfo;
    const { showContent } = this.state;
    const { list } = activity;
    return (
      <View className={s.index}>
        {isSign && showContent ? <Block>
          {list.length > 0 ? list.map(item => (<Item item-class={s.item} name={item.actMenuName} url={`${item.actMenuPath}&storeNo=${orgNo}&userName=${mobilePhone}`} />)) : <View className={s.empty}>暂时没有活动</View>}
        </Block> : null}
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
