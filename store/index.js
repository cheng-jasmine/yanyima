import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    qyMemberIds: '',// 用户ids
    userName: '',// 用户姓名
    idCard: '',// 用户身份证号
    userPhone: '',// 用户手机号
    userIdCardType: "IDENTITY_CARD", // 用户证件类型
    isScan: true,// 是否扫码进入
    familyIds: '0',// 代领人ids 
    familyAgentList: [],//{guanxi: "9",id_card: "xx",ids: "xxx",mobile: "xxx",name: "xx",id_card_type: "IDENTITY_CARD"}
  },
  getters: {

  },
  mutations: {
    SET_USER_NAME(state, value) {
      state.userName = value
    },
    SET_QY_MEMBER_IDS(state, value) {
      state.qyMemberIds = value;
    },
    SET_USER_PHONE(state, value) {
      state.userPhone = value
    },
    SET_ID_CARD(state, value) {
      state.idCard = value;
    },
    SET_SCAN_STATE(state, value) {
      state.isScan = value;
    },
    SET_FAMILY_IDS(state, value) {
      state.familyIds = value;
    },
    SET_FAMILY_ANGET_LIST(state, value) {
      state.familyAgentList = value;
    },
    SET_USER_ID_CARD_TYPE(state, value) {
      state.userIdCardType = value;
    }
  },
  actions: {},
})
export default store
