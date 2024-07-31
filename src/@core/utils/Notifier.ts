import { useToast } from 'vue-toastification'

class Notifier {
  private notifier: ReturnType<typeof useToast>
  constructor() {
    this.notifier = useToast()
  }

  success(message: string): void {
    this.notifier.success(message, {
      timeout: 5000,
    })
  }

  error(message: string): void {
    this.notifier.error(message, {
      timeout: 5000,
    })
  }

  warning(message: string): void {
    this.notifier.warning(message, {
      timeout: 5000,
    })
  }

  info(message: string): void {
    this.notifier.info(message, {
      timeout: 5000,
    })
  }
}

export default Notifier
