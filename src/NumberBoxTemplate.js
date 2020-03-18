import React from "react";
import { NumberBox } from "devextreme-react/number-box";

export function errorNumBox(prop) {
  return (
    <div className="displayBlock marginLeft">
      <div className="Errlabel">Error Threshold</div>
      <div className="Errvalue">
        <NumberBox
          defaultValue={prop.state.errorThresh}
          showSpinButtons={true}
          showClearButton={true}
          disabled={false}
          width={"120px"}
          onValueChanged={prop.changeErrorThresh}
          max={prop.state.max}
          min={prop.state.min}
        />
      </div>
    </div>
  );
}

export function warningNumBox(prop) {
  return (
    <div className="displayBlock">
      <div className="Errlabel">Warning Threshold</div>
      <div className="Errvalue">
        <NumberBox
          defaultValue={prop.state.warningThresh}
          showSpinButtons={true}
          showClearButton={true}
          disabled={false}
          width={"120px"}
          onValueChanged={prop.changeWarningThresh}
          max={prop.state.max}
          min={prop.state.min}
        />
      </div>
    </div>
  );
}

export function rangeNumBox(prop) {
  return (
    <div className="groupingClass">
      <div className="Errlabel">Bar Graph Range Grouping</div>
      <div className="Errvalue">
        <NumberBox
          defaultValue={prop.state.range}
          onValueChanged={prop.changeRange}
          showSpinButtons={true}
          showClearButton={true}
          disabled={false}
          max={prop.state.max}
          min={0}
        />
      </div>
    </div>
  );
}

export function maxNumBox(prop) {
  console.log(prop);
  return (
    <div className="displayBlock">
      <div className="Errlabel">Max Random #</div>
      <div className="Errvalue">
        <NumberBox
          defaultValue={prop.state.max}
          showSpinButtons={true}
          showClearButton={true}
          disabled={true}
        />
      </div>
    </div>
  );
}

export function minNumBox(prop) {
  return (
    <div className="displayBlock">
      <div className="Errlabel">Min Random #</div>
      <div className="Errvalue">
        <NumberBox
          defaultValue={prop.state.min}
          showSpinButtons={true}
          showClearButton={true}
          disabled={true}
        />
      </div>
    </div>
  );
}
