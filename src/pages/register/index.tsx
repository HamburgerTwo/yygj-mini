import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, OpenData } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Select from '../../components/input-item/select';
import InputItem from '../../components/input-item/input';
import { saveUserInfoAction } from '../../actions/user';
import { getArea, getDirstict, getChain } from '../../services/index';
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
  saveUserInfo: (user) => void
}

type PageOwnProps = {}

type PageState = {
  areaList: Array<selectItem>,
  areaSelected: selectItem,
  districtList: Array<selectItem>,
  districtSelected: selectItem,
  chainList: Array<selectItem>,
  chainSelected: selectItem,
  name: string,
  storeName: string,
  phone: string,
  id: number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({
  user
}), (dispatch) => ({
  saveUserInfo: (user) => {
    dispatch(saveUserInfoAction(user));
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
      districtList: [],
      districtSelected:
      {
        id: 0,
        value: '请选择'
      },
      chainList: [],
      chainSelected:
      {
        id: 0,
        value: '请选择'
      },
      name: '',
      storeName: '',
      phone: '',
      id: 0
    }

  }
  componentWillReceiveProps(nextProps) {

  }
  componentDidMount() {
  }
  componentWillMount() {
    if (this.state.areaSelected.id) {
      getDirstict(this.state.areaSelected.id).then(() => {
        this.setState({
          districtList: [{
            id: 1,
            value: '片区1'
          },
          {
            id: 2,
            value: '片区2'
          }],
        })
      })
    }
    if(this.state.districtSelected.id){
      getChain(this.state.districtSelected.id).then(() => {
        this.setState({
          districtList: [{
            id: 1,
            value: '连锁1'
          },
          {
            id: 2,
            value: '连锁2'
          }],
        })
      })
    }
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

  public onChangeDistrict = (e) => {
    getChain(e.id).then(() => {
      this.setState({
        districtSelected
        : e,
        chainList: [{
          id: 1,
          value: '连锁1'
        },
        {
          id: 2,
          value: '连锁2'
        }],
        chainSelected: {
          id: 0,
          value: '请选择'
        },
      })
    })
    this.setState({
      
    })
  }
  public onChangeArea = (e: selectItem) => {
    getDirstict(e.id).then(() => {
      this.setState({
        areaSelected
          : e,
        districtList: [{
          id: 1,
          value: '片区1'
        },
        {
          id: 2,
          value: '片区2'
        }],
        districtSelected: {
          id: 0,
          value: '请选择'
        },
        chainList: [],
        chainSelected: {
          id: 0,
          value: '请选择'
        },
      })
    })
  }

  public onChangeChain = (e) => {
    this.setState({
      chainSelected
        : e,
    })
  }
  

  public onChange = (name: 'name' | 'storeName' | 'phone', e) => {
    const stateObj = {};
    stateObj[name] = e;
    this.setState(stateObj);
  }
  public onSubmit = () => {
    const {
      areaSelected,
      districtSelected,
      name,
      chainSelected,
      storeName,
      id,
      phone } = this.state;
    this.props.saveUserInfo({
      id,
      name,
      phone,
      area: areaSelected.id,
      district: districtSelected.id,
      chain: chainSelected.id,
      store: storeName,
    })
  }
  componentDidShow() { }

  componentDidHide() { }

  render() {
    const {
      areaList,
      areaSelected,
      districtSelected,
      name,
      districtList,
      chainSelected,
      chainList,
      storeName,
      phone } = this.state;
    return (
      <View className={s.container}>
        <View className={s.item}>
          <Text className={s.label}>头像</Text>
          <View className={s.img}>
            <OpenData className={s.avator} type="userAvatarUrl" />
          </View>
        </View>
        <Select name='大区' onChange={this.onChangeArea} selectedItem={areaSelected} list={areaList} />
        <Select name='片区' onChange={this.onChangeDistrict} selectedItem={districtSelected} list={districtList} />
        <Select name='连锁' onChange={this.onChangeChain} selectedItem={chainSelected} list={chainList} />
        <InputItem name='门店' onChange={this.onChange.bind(this,'storeName')} value={storeName} />
        <InputItem name='姓名' onChange={this.onChange.bind(this,'name')} value={name} />
        <InputItem name='电话' type='number' onChange={this.onChange.bind(this,'phone')} value={phone} />
        <Button className={s.btn} onClick={this.onSubmit}>确定</Button>
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
