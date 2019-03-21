import { STATUSTYPE, ROLE } from '../constants/user'
import { STORESTATUS } from '../constants/activity'
import Taro from '@tarojs/taro'
export const isAuthorized = (page): boolean => {
  const { user} = page.props;
    const { userinfo = {} } = user || {};
    const { status = 1, roles = [], orgStatus = 0 } = userinfo;
    let showContent = true;
    let statusTxt = '未激活';
    let storeTxt = '停用';

    let message = '';
    if(status === STATUSTYPE.STOP) {
      statusTxt ='已停用'
    } else if(status === STATUSTYPE.LOGOUT) {
      statusTxt ='已注销'
    }
    if(orgStatus === STORESTATUS.FORZEN) {
      storeTxt = '冻结'
    }
    if (status !== STATUSTYPE.NORMOL) {
      message = `该账号${statusTxt}`;
      showContent = false;
    }  else if (orgStatus !== STORESTATUS.NORMAL) {
      message = `门店已${storeTxt}`;
      showContent = false;
    } else if (roles.filter(x => !(x === ROLE.CLERK || x === ROLE.NOSTORE || x === ROLE.SHOPOWNER || x=== ROLE.SUPERADMIN)).length > 0) {
      message = '您的账号无权限体验';
      showContent = false;
    }
    if(!showContent) {
      Taro.showModal({
        title: '消息',
        content: message,
        confirmText: '我知道了',
        showCancel: false,
      }).then(() => {
        Taro.navigateBack({
          delta:1,
        })
      })
    }
    page.setState({
      showContent
    })
    return showContent;
}