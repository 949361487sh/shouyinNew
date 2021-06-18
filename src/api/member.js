import request from '@/utils/request'

export function getMember(data) {
  return request({
    url: '/cashRegister/getMember',
    method: 'post',
    data
  })
}
export function getMemberList(data) {
  return request({
    url: '/cashRegister/getMemberList',
    method: 'post',
    data
  })
}
export function upMember(data) {
  return request({
    url: '/cashRegister/upMember',
    method: 'post',
    data
  })
}
export function delMember(data) {
  return request({
    url: '/cashRegister/delMember',
    method: 'post',
    data
  })
}
