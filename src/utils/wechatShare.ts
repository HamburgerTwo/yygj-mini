import { Component } from 'react';


interface IwithShare {
  <IStateProps = {}, IDispatchProps = {}, IOwnProps = {}, IStore = any>(
): Component<IStateProps & IDispatchProps, IOwnProps>
}




const withShare: any = () => {

  // 设置默认
  const defalutPath = 'pages/index/index';
  const defalutTitle = '汤臣倍健夺宝奇兵';

  return function shareComponent(Component) {      
    // redux里面的用户数据

    class WithShare extends Component {
      async componentWillMount() {

        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }

      // 点击分享的那一刻会进行调用
      onShareAppMessage() {
        return {
          title: defalutTitle,
          path: defalutPath,
        };
      }

      render() {
        return super.render();
      }
    }

    return WithShare;
  };
}

export default withShare;
