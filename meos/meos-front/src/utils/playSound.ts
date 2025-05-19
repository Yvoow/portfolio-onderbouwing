import infoNotif from '../../public/sounds/info.mp3'
import errorNotif from '../../public/sounds/error.mp3'
import successNotif from '../../public/sounds/success.mp3'

export const playSound = (type: 'info' | 'error' | 'warning' | 'success') => {
  let audio = new Audio()
  switch (type) {
    case 'info':
      audio.src = infoNotif
      break
    case 'error':
      audio.src = errorNotif
      break
    case 'success':
      audio.src = successNotif
      break
  }
  audio.play()
}
