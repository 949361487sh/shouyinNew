import request from '@/utils/request'

export function getType(data) {
  return request({
    url: '/commodity/getType',
    method: 'post',
    data
  })
}
export function addType(data) {
  return request({
    url: '/commodity/addType',
    method: 'post',
    data
  })
}
export function addCommodity(data) {
  return request({
    url: '/commodity/addCommodity',
    method: 'post',
    data
  })
}
export function getStock(data) {
  return request({
    url: '/commodity/getStock',
    method: 'post',
    data
  })
}
export function searchStock(data) {
  return request({
    url: '/commodity/searchStock',
    method: 'post',
    data
  })
}
export function uploadFile(data) {
  return request({
    url: '/commodity/uploadFile',
    method: 'post',
    data
  })
}
export function delStock(data) {
  return request({
    url: '/commodity/delStock',
    method: 'post',
    data
  })
}
export function searchStockAdd(data) {
  return request({
    url: '/commodity/searchStockAdd',
    method: 'post',
    data
  })
}
export function addMember(data) {
  return request({
    url: '/cashRegister/addMember',
    method: 'post',
    data
  })
}
export function newOrders(data) {
  return request({
    url: '/commodity/newOrders',
    method: 'post',
    data
  })
}
export function searchOderNumber(data) {
  return request({
    url: '/commodity/searchOderNumber',
    method: 'post',
    data
  })
}
export function searchOderNumberStock(data) {
  return request({
    url: '/commodity/searchOderNumberStock',
    method: 'post',
    data
  })
}
export function delOrder(data) {
  return request({
    url: '/commodity/delOrder',
    method: 'post',
    data
  })
}
