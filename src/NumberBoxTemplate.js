import React from "react";
import { NumberBox } from "devextreme-react/number-box";
import { RequiredRule, Validator } from "devextreme-react/validator";
export function errorNumBox(prop) {
  return (
    <div className="firstStep displayBlock marginLeft">
      <div className="Errlabel">Error Threshold</div>
      <div className="Errvalue">
        <NumberBox
          defaultValue={prop.state.errorThresh}
          showSpinButtons={true}
          disabled={false}
          width={"120px"}
          onValueChanged={prop.changeErrorThresh}
          max={prop.state.max}
          min={prop.state.min}
        >
          <Validator>
            <RequiredRule message="Error threshold is required" />
          </Validator>
        </NumberBox>
      </div>
    </div>
  );
}

export function warningNumBox(prop) {
  return (
    <div className="secondStep displayBlock">
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
        >
          <Validator>
            <RequiredRule message="Warning threshold is required" />
          </Validator>
        </NumberBox>
      </div>
    </div>
  );
}

export function rangeNumBox(prop) {
  return (
    <div className="fifthStep groupingClass">
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
        >
          <Validator>
            <RequiredRule message="Range is required" />
          </Validator>
        </NumberBox>
      </div>
    </div>
  );
}

export function maxNumBox(prop) {
  return (
    <div className="fourthStep displayBlock">
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
    <div className="thirdStep displayBlock">
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
