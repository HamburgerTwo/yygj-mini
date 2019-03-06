import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Block, Button } from '@tarojs/components'
import Item from '../../components/member-activity-item/item';
import { connect } from '@tarojs/redux'
import { activity } from '../../types/activity';
import { getActivityAction } from '../../actions/activity';
import { User } from '../../types/user';
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
    list: Array<activity>
  }
  user: {
    isSign: boolean,
    userinfo:User,
  }
}

type PageDispatchProps = {
  getActivity: () => Promise<any>
}

type PageOwnProps = {}

type PageState = {}

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
class Index extends Component {

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

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
    
  }
  componentWillMount() {
    const { user } = this.props;
    const { isSign } = user;
    console.log(isSign)
    if(!isSign) {
      Taro.redirectTo({
        url:'/pages/authorize/index?page=memberactivities'
      })
    }
  }

  
  componentDidMount() {
  }
  componentWillUnmount () { 
    
  }

  componentDidShow () {
    const { user, getActivity } = this.props;
    const { isSign } = user;
    if(isSign) {
      getActivity();
    }
   }

  componentDidHide () { }

  render () {
    const { user, activity } = this.props;
    const { isSign = false, userinfo = {
      orgNo: '',
      telephone:''
    } } = user || {};
    const { orgNo, telephone } = userinfo;
    const { list } = activity;
    return (
      <View className={s.index}>
        {isSign ? <Block>
          {list.length > 0 ? list.map(item => (<Item item-class={s.item} name={item.actMenuName} url={`${item.actMenuPath}&storeNo=${orgNo}&userName=${telephone}`} />)): <View className={s.empty}>暂时没有活动</View>}
    
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
