import React, { Component } from "react";
import $ from "jquery";
import "./Calculator.css";
import PwnzHint from "./PwnzHint";

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: this.props.value || "",
      history: [],
      historyExpanded: false,
      charsAfterComma: this.props.value || this.charsAfterCommaDefault
    };
    this.mainInputRef=React.createRef();
  }

  charsAfterCommaDefault = 5;

  buttons = [
    ["AC"],
    ["Pi", "E"],
    ["cos", "sin", "tan", "ctg"],
    ["sqrt", "cbrt", "abs", "rdm"],
    ["!", "^", "ln", "log"],
    ["(", ")", "%", "mod"],
    ["1", "2", "3", "/"],
    ["4", "5", "6", "*"],
    ["7", "8", "9", "-"],
    ["0", ".", "=", "+"]
  ];

  constants = [
    {
      symb: 'Pi',
      val: Math.PI
    },
    {
      symb: 'E',
      val: Math.exp(1)
    },
    {
      symb: 'Infinity',
      val: +Infinity
    },
    {
      symb: 'rdm',
      val: 'random'
    }
  ]

  methods = [
    //p for priority and f for func
    {
      op: "+",
      p: 2,
      argsQ: 2,
      f: (a, b) => a + b
    },
    {
      op: "-",
      p: 2,
      argsQ: 2,
      f: (a, b) => a - b
    },
    {
      op: "*",
      p: 1,
      argsQ: 2,
      f: (a, b) => a * b
    },
    {
      op: "/",
      p: 1,
      argsQ: 2,
      f: (a, b) => a / b
    },
    {
      op: "mod",//modulo
      p: 1,
      argsQ: 2,
      f: (a, b) => a % b
    },
    {
      op: "^",
      p: 1,
      argsQ: 2,
      f: (a, b) => {
        let k = 1;
        if (a < 0) {
          a *= -1;
          k = -1;
        }
        return k * a ** b; //k is coefficient to avoid errors with negative a argument
      }
    },
    {
      op: "sqrt",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.sqrt(a)
    },
    {
      op: "cbrt",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.cbrt(a)
    },
    {
      op: "exp",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.exp(a)
    },
    {
      op: "abs",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.abs(a)
    },
    {
      op: "cos",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.cos(a)
    },
    {
      op: "tan",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.tan(a)
    },
    {
      op: "ctg",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => 1 / Math.tan(a)
    },
    {
      op: "random",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.random() * a
    },
    {
      op: "sin",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.sin(a)
    },
    {
      op: "!",
      p: 0,
      argsQ: 1,
      pos: "after",
      f: (a) => {
        let res = 1;
        while (a > 0) {
          res *= a;
          a--;
        }
        return res;
      }
    },
    {
      op: "%",
      p: 0,
      argsQ: 1,
      pos: "after",
      f: (a) => a / 100
    },
    {
      op: "ln",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.log(a)
    },
    {
      op: "log",
      p: 0,
      argsQ: 1,
      pos: "before",
      f: (a) => Math.log10(a)
    }
  ];

  brackets = [
    {
      open: "(",
      close: ")"
    }
  ];

  calculate = (str, charsAfterComma) => {
    try {
      function replaceCommasWidthDots(str) {
        return str.replace(/,/, ".");
      }

      function trimOps(str) {
        str = str.replace(/[+-]{2,}/g, (x) => {
          let res = 0;
          for (let i = 0; i < x.length; i++) {
            if (x[i] === "+") res += 2;
            if (x[i] === "-") res += 1;
          }
          return res % 2 === 0 ? "+" : "-";
        }); //plus and minus overs
        return str;
      }

      function checkValid(str) {
        let validChars = ["\\.", "e"];
        validChars.push(...constants.map(item => item.symb));
        brackets.forEach((item) => validChars.push(item.open, item.close));
        methods.forEach((item) => {
          item.op.length === 1
            ? validChars.push(item.op)
            : validChars.push(item.op);
        });
        let validSymbols = validChars.filter(
          (item) => item.toString().length === 1
        );
        let validWords = validChars.filter(
          (item) => item.toString().length > 1
        );
        let validRegExp = new RegExp(
          "[" +
          validSymbols.join("\\") +
          "]|" +
          validWords.join("|") +
          "|\\d+(\\.\\d+)?(e[-+]\\d+)?", //this one for numbers
          "g"
        );

        str = str.match(validRegExp).join("");
        str = trimOps(str);
        str = str.replace(/(?<=\.\d*)\.\d*/g, (x) => ""); // to avoid multiple dots in one number

        return str;
      }

      function checkBrackets(str, brackets) {
        let check = 0;
        str.split("").forEach((item) => {
          if (item === brackets.open) check++;
          if (item === brackets.close) check--;
          if (check < 0) return false;
        });
        return check === 0 ? true : false;
      }

      function calculateBrackets(str, brackets) {
        if (!checkBrackets(str, brackets)) return "Wrong expression";
        let openRegExp = new RegExp("\\" + brackets.open);
        while (str.match(openRegExp)) {
          let subStr;
          let openIndex, closeIndex;
          for (let i = str.length - 1; i >= 0; i--) {
            if (str[i] === brackets.open) {
              openIndex = i;
              i = -1;
            }
          }
          for (let j = openIndex; j < str.length; j++) {
            if (str[j] === brackets.close) {
              closeIndex = j;
              j = str.length;
            }
          }
          subStr = str.slice(openIndex + 1, closeIndex); //+1 coz we dont need brackets
          str = [
            str.slice(0, openIndex),
            calculateStr(subStr),
            str.slice(closeIndex + 1)
          ].join("");
        }
        return str;
      }

      function calculateOp(str, method, index, opBeforeA) {
        str = trimOps(str);
        let a, b;
        let currentMethod = methods.filter(
          (methodObj) => methodObj.op === method
        )[0];
        let methodSymbolLength = currentMethod.op.length;
        let argsQ = currentMethod.argsQ;
        if (argsQ === 1) {
          let pos = currentMethod.pos;
          if (pos === "before") {
            a = str
              .slice(index + methodSymbolLength)
              .match(/^([-+]?\d+(\.\d+)?(e[-+]\d+)?)|(^[+-]?Infinity)/);// .match(/^[-+]?\d+(\.\d+)?(e[-+]\d+)?/);

            return {
              res: currentMethod.f(+a[0]),
              aLength: a[0].length,
              methodSymbolLength: methodSymbolLength
            };
          } else if (pos === "after") {
            a = str.slice(0, index).match(/(\d+(\.\d+)?(e[-+]\d+)?$)|Infinity$/);//  a = str.slice(0, index).match(/\d+(\.\d+)?(e[-+]\d+)?$/);
            return {
              res: currentMethod.f(+a[0]),
              aLength: -a[0].length,
              methodSymbolLength: methodSymbolLength
            };
          }
        } else if (argsQ === 2) {
          a = str.slice(0, index).match(/(\d+(\.\d+)?(e[+-]\d+)?$)|(Infinity$)/);// a = str.slice(0, index).match(/\d+(\.\d+)?(e[+-]\d+)?$/);
          if (a.index === 1 && str[0] === "-") {
            a[0] = str[0] + a[0];
          }

          if (a[0][0] === "+") a[0] = a[0].slice(1);

          b = str
            .slice(index + methodSymbolLength)
            .match(/(^[+-]?\d+(\.\d+)?(e[-+]\d+)?)|(^[+-]?Infinity)/);//.match(/^[+-]?\d+(\.\d+)?(e[-+]\d+)?/);

          return {
            res: currentMethod.f(+a[0], +b[0]),
            aLength: a[0].length,
            bLength: b[0].length,
            methodSymbolLength: methodSymbolLength
          };
        }
      }

      function calculateStr(str) {
        if (str[0] === "+") str = str.slice(1); //we dont need that +
        let scOps = methods
          .filter((method) => method.argsQ === 1)
          .map((method) => method.op); //single argument operators
        let fpOps = methods
          .filter((method) => method.p === 1)
          .map((method) => method.op); //first priority operators
        let spOps = methods
          .filter((method) => method.p === 2)
          .map((method) => method.op); //Second priority operators
        //now we have to turn constants into numbers
        str = str.replace(new RegExp(constants.map(c => c.symb).join('|'), 'g'), (match) => {
          return match = constants.find(c => c.symb === match).val;
        })
        //then we have to do single operators maths
        let scMethodSymbol = str.match(new RegExp(scOps.join("|")));
        while (scMethodSymbol) {
          let { res, aLength, methodSymbolLength } = calculateOp(
            str,
            scMethodSymbol[0],
            scMethodSymbol.index
          );
          str =
            str.slice(0, scMethodSymbol.index + Math.min(0, aLength)) +
            res +
            str.slice(
              scMethodSymbol.index +
              Math.max(0, methodSymbolLength) +
              Math.max(0, aLength)
            );
          scMethodSymbol = str.match(new RegExp(scOps.join("|")));
        }
        //next step is first priority two arguments operators

        let fpMethodSymbol = str.match(
          new RegExp("\\" + fpOps.join("|\\"))
        );
        while (fpMethodSymbol) {
          let { res, aLength, bLength, methodSymbolLength } = calculateOp(
            str,
            fpMethodSymbol[0],
            fpMethodSymbol.index
          );
          str =
            str.slice(0, fpMethodSymbol.index - aLength) +
            res +
            str.slice(fpMethodSymbol.index + methodSymbolLength + bLength);
          fpMethodSymbol = str.match(
            new RegExp("[\\" + fpOps.join("\\") + "]")
          );
        }
        // now we are doing second priotiry two arguments methods
        let opAtStart;
        opAtStart = str[0] === "-" || str[0] === "+" ? 1 : 0;

        let spMethodSymbol = str
          .slice(opAtStart)
          .match(new RegExp("(?<!e)[\\" + spOps.join("\\") + "]"));
        if (spMethodSymbol) spMethodSymbol.index += opAtStart;
        while (spMethodSymbol) {
          let { res, aLength, bLength, methodSymbolLength } = calculateOp(
            str,
            spMethodSymbol[0],
            spMethodSymbol.index
          );

          str =
            str.slice(0, spMethodSymbol.index - aLength) +
            res +
            str.slice(spMethodSymbol.index + methodSymbolLength + bLength);

          opAtStart = str[0] === "-" || str[0] === "+" ? 1 : 0;
          spMethodSymbol = str
            .slice(opAtStart)
            .match(new RegExp("(?<!e)[\\" + spOps.join("\\") + "]"));
          if (spMethodSymbol) spMethodSymbol.index += opAtStart;
        }
        return str;
      }
      let basicValue = "";
      let methods = this.methods;
      let constants = this.constants;
      let brackets = this.brackets;
      str = replaceCommasWidthDots(str);
      if (!str) return basicValue;
      let validStr = checkValid(str);
      if (!validStr) return basicValue;
      if (validStr !== str) return validStr;
      let resultStr = calculateBrackets(str, brackets[0]);
      let result = Number(calculateStr(resultStr)).toFixed(charsAfterComma);
      return Number(result).toString();
    } catch (e) {
      return "Wrong expression";
    }
  };

  handleButtonClick = (e) => {
    let target = $(e.target);
    if (target.text() === "AC") {
      this.setState({
        input: ""
      });
      return;
    }
    let inputVal = this.state.input || "";
    if (target.text() === "=") {
      let inputVal = this.state.input || "";
      if (inputVal === "Wrong expression" || inputVal === "") {
        return;
      }
      let newVal = this.calculate(inputVal, this.state.charsAfterComma);
      //to add space
      inputVal = inputVal.replace(/[*+-/]/g, (x) => " " + x + " ");
      let newHistory = this.state.history;
      newHistory.push({
        ab: inputVal,
        op: "=",
        res: newVal
      });
      this.setState({
        input: newVal,
        history: newHistory
      });
      return;
    }
    this.setState({
      input: inputVal + target.text()
    });
    this.mainInputRef.current.focus();
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === "=") {
      let inputVal = this.state.input || "";
      if (inputVal === "Wrong expression" || inputVal === "") {
        e.preventDefault();
        return;
      }
      let newVal = this.calculate(
        inputVal,
        this.state.charsAfterComma || this.charsAfterCommaDefault
      );
      //to add space
      inputVal = inputVal.replace(/[*+-/]/g, (x) => " " + x + " ");
      let newHistory = this.state.history;
      newHistory.push({
        ab: inputVal,
        op: "=",
        res: newVal
      });
      this.setState({
        input: newVal,
        history: newHistory
      });
      e.preventDefault();
    }
  };

  handleInputChange = (e) => {
    let target = $(e.target);
    let newVal = target.val();
    this.setState({
      input: newVal || ""
    });
  };

  handleCharsAfterCommaChange = (e) => {
    let target = $(e.target);
    let newVal = target.val();
    this.setState({
      charsAfterComma: newVal
    });
  };

  handleCharsAfterCommaBlur = (e) => {
    let target = $(e.target);
    let newVal = target.val() || this.charsAfterCommaDefault;
    this.setState({
      charsAfterComma: newVal
    });
  };

  toggleHistory = () => {
    this.setState({
      historyExpanded: !this.state.historyExpanded
    });
  };

  handleMouseOver = (e) => {
  }

  hintTimer = null;
  timing = 1000;

  handleMouseEnterButton = (e) => {
    const coords = e.target.getBoundingClientRect();
    const yOffset = document.documentElement.scrollTop;
    const xOffset = document.documentElement.scrollLeft;
    const hint = {};
    hint.text = this.hints[e.target.innerText];
    if (!hint.text) return;
    hint.style = {
      top: coords.y + yOffset + coords.height + "px",
      left: coords.x + xOffset + coords.width + "px"
    };
    hint.class = "pwnzHint-active";
    this.hintTimer = setTimeout(() => {
      this.setState({
        hint: hint
      });
    }, this.timing);
  };

  handleMouseLeaveButton = () => {
    const hint = this.state.hint;
    if (!hint) {
      clearTimeout(this.hintTimer);
      return;
    } else {
      hint.class = "pwnzHint-inactive";
      this.setState({
        hint: null
      });
    }
  };

  hints = {
    'Pi': 'Pi - returns mathematical constant 3.14159265359...',
    'E': 'E - returns mathematical constant 2.71828182846...',
    'AC': 'Clears input field',
    'cos': 'cosA - returns cosine of A in radians',
    'sin': 'sinA - returns sine of A in radians',
    'tan': 'tanA - returns tangent of A in radians',
    'ctg': 'ctgA - returns cotangent of A in radians',
    'sqrt': 'sqrtA - returns square root of A',
    'cbrt': 'cbrtA - returns cube root of A',
    'abs': 'absA - returns absolute value of A',
    'rdm': 'rdmA or randomA - returns random number from 0 to A',
    '!': 'A! - returns factorial of A',
    '^': 'A^B - returns the value of A to the power of B',
    'ln': 'lnA - returns the natural logarithm of A',
    'log': 'logA - returns the base-10 logarithm of A',
    '%': 'A% - returns A/100',
    'mod': 'AmodB - returns modulo of A/B',
  }

  render() {
    const buttonsArr = this.buttons;
    const inputValue = this.state.input;
    const history = this.state.history;
    const historyClassName =
      "calc-history " +
      (this.state.historyExpanded ? "history-expanded" : "history-reduced");
    const historyButtonText = this.state.historyExpanded
      ? "Show less"
      : "Show more";

    const charsAfterComma = this.state.charsAfterComma;
    const hint = this.state.hint;

    return (
      <>
        <div className="calc-body">
          <div className="calc-inputs pwnz-f-c">
            <input
              className="calc-expression-input"
              placeholder='Enter expression'
              value={inputValue}
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
              ref={this.mainInputRef}
            ></input>
            <div className='calc-div-for-p'><p>Decimal places:</p></div>
            <input
              value={charsAfterComma}
              onChange={this.handleCharsAfterCommaChange}
              onBlur={this.handleCharsAfterCommaBlur}
              className="calc-chars-after-comma-input"
            ></input>
            <div className='pwnz-bwdm'>
              <div className='pwnz-bwdm-bd'>
                <div className='pwnz-bwdm-b pwnz-t-c pwnz-clickable pwnz-fs25 pwnz-ml10'>?</div>
              </div>
              <div className='pwnz-bwdm-c pwnz-bwdm-downLeft pwnz-p10 pwnz-w400' style={{ display: 'none' }}>
                <span>Example of using operators:
                  <br />
                  operator(A) or operatorA: sqrt(4) = sqrt4 = 2
                  AoperatorB: 4/2 = 2
                  <br />
                  Hold cursor on the operator button to see specified information
                </span>
              </div>
            </div>
          </div>
          <div className="calc-command-area">
            <div className="calc-buttons" onClick={this.handleButtonClick}>
              {buttonsArr.map((buttonsRow) => {
                return (
                  <div className="calc-buttons-row" key={buttonsRow.join("")}>
                    {buttonsRow.map((button) => {
                      return (
                        <>
                          <button key={button} onMouseEnter={this.handleMouseEnterButton} onMouseLeave={this.handleMouseLeaveButton}>{button}</button>
                          {hint ? <PwnzHint hint={hint}></PwnzHint> : null}
                        </>
                      )
                    })}
                  </div>
                );
              })}
            </div>
            <div className={historyClassName}>
              <div className="calc-history-p">
                {history.reverse().map((item, index) => {
                  return (
                    <div className="calc-history-item" key={index}>
                      <p>{item.ab}</p>
                      <p>&nbsp;{item.op}&nbsp;</p>
                      <p>{item.res}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={this.toggleHistory}
                className="calc-history-button"
              >
                {historyButtonText}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Calculator;
