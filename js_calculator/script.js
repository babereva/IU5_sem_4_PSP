window.onload = function() {

  let a = ''
  let b = ''
  let expressionResult = ''
  let selectedOperation = null

  const outputElement = document.getElementById("result")
  const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')

  function updateDisplay(value) {
    outputElement.innerHTML = value
  }

  function onDigitButtonClicked(digit) {
    if (!selectedOperation) {
      if ((digit != '.') || (digit == '.' && !a.includes('.'))) {
        a += digit
      }
      updateDisplay(a)
    } else {
      if ((digit != '.') || (digit == '.' && !b.includes('.'))) {
        b += digit
        updateDisplay(b)
      }
    }
  }

  digitButtons.forEach(function(button) {
    button.onclick = function() {
      onDigitButtonClicked(button.innerHTML)
    }
  })

  document.getElementById("btn_op_mult").onclick = function() {
    if (a === '') return
    selectedOperation = 'x'
  }

  document.getElementById("btn_op_plus").onclick = function() {
    if (a === '') return
    selectedOperation = '+'
  }

  document.getElementById("btn_op_minus").onclick = function() {
    if (a === '') return
    selectedOperation = '-'
  }

  document.getElementById("btn_op_div").onclick = function() {
    if (a === '') return
    selectedOperation = '/'
  }

  document.getElementById("btn_op_clear").onclick = function() {
    a = ''
    b = ''
    selectedOperation = null
    expressionResult = ''
    updateDisplay(0)
  }

  document.getElementById("btn_op_sign").onclick = function() {
    if (a === '') return
    if (!selectedOperation) {
      a = (-(+a)).toString()
      updateDisplay(a)
    } else {
      b = (-(+b)).toString()
      updateDisplay(b)
    }
  }

  document.getElementById("btn_op_equal").onclick = function() {
    if (a === '' || b === '' || !selectedOperation) return

    switch (selectedOperation) {
      case 'x':
        expressionResult = (+a) * (+b)
        break
      case '+':
        expressionResult = (+a) + (+b)
        break
      case '-':
        expressionResult = (+a) - (+b)
        break
      case '/':
        if (+b === 0) {
          updateDisplay('Ошибка')
          a = ''
          b = ''
          selectedOperation = null
          return
        }
        expressionResult = (+a) / (+b)
        break
      default:
        break
    }

    a = expressionResult.toString()
    b = ''
    selectedOperation = null
    updateDisplay(a)
  }

  document.getElementById("btn_op_sqrt").onclick = function() {
    if (a === '') return
    if (+a < 0) {
      updateDisplay('Ошибка')
      return
    }
    a = Math.sqrt(+a).toString()
    updateDisplay(a)
  }

  document.getElementById("btn_op_square").onclick = function() {
    if (a === '') return
    a = ((+a) * (+a)).toString()
    updateDisplay(a)
  }

  document.getElementById("btn_op_000").onclick = function() {
    if (!selectedOperation) {
      a += '000'
      updateDisplay(a)
    } else {
      b += '000'
      updateDisplay(b)
    }
  }

  document.getElementById("btn_op_factorial").onclick = function() {
    if (a === '') return
    const num = parseInt(+a)
    if (num < 0 || !Number.isInteger(+a)) {
      updateDisplay('Ошибка')
      return
    }
    let result = 1
    for (let i = 2; i <= num; i++) {
      result *= i
    }
    a = result.toString()
    updateDisplay(a)
  }

  document.getElementById("btn_op_backspace").onclick = function() {
    if (!selectedOperation) {
      a = a.slice(0, -1)
      updateDisplay(a === '' ? 0 : a)
    } else {
      b = b.slice(0, -1)
      updateDisplay(b === '' ? 0 : b)
    }
  }

  document.getElementById("btn_op_portion").onclick = function() {
    if (a === '') return
    const portion = (+a) / 6
    a = portion.toString()
    updateDisplay(a + ' мл')
  }

}
