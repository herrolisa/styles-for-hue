function changeColor (color) {
  return {
    type: 'CHANGE_COLOR',
    data: {
      backgroundColor: color
    }
  }
}

export default changeColor;