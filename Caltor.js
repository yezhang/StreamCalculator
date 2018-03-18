/**
 * [+]增加数据类型的兼容性，字符串、数字。
 * 
 * 
 */
function InputValue(name, initValue) {
    if (!name) {
        throw new Error('InputValue must have a name.');
    }
    this.name = name;
    if (typeof initValue === 'number') {
        this.value = initValue;
    } else {
        this.value = 0;
    }

    this.rules = [];

    this.outputChangedHandler = function () {};
}

InputValue.prototype.addRule = function(rule) {
    this.rules.push(rule);
}

InputValue.prototype.setValue = function (value) {
    var number = Number(value);
    if (typeof number !== 'number') {
        throw new Error('expected value type: number, got' + (typeof value));
    }
    this.value = number;
}

InputValue.prototype.getValue = function() {
    return this.value;
}

InputValue.prototype.triggerRules = function () {
    var ruleNumber = this.rules.length;
    for (var i = 0; i < ruleNumber; i++) {
        this.rules[i].execute();
    }
}

InputValue.prototype.setInputValue = function (value) {
    this.setValue(value);
    this.triggerRules();
}

InputValue.prototype.setOutputValue = function (value) {
    var oldValue = this.value;
    this.setValue(value);
    this.outputChangedHandler(value, oldValue);
}

InputValue.prototype.setOutputHandler = function (handler) {
    this.outputChangedHandler = handler;
}

function Rule(caltor) {
    var intputNamesCache = [];
    this.inputNames = intputNamesCache;
    var outputNamesCache = [];
    this.outputNames = outputNamesCache;

    if (!caltor instanceof Caltor) {
        throw new Error('a Rule constructor must have a Caltor paramater');
    }

    var innerCaltor = caltor;
    this.caltor = innerCaltor;
    this.inputFetcher = function (paramater){
        if(intputNamesCache.indexOf(paramater) != -1) {
            return innerCaltor.getInput(paramater).getValue();
        }
    }

    this.outputFetcher = function(paramater) {
        if(outputNamesCache.indexOf(paramater) != -1) {
            return innerCaltor.getOutput(paramater);
        }
    }
    this.executionHandler = function (inputFetcher, outputFetcher) {};
}

Rule.prototype.markInput = function (inputName) {
    if (this.inputNames.indexOf(inputName) == -1) {
        this.inputNames.push(inputName);
        this.caltor.getInput(inputName).addRule(this);
    }

    return this;
}

/**
 * 被标记为 fixed 的输入参数，不会触发规则运算。
 * @param {输入值} inputName 
 */
Rule.prototype.markFixedInput = function(inputName) {
    if (this.inputNames.indexOf(inputName) == -1) {
        this.inputNames.push(inputName);
    }

    return this;
}

Rule.prototype.setExpression = function (handler) {
    if (typeof handler === 'function') {
        this.executionHandler = handler;
    }
}

Rule.prototype.markOutput = function (outputName) {
    if (this.outputNames.indexOf(outputName) == -1) {
        this.outputNames.push(outputName);
    }
    return this;
}

Rule.prototype.execute = function () {
    this.executionHandler && this.executionHandler(this.inputFetcher, this.outputFetcher);
}

function Caltor() {
    this.inputsMap = {};
    this.selection = new InputValue('default', 0);
}

/**
 * 定义一个变量，不用显示声明
 * @param {变量名} name 
 */
Caltor.prototype.defineInput = function(name) {
    var inputValue = new InputValue(name, 0);
    this.addInput(inputValue);
}

Caltor.prototype.defineRule = function(name, ruleDef) {
    var ruleName = name;
    var rule = new Rule(this);
    ruleDef.bind(rule)();
}

/**
 * 取出定义的变量
 * @param {String} name  变量名
 */
Caltor.prototype.pickInput = function(name) {
     return this.inputsMap[name];
}

/**
 * 更新变量的值
 * @param {string} name 变量名称
 * @param {string} value 变量值
 */
Caltor.prototype.updateInputValue = function(name, value) {
    if(name === caltor.selection.name) {
        caltor.selection.setInputValue(value);
    }
}

Caltor.prototype.addInput = function (inputValue) {
    if (!inputValue instanceof InputValue) {
        throw new Error('InputValue type is not correct.');
    }
    this.inputsMap[inputValue.name] = inputValue;
}

Caltor.prototype.select = function (name) {
    if (this.inputsMap.hasOwnProperty(name)) {
        this.selection = this.inputsMap[name];
    }

    return this.selection;
}

Caltor.prototype.getInput = function(name) {
    if(this.inputsMap.hasOwnProperty(name)) {
        return this.inputsMap[name]
    }

    return null;
}

Caltor.prototype.getOutput = function(name) {
    return this.getInput(name);
}





