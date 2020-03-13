import colors from '../mixins/BiggColorsAndIcons';

const biggStatusColorPicker = (type, key, value) => (
  colors[type].find(item => item[key] === value) ?
  colors[type].find(item => item[key] === value)
  :
  colors[type].find(item => item[key] === 'Default')
)

export default biggStatusColorPicker