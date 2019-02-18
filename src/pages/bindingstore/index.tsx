import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import ClassNames from 'classnames';
import { queryStore } from '../../services/index';
import { bingdingAction } from '../../actions/user';
import './index.scss'

type PageStateProps = {
}

type PageDispatchProps = {
  bingdingStore: (data: object) => any
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
  bingdingStore: (data) => {
    return dispatch(bingdingAction(data))
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

  componentWillMount () {
    console.log('params', this.$router.params);
  }
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
  }
  componentWillUnmount () {

  }

  componentDidShow () { }

  componentDidHide () { }

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
    queryStore().then((res) => {
      console.log(res, 'res');
      this.setState({
        storeName: '广州科学城店'
      })
    }).catch((error) => {

    })
  }

  public confirm = () => {
    const postData = {

    }
    this.props.bingdingStore(postData).then((res) => {
      console.log(res, 'ressse')
      this.showToast("绑定成功，跳转到对应页面");
    })
  }

  render () {
    const { name, storeNo, storeName } = this.state;

    return (
      <View className="container">
        <View className="inpuWrapName">
          <Input name="name" maxLength={11} placeholder="请输入名字" value={name} onInput={this.getInputChange.bind(this, 'name')} />
        </View>
        <View className="inpuWrapCode">
          <Input type="number" name="code"  placeholder="请输入门店编号" value={storeNo} onInput={this.getInputChange.bind(this, 'storeNo')} />
          <View className="queryWrap" >
            <Button className="query" plain={true} onClick={this.query}>查询</Button>
          </View>
        </View>
        {storeName ? <View className="storeName" >门店名称：<Text>{storeName}</Text></View> : null}
        <Button className={ClassNames("confirm", {"disable": storeName === "" || name === "" || storeNo === ""})} onClick={this.confirm}>确定</Button>
      </View>
    )
  }
}

export default Index as unknown as ComponentClass<PageOwnProps, PageState>
