export const SIGN = 'SIGN'

export const USERINFO = 'USERINFO'

export const BINGDING = 'BINGDING'

export const GETUSERINFO = 'getUserInfo:ok'

export const GETPHONENUMBER = 'getPhoneNumber:ok'

export const GETSESSION = 'GETSESSION'

export const BINDINGPHONE = 'BINDINGPHONE'

export const TEMPORARY = 'TEMPORARY'
export enum ROLE {
  CLERK = 1,
  SHOPOWNER = 4,
  CHAINOWNER = 10,
  NOSTORE = 2,
  DEALERMANAGER = 5,
  DEALERSALEMAN = 6,
  TRIANMANAGER = 7,
  TRIANCHARGE = 8,
  PROJECTCHARGE = 9,
  MARKETREPRESENT = 20,
  CHIANSALEMAN = 11,
  CHAIRMANSALEMAN = 13,
  AREAMANAGER = 14,
  AREASPREADMANAGER = 15,
  REGIONMANAGER = 16,
  REGIONASSIST = 17,
  CITYMANAGER = 18,
  SUPERADMIN = 30
}

export const ROLETEXT = {
  [ROLE.CLERK]: '店员',
  [ROLE.SHOPOWNER]: '店长',
  [ROLE.CHAINOWNER]: '连锁管理员',
  [ROLE.NOSTORE]: '未绑定',
  [ROLE.DEALERMANAGER]: '经销商管理员',
  [ROLE.DEALERSALEMAN]: '经销商业务员',
  [ROLE.TRIANMANAGER]:'培训经理',
  [ROLE.TRIANCHARGE]: '项目主管',
  [ROLE.PROJECTCHARGE]: '项目主管',
  [ROLE.MARKETREPRESENT]: '市场代表',
  [ROLE.CHIANSALEMAN]:'连锁业务员',
  [ROLE.CHAIRMANSALEMAN]: '销售总监',
  [ROLE.AREAMANAGER]: '大区经理',
  [ROLE.AREASPREADMANAGER]: '大区推广经理',
  [ROLE.REGIONMANAGER]: '区域经理',
  [ROLE.REGIONASSIST]: '区域助理',
  [ROLE.CITYMANAGER]: '城市经理',
  [ROLE.SUPERADMIN]: '超级管理员'
}

export const STATUSTYPE = {
  NONACTIVE: 0,
  NORMOL: 1,
  STOP: 2,
  LOGOUT: -1
}

export const LOGINMETHOD = {
  WECHAT: 'wechat',
  PHONE: 'phone',
}