import type {PluginOptions} from 'vue-toastification'
import Toast, {POSITION} from 'vue-toastification'

// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'

const optionsToast: PluginOptions = {
  timeout: 5000,
  position: POSITION.BOTTOM_RIGHT,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
}

export {
  Toast,
  optionsToast,
}
