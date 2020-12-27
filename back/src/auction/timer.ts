export class Timer {
  timerId: NodeJS.Timeout
  timeout: number
  timeLeft: number
  interval: NodeJS.Timeout
  callback: (...args: any[]) => void

  constructor(timeout: number, callback: (...args: any[]) => void) {
    this.timeout = timeout
    this.callback = callback
    this.setTimer()
  }

  setTimer(): void {
    this.timerId = setTimeout(this.callback, this.timeout)
    this.interval = setInterval(() => {
      this.timeLeft--
    }, 1000)
    this.timeLeft = 30
  }

  resetTimer(): void {
    this.deleteTimer()
    this.setTimer()
    this.timeLeft = 30
  }


  deleteTimer(): void {
    clearTimeout(this.timerId)
    clearInterval(this.interval)
  }
}