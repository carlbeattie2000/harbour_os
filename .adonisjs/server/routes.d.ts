import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'createCompany': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'storeCompany': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'portal.dashboard': { paramsTuple?: []; params?: {} }
    'view_account.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'add_users.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'add_users.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.home': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vessels.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vessels.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal.dashboard.home': { paramsTuple?: []; params?: {} }
    'create_users.create': { paramsTuple?: []; params?: {} }
    'create_users.store': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'create_accounts.create': { paramsTuple?: []; params?: {} }
    'create_accounts.store': { paramsTuple?: []; params?: {} }
    'containers.create': { paramsTuple?: []; params?: {} }
    'containers.store': { paramsTuple?: []; params?: {} }
    'vessels.pending': { paramsTuple?: []; params?: {} }
    'vessels.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vessels.deny': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'session.create': { paramsTuple?: []; params?: {} }
    'createCompany': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'portal.dashboard': { paramsTuple?: []; params?: {} }
    'view_account.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'add_users.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.home': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vessels.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal.dashboard.home': { paramsTuple?: []; params?: {} }
    'create_users.create': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'create_accounts.create': { paramsTuple?: []; params?: {} }
    'containers.create': { paramsTuple?: []; params?: {} }
    'containers.store': { paramsTuple?: []; params?: {} }
    'vessels.pending': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'session.create': { paramsTuple?: []; params?: {} }
    'createCompany': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'portal.dashboard': { paramsTuple?: []; params?: {} }
    'view_account.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'add_users.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.home': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vessels.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal.dashboard.home': { paramsTuple?: []; params?: {} }
    'create_users.create': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'create_accounts.create': { paramsTuple?: []; params?: {} }
    'containers.create': { paramsTuple?: []; params?: {} }
    'containers.store': { paramsTuple?: []; params?: {} }
    'vessels.pending': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'storeCompany': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'add_users.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vessels.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'create_users.store': { paramsTuple?: []; params?: {} }
    'create_accounts.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'vessels.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vessels.deny': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}