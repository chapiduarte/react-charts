import React, { Component } from "react";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";
import { Button } from "devextreme-react";
import {
  errorNumBox,
  warningNumBox,
  rangeNumBox,
  maxNumBox,
  minNumBox
} from "./NumberBoxTemplate";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import { notifyTemplate } from "./NotifyTemplate";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.dark.css";
import "intro.js/introjs.css";
import "./App.css";

am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);
require("dotenv-expand")(require("dotenv").config());
const socketIOClient = require("socket.io-client");
var socket = socketIOClient.connect("http://localhost:3000");
console.log(socket);
socket.on("connection", function(client) {
  console.log("connect");

  client.on("disconnect", function() {
    console.log("disconnect");
  });
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      endpoint: "http://localhost:3000",
      data: [],
      rageData: [],
      max: 100,
      min: -100,
      errorThresh: 99,
      warningThresh: 98,
      range: 10,
      used: [],
      items: [],
      stepsEnabled: false,
      steps: [
        {
          element: ".firstStep",
          intro: `This page will show an error notification when the random number provided is >= to this number.
             To change this number just enter a number and click enter`
        },
        {
          element: ".secondStep",
          intro: `This page will show a warning notification when the random number provided is >= to this number and < than the error threshold. 
            To change this number just enter a number and click enter`
        },
        {
          element: ".thirdStep",
          intro: `This value is read only and it represents the assumption that the lowest random number will be -100 `
        },
        {
          element: ".fourthStep",
          intro: `This value is read only and it represents the assumption that the highest random number will be 100 `
        },
        {
          element: ".fifthStep",
          intro: `This number is used to create the group range. To change this number just enter a number and click enter or focus out. 
          Please note we don't store previous values so when this value is changed we will reload the graph and begin grouping using the new desired range`
        }
      ]
    };
  }
  showNotifies(col) {
    if (
      col["value"] &&
      parseInt(col["value"]) >= this.state.warningThresh &&
      parseInt(col["value"]) < this.state.errorThresh
    ) {
      notifyTemplate(
        `${parseInt(col["value"])} is  >= to the warning threshold ${
          this.state.warningThresh
        }`,
        "warning",
        5000
      );
    } else if (
      col["value"] &&
      parseInt(col["value"]) >= this.state.errorThresh
    ) {
      notifyTemplate(
        `${parseInt(col["value"])} is >= to the error threshold ${
          this.state.errorThresh
        }`,
        "error",
        5000
      );
    }
  }
  changeErrorThresh = e => {
    this.setState({ errorThresh: e.value });
  };
  helpButtonClick = e => {
    this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
  };
  changeWarningThresh = e => {
    this.setState({ warningThresh: e.value });
  };
  changeRange = e => {
    this.setState({ range: e.value, used: [], items: [] });
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.range !== prevState.range) {
      this.barGraph.dispose();
      this.createBarGraph();
    }
  }
  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);

    this.createLineGraph();
    this.createBarGraph();

    socket.on("data", col => {
      let i;
      let used = this.state.used;
      let items = this.state.items;
      let min = this.state.min;
      let max = this.state.max;
      let range = this.state.range;

      this.showNotifies(col);

      //on the backend I saw the min random # is -100 and max is 100 therefore we loop in that range and group by groups of 10 (using the given example)
      for (i = min; i < max; i += range) {
        //if the val is between the min and max
        if (i + range > col["value"] && col["value"] >= i) {
          //used array includes any ranges that exist, if range doesn't exist we push it to items and add it to used array
          if (!used.includes(`${i} to ${i + range}`)) {
            items.push({
              qty: 1,
              order: i, //order is i , this helps to put the bars in the correct order from -100 to 100
              category: `${i} to ${i + range}`
            });
            used.push(`${i} to ${i + range}`);
          } else {
            //if range exists we up the qty by 1
            items.filter(item => {
              if (item.category === `${i} to ${i + range}`) {
                item.qty = item.qty + 1;
              }
            });
          }
        }
      }

      //sort the categories to display by order key
      items.sort(function(a, b) {
        // Compare order vals
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
      });

      this.barGraph.data = items;
      this.chart.addData(col);
    });
  }
  componentWillUnmount() {
    //dispose charts
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.barGraph) {
      this.barGraph.dispose();
    }
  }

  createBarGraph() {
    let barGraph = am4core.create("barChart", am4charts.XYChart);
    barGraph.data = this.state.rageData;
    // Create axes
    var categoryAxis = barGraph.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.title.text = "Ranges";

    //value axis cofig
    var valueAxis = barGraph.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Count of Numbers in Range";

    // Create series
    var series = barGraph.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "qty";
    series.dataFields.categoryX = "category";
    series.tooltipText = "Count: {valueY.value}";
    series.fill = am4core.color("#67B7DC");
    series.width = 50;
    series.tooltip.getFillFromObject = true;
    series.name = "qty";
    series.minBulletDistance = 15;

    //cursor
    barGraph.cursor = new am4charts.XYCursor();

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target) {
      return barGraph.colors.getIndex(target.dataItem.index);
    });

    //adding scrollbar using the series vals
    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    barGraph.scrollbarX = scrollbarX;

    //graph title config
    let title = barGraph.titles.create();
    title.text = `Values in ranges of ${this.state.range}`;
    title.fontSize = 25;
    title.fill = am4core.color("#FFF");
    title.marginBottom = 30;

    //exporting config
    barGraph.exporting.menu = new am4core.ExportMenu();
    barGraph.exporting.filePrefix = `barGraph`;

    this.barGraph = barGraph;
  }
  createLineGraph() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.data = this.state.data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.dateFormats.setKey("second", "ss");
    dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
    dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
    dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
    dateAxis.renderer.inside = true;
    dateAxis.renderer.axisFills.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = true;
    dateAxis.title.text = "Timestamp";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.interpolationDuration = 500;
    valueAxis.rangeChangeDuration = 500;
    valueAxis.renderer.inside = false;
    valueAxis.renderer.minLabelPosition = 0.05;
    valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.title.text = "Value";

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "timestamp";
    series.dataFields.valueY = "value";
    series.interpolationDuration = 500;
    series.defaultState.transitionDuration = 0;
    series.tensionX = 0.8;

    series.tooltipText = "Value: {valueY.value}";
    chart.cursor = new am4charts.XYCursor();
    series.fill = am4core.color("#67B7DC");
    series.width = 50;
    series.tooltip.getFillFromObject = false;
    series.name = "Value";
    series.tooltip.background.fill = am4core.color("#67B7DC");
    series.minBulletDistance = 15;

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#FFF");

    var bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    chart.events.on("datavalidated", function() {
      dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true);
    });

    dateAxis.interpolationDuration = 500;
    dateAxis.rangeChangeDuration = 500;

    // all the below is optional, makes some fancy effects
    // gradient fill of the series
    series.fillOpacity = 1;
    var gradient = new am4core.LinearGradient();
    gradient.addColor(chart.colors.getIndex(0), 0.2);
    gradient.addColor(chart.colors.getIndex(0), 0);

    series.fill = gradient;

    // this makes date axis labels to fade out
    dateAxis.renderer.labels.template.adapter.add("fillOpacity", function(
      fillOpacity,
      target
    ) {
      var dataItem = target.dataItem;
      return dataItem.position;
    });

    // need to set this, otherwise fillOpacity is not changed and not set
    dateAxis.events.on("validated", function() {
      am4core.iter.each(dateAxis.renderer.labels.iterator(), function(label) {
        label.fillOpacity = label.fillOpacity;
      });
    });

    // bullet at the front of the line
    var bulletFinal = series.createChild(am4charts.CircleBullet);
    bulletFinal.circle.radius = 8;
    bulletFinal.fill = chart.colors.getIndex(2);
    bulletFinal.fillOpacity = 1;
    bulletFinal.isMeasured = true;

    series.events.on("validated", function() {
      if (typeof series.dataItems.last !== "undefined") {
        bulletFinal.moveTo(series.dataItems.last.point);
        bulletFinal.validatePosition();
      }
    });
    let title = chart.titles.create();
    title.text = `Values by Timestamp`;
    title.fontSize = 25;
    title.fill = am4core.color("#FFF");
    title.marginBottom = 30;

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = `reactChart`;

    this.chart = chart;
  }
  onExit = () => {
    this.setState(() => ({ stepsEnabled: false }));
  };

  render() {
    return (
      <div className="container">
        <Steps
          enabled={this.state.stepsEnabled}
          steps={this.state.steps}
          initialStep={0}
          onExit={this.onExit}
        />
        {errorNumBox(this)}
        {warningNumBox(this)}
        {minNumBox(this)}
        {maxNumBox(this)}
        <div className="displayBlock marginLeft15px">
          <Button
            icon="info"
            onClick={this.helpButtonClick}
            hint="Click to see how to use this page"
          />
        </div>
        <div id="chartdiv" className="charts"></div>
        {rangeNumBox(this)}
        <div id="barChart" className="charts"></div>
      </div>
    );
  }
}

export default App;
