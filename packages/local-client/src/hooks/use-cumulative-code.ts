import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    const showFunc = ` 
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = function(value) {
        const root = document.querySelector('#root');
        if (typeof value === 'object') {
                  console.log('value', value)
          if (value.$$typeof && value.props) {
            ReactDOM.render(value, root)
          } else {
            root.innerHTML = JSON.stringify(value)
          }
        } else {
          root.innerHTML = value
        }
      }
    `;
    const showFuncNoop = "var show = () => {}";

    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
