import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, OpenData } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Select from '../../components/input-item/select';
import InputItem from '../../components/input-item/input';
import { getArea } from '../../services/index';
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
    userName: string,
    isSign: boolean,
  }
}

type selectItem = {
  id: number,
  value: string,
}

type PageDispatchProps = {
  sign: (phone: string) => void
}

type PageOwnProps = {}

type PageState = {
  areaList: Array<selectItem>,
  areaSelected: selectItem,
  storeList: Array<selectItem>,
  storeSelected: selectItem,
  name: string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({
  user
}), (dispatch) => ({
  sign: (phone) => {

  },
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
    navigationBarTitleText: '注册',
  }
  constructor(props) {
    super(props);
    this.state = {
      areaList: [],
      areaSelected:
      {
        id: 2,
        value: '大区2'
      },
      storeList: [],
      storeSelected:
      {
        id: 0,
        value: '大区1'
      },
      name: ''
    }

  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)

  }
  componentDidMount() {
  }
  componentWillMount() {
    getArea().then((res) => {
      this.setState({
        areaList: [{
          id: 1,
          value: '大区1'
        },
        {
          id: 2,
          value: '大区2'
        }],
      })
    })
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
  public onChangeArea = (e) => {
    this.setState({
      areaSelected
        : e,
    })
  }
  public onChangeName = (e) => {
    this.setState({
      name
        : e,
    })
    console.log(e)
  }
  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { areaList, areaSelected, name } = this.state;
    return (
      <View className={s.container}>
        <View className={s.item}>
          <Text className={s.label}>头像</Text>
          <View className={s.img}>
            <OpenData className={s.avator} type="userAvatarUrl" />
          </View>
        </View>
        <Select name='大区' onChange={this.onChangeArea} selectedItem={areaSelected} list={areaList} />
        <InputItem name='姓名' onChange={this.onChangeName} value={name} />
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
