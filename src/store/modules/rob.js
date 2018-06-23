import { findAllApp, delApp, editApp } from  '@/api/rob'

const robot = {
  state : {
    id: '',
    name: '',
    description: '',
    list:[]
  },
  mutations : {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_DESCRIPTION: (state, description) => {
      state.description = description
    },
    SET_LIST:(state,list) =>{
      state.list = list
    }
  },
  actions: {
    //获取applist
    FindAllApp( { commit }, app ){
      const appName = app.name.trim()
      return new Promise((resolve, reject) => {
        findAllApp(appName).then(response => {
          const data = response.data
          if (data.length > 0) {
            //commit('app', data.token)
            state.list.push(data)
          }else{
            reject('getInfo: no data !')
          }
          commit('SET_list', data.list)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
    //修改app信息

    //删除app信息





  }
}

export default robot




