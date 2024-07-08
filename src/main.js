import { createApp } from 'vue'
import router from './router/router'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faPen, faMagnifyingGlass, faUsers, faEye, faTrash, faPenToSquare, faCommentDots, faRightToBracket, faKey, faUserPlus, faUser, faGear, faImage, faEnvelope, faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import './main.css'

library.add(faHouse, faPen, faMagnifyingGlass, faUsers, faEye, faTrash, faPenToSquare, faCommentDots, faRightToBracket, faKey, faUserPlus, faUser, faGear, faImage, faEnvelope, faChevronLeft)

const app = createApp(App)
.component("font-awesome-icon", FontAwesomeIcon)
app.use(router)
app.mount('#app')
