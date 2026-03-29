window.onload = function(){

// Переключатель темы
const themeButton = document.getElementById('themeButton');
const themeDropdown = document.getElementById('themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');

if (themeButton && themeDropdown && themeOptions.length) {
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', theme);
        themeOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.theme === theme) {
                opt.classList.add('selected');
            }
        });
        themeButton.innerHTML = theme === 'dark' ? '🌙 Тема ▾' : '☀️ Тема ▾';
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('show');
    });

    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            setTheme(option.dataset.theme);
            themeDropdown.classList.remove('show');
        });
    });

    document.addEventListener('click', (e) => {
         if (!themeButton.contains(e.target) && !themeDropdown.contains(e.target)) {
            themeDropdown.classList.remove('show');
        }
    });
}

function formatResult(value) {
    if (value === 'Error' || value === '' || value === '-') return value;
    let num = parseFloat(value);
    if (isNaN(num)) return value;
    if (value <= 10**10) return num;
    return num.toPrecision(10);
}

    const outputElement = document.getElementById("result");
    if (!outputElement) return;

    let a = ''           // Первое число
    let b = ''           // Второе число
    let expressionResult = ''  // Результат вычисления
    let selectedOperation = null  // Выбранная операция

    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')
        function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if ((digit != '.') || (digit == '.' && !a.includes(digit))) {
               a += digit;
            }
            outputElement.innerHTML = a === '' ? 0 : formatResult(a);
        }
        else {
            if ((digit != '.') || (digit == '.' && !b.includes(digit))) {
                b += digit;
                outputElement.innerHTML = b === '' ? 0 : formatResult(b);
            }
        }
    }


    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        }
    });

    document.getElementById("btn_op_mult").onclick = function() {
        if (a === '') return;
        selectedOperation = 'x';
    }
    document.getElementById("btn_op_plus").onclick = function() {
        if (a === '') return;
        selectedOperation = '+';
    }
    document.getElementById("btn_op_minus").onclick = function() {
        if (a === '') return;
        selectedOperation = '-';
    }
    document.getElementById("btn_op_div").onclick = function() {
        if (a === '') return;
        selectedOperation = '/';
    }
    document.getElementById("btn_op_clear").onclick = function() {
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        outputElement.innerHTML = 0
    }
    document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || b === '' || !selectedOperation)
            return

        switch(selectedOperation) {
            case 'x':
                expressionResult = (+a) * (+b)
                break;
            case '+':
                expressionResult = (+a) + (+b)
                break;
            case '-':
                expressionResult = (+a) - (+b)
                break;
            case '/':
                expressionResult = (+a) / (+b)
                break;
            default:
                break;
        }

        a = formatResult(expressionResult);
        b = ''
        selectedOperation = null

        outputElement.innerHTML = a
    }

    document.getElementById("btn_op_sign").onclick = function() {

        if (!selectedOperation) {

            if (a === '' || a === '-') return;
            a = formatResult(parseFloat(a) * -1);
            outputElement.innerHTML = a;
        } else {

            if (b === '' || b === '-') return;
            b = formatResult(parseFloat(b) * -1);
            outputElement.innerHTML = b;
        }
    }

    document.getElementById("btn_op_percent").onclick = function() {
    if (!selectedOperation) {

        if (a === '' || a === '-') return;
        a = formatResult(parseFloat(a) / 100);
        outputElement.innerHTML = a;
    } else {

        if (b === '' || b === '-') return;
        let aNum = parseFloat(a);
        let bNum = parseFloat(b);

        let percentValue = aNum * bNum / 100;
        b = formatResult(percentValue);
        outputElement.innerHTML = b;
    }
}

document.getElementById("btn_op_del").onclick = function() {
    if (!selectedOperation) {
        if (a === '' || a === '-') {
            a = '';
            outputElement.innerHTML = 0;
            return;
        }
        a = a.slice(0, -1);
        if (a === '' || a === '-') {
            outputElement.innerHTML = 0;
        } else {
            outputElement.innerHTML = a;
        }
    } else {
        if (b === '' || b === '-') {
            b = '';
            outputElement.innerHTML = 0;
            return;
        }
        b = b.slice(0, -1);
        if (b === '' || b === '-') {
            outputElement.innerHTML = 0;
        } else {
            outputElement.innerHTML = b;
        }
    }
};

document.getElementById("btn_op_sqrt").onclick = function() {
    if (!selectedOperation) {
        if (a === '' || a === '-') return;
        let num = parseFloat(a);
        if (num < 0) {
            outputElement.innerHTML = 'Error';
            return;
        }
        a = formatResult(Math.sqrt(num));
        outputElement.innerHTML = a;
    } else {
        if (b === '' || b === '-') return;
        let num = parseFloat(b);
        if (num < 0) {
            outputElement.innerHTML = 'Error';
            return;
        }
        b = formatResult(Math.sqrt(num));
        outputElement.innerHTML = b;
    }
};

document.getElementById("btn_op_pow2").onclick = function() {
    if (!selectedOperation) {
        if (a === '' || a === '-') return;
        let num = parseFloat(a);
        a = formatResult(num * num);
        outputElement.innerHTML = a;
    } else {
        if (b === '' || b === '-') return;
        let num = parseFloat(b);
        b = formatResult(num * num);
        outputElement.innerHTML = b;
    }
};

document.getElementById("btn_op_ln").onclick = function() {
    if (!selectedOperation) {
        if (a === '' || a === '-') return;
        let num = parseFloat(a);
        if (num <= 0) {
            outputElement.innerHTML = 'Error';
            return;
        }
        a = formatResult(Math.log(num));
        outputElement.innerHTML = a;
    } else {
        if (b === '' || b === '-') return;
        let num = parseFloat(b);
        if (num <= 0) {
            outputElement.innerHTML = 'Error';
            return;
        }
        b = formatResult(Math.log(num));
        outputElement.innerHTML = b;
    }
};


};
