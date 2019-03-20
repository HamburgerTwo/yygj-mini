import { ComponentClass } from 'react';


// type ComposedComponent<IProps,IState> = (component: ComponentClass<IProps,IState>) => ComponentClass<IProps,IState>
// type ShareCompose<IProps,IState> = () => ComposedComponent<IProps,IState>
// interface IwithShare {
//   <IProps= {},IDispatch = {}, IState = {},>(): ComponentClass<IProps,IState>
// }


// type InferableComponentEnhancerWithProps =
//     <IComponent>(component: IComponent) => IComponent

// interface IwithShare {
//   (
//   ): InferableComponentEnhancerWithProps
// }

const withShare: any = () => {

  // 设置默认
  const defalutPath = 'pages/index/index';
  const defalutTitle = '夺宝奇兵';

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
