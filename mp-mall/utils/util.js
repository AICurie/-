export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
export const formaDate = date => {
  
  const month = date.getMonth() + 1
  const day = date.getDate() + 1
  return formatNumber(month) + '月' + formatNumber(day) + '日'
}


export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export default {
  formatTime: formatTime,
  formaDate
}
