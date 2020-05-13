import toNumber from './toNumber'
import { transitionDuration } from './index'

/* 默认旋转顺序 */
export const defaultRotateOrder = ['x', 'y', 'z']

/* when receive steps from vue props
 * init the steps data for computing
 * transform empty number to default
 * 初始化数据，将参数不足的部分补足
 * */
const initStepData = data => ({
  translate: {
    x: toNumber(data.x),
    y: toNumber(data.y),
    z: toNumber(data.z)
  },
  rotate: {
    x: toNumber(data.rotateX),
    y: toNumber(data.rotateY),
    z: toNumber(data.rotateZ || data.rotate),
    order: data.rotateOrder || defaultRotateOrder
  },
  scale: toNumber(data.scale, 1),
  transitionDuration: data.transitionDuration ? transitionDuration(data.transitionDuration) : null,
  transitionTimingFunction: data.transitionTimingFunction
})

export default initStepData
