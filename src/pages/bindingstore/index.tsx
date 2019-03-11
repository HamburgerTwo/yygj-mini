import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import ClassNames from 'classnames';
import { findOrganizationByIdOrNo } from '../../services/store';
import { saveUserInfoAction, bindEmployeeRoleAction } from '../../actions/user';
import { User } from '../../types/user'
import { ROLE } from '../../constants/user';
import './index.scss'

type PageStateProps = {
}

type PageDispatchProps = {
  saveUserInfo: (user: User) => any
  bindEmployeeRole: (user: any) => any
}

type PageOwnProps = {}

type PageState = {
  name: string,
  storeNo: string,
  storeName: string,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({

}) => ({
}), (dispatch) => ({
  saveUserInfo: (user) => {
    return Promise.resolve().then(() => dispatch(saveUserInfoAction(user)));
  },
  bindEmployeeRole: (user) => {
    return Promise.resolve().then(() => dispatch(bindEmployeeRoleAction(user)));
  },
}))

class Index extends Component<IProps, PageState> {

  config: Config = {
    navigationBarTitleText: '绑定门店',
  }
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      storeNo: '',
      storeName: '',
    }
  }

  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() { }

  componentDidHide() { }

  // tips
  showToast(text) {
    Taro.showToast({
      title: text,
      icon: 'none',
    });
  }

  public getInputChange = (item, event) => {
    const value = event.target.value;
    const stateObj = {};
    stateObj[item] = value;
    this.setState(stateObj);
  }

  public query = () => {
    const { storeNo } = this.state;
    if (!storeNo) {
      Taro.showToast({
        title: '请输入门店编号',
        icon: 'none'
      })
      return
    }
    findOrganizationByIdOrNo(this.state.storeNo).then((res) => {
      this.setState({
        storeName: res.orgName
      })
    }).catch((error) => {
      Taro.showToast({
        title: error.data.message || '出错了',
        icon: 'none'
      })
    })
  }

  public confirm = () => {
    const { name, storeNo, storeName } = this.state;
    const { role, page } = this.$router.params;
    if (!name) {
      Taro.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    } else if (!storeName) {
      Taro.showToast({
        title: '请输入门店',
        icon: 'none'
      })
    }
    Promise.resolve().then(() => (role === ROLE.CLERK.toString() ? this.props.saveUserInfo({
      memberName: name,
      orgNo: storeNo,
      roles: [ROLE.CLERK],
      orgName: storeName
    }) : this.props.bindEmployeeRole({
      memberName: name,
      orgNo: storeNo,
      roleType: ROLE.SHOPOWNER,
      orgName: storeName
    }).then(() => {
      return Taro.showModal({
        title: '消息',
        content: '你的账号已提交审核，请耐心等待审核',
        confirmText: '知道了',
        showCancel: false,
      })
    })))
    .then((res) => {
        if (page === 'my') {
          Taro.navigateBack({
            delta: 1
          });
        } else {
          Taro.redirectTo({
            url: `/pages/${page}/index`
          })
        }
    }).catch((err) => {
      Taro.showToast({
        title: err.data.message || '出错了',
        icon: 'none'
      })
    })
  }

  render() {
    const { name, storeNo, storeName } = this.state;

    return (
      <View hover-class='none' className="container">
        <View className="inpuWrapName">
          <Input name="name" maxLength={11} placeholder="请输入名字" value={name} onInput={this.getInputChange.bind(this, 'name')} />
        </View>
        <View className="inpuWrapCode">
          <Input type="number" name="code" placeholder="请输入门店编号" value={storeNo} onInput={this.getInputChange.bind(this, 'storeNo')} />
          <View className="queryWrap" >
            <Button className="query" plain={true} onClick={this.query}>查询</Button>
          </View>
        </View>
        {storeName ? <View className="storeName" >门店名称：<Text>{storeName}</Text></View> : null}
        <Button className={ClassNames("confirm", { "disable": storeName === "" || name === "" || storeNo === "" })} onClick={this.confirm}>确定</Button>
      </View>
    )
  }
}

export default Index as unknown as ComponentClass<PageOwnProps, PageState>
