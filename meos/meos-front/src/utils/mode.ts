export default function changeMode() {
  const mode = localStorage.getItem('fusionMode')
  if (mode === 'light') {
    localStorage.setItem('fusionMode', 'dark')
    document.documentElement.classList.add('dark')
  } else {
    localStorage.setItem('fusionMode', 'light')
    document.documentElement.classList.remove('dark')
  }
}
