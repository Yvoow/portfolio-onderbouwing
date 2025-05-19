import { createStore } from 'vuex'
import user from '@/store/modules/user'
import notification from '@/store/modules/notification'
import servervars from '@/store/modules/servervars'

export default createStore({
  modules: {
    user,
    notification,
    servervars,
  }
})
