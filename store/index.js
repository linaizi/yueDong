import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
const state = {
  Token: '',
  UserInfo: '',
	willUrl:'/pages/index/index',
	plateform:0,
	inviteCode:uni.getStorageSync('inviteCode'),
	isFlw:false,//是否关注公众号
}


const mutations = {
  //将Token保存到sessionStorage里，Token表示登陆状态
  SET_TOKEN: (state, data) => {
    state.Token = data
  },

  SET_USERINFO: (state, data) => {
    state.UserInfo = data
  },

  SET_WILLURL: (state, data) => {
    state.willUrl = data
  },
	
	SET_plateform: (state, data) => {
	  state.plateform = data
	},
	
	SET_inviteCode: (state, data) => {
	  state.inviteCode = data
		uni.setStorageSync('inviteCode', data)
	},
	
	SET_ISFLW: (state,data) => {
	  state.isFlw = data
	},

}

const actions = {
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
})




// this.$store.commit('SET_TOKEN', res.user_table_id)
// this.$store.state.Token



