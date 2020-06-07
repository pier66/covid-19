
// html tag
const graphDiv = document.getElementById('graphDiv');

// dates *********************************************
const startDateStr = "24/02/2020";
const endDateStr = "31/05/2020";

const startDateObj = dateStrToObj( startDateStr );
const endDateObj = dateStrToObj( endDateStr );

var displayDates = [];
var startDateObjFor = dateStrToObj( startDateStr );
for( var d = startDateObjFor; d <= endDateObj; d.setDate( d.getDate() + 1 )) {
    displayDates.push( new Date(d) );
};

// SIR model *******************************************************************
// config ************************
const sirStepsPerDay = 10;

var sirN = 5000;
var sirI_0 = 0.002;
var sirR_0 = 0;

var sirBeta = 0.33;
var sirGamma = 1/14;

var sirRepro_0 = sirBeta / sirGamma;
document.getElementById('textRepro_0').innerHTML = sirRepro_0;

// *******************************

var sirS = {};
var sirI = {};
var sirR = {};
var sirIperDay = {};
var sirRperDay = {};

var sStep = [];
var iStep = [];
var rStep = [];

function SIR(){
  sirS = {};
  sirI = {};
  sirR = {};

  sirIperDay = {};
  sirRperDay = {};

  sStep = [];
  iStep = [];
  rStep = [];

  sirRepro_0 = sirBeta / sirGamma;

  sStep[0] = sirN;
  iStep[0] = sirI_0 * sirN;
  rStep[0] = sirR_0;

  var i = 0;
  for( var d = 0; d < displayDates.length; d++ ) {

    sirS[dateObjToStr(displayDates[d])] = sStep[i];
    sirI[dateObjToStr(displayDates[d])] = iStep[i];
    sirR[dateObjToStr(displayDates[d])] = rStep[i];

    for( var s = 1; s <= sirStepsPerDay; s++ ){
      sStep[i+1] = sStep[i] - ( sirBeta / sirN ) * sStep[i] * iStep[i] / sirStepsPerDay;
      iStep[i+1] = iStep[i] + ( ( sirBeta / sirN ) * sStep[i] * iStep[i] - sirGamma * iStep[i] ) / sirStepsPerDay;
      rStep[i+1] = rStep[i] + sirGamma * iStep[i] / sirStepsPerDay;
      i++;
    };

    sirIperDay[dateObjToStr(displayDates[d])] = - ( sStep[i-1] - sirS[dateObjToStr(displayDates[d])] );
    sirRperDay[dateObjToStr(displayDates[d])] = - ( rStep[i-1] - sirR[dateObjToStr(displayDates[d])] );

  }
};


// plot ************************************************************************

SIR();

//v SIR_DDE();

var detectedPerCentPerDay =
    multiplyValues(
      divideValues(
        getValuesReadyToPlot( covidPlusPerDay ),
        getValuesReadyToPlot( testedPerDay )
      ), 100
    );


var infected =
    cumulateValues (
      addValues(
        addValues(
          getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ),
          multiplyValues( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ) , -1 )
        ),
        multiplyValues( getValuesReadyToPlot( gonePerDay ), -1 )
      )
    );

var infectedSmoothed =
      smoothValues(
        cumulateValues (
          addValues(
            addValues(
              getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ),
              multiplyValues( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ) , -1 )
            ),
            multiplyValues( getValuesReadyToPlot( gonePerDay ), -1 )
          )
        )
      );

var deltaBetaLockdown =
    multiplyValues(
      addValues(
        infectedSmoothed,                                   // infected smoothed
        multiplyValues( getValuesReadyToPlot( sirI ), -1 )  // -I
      ), 1 / ( sirStepsPerDay  ) );  // * sirFactor


/*
'#1f77b4',  // muted blue
'#ff7f0e',  // safety orange
'#2ca02c',  // cooked asparagus green
'#d62728',  // brick red
'#9467bd',  // muted purple
'#8c564b',  // chestnut brown
'#e377c2',  // raspberry yogurt pink
'#7f7f7f',  // middle gray
'#bcbd22',  // curry yellow-green
'#17becf'   // blue-teal
*/


Plotly.newPlot(
  graphDiv,
  [
  {
    name: 'detected per day',
    marker: {color: '#d62728'},
  	x: displayDates,
  	y: getValuesReadyToPlot( covidPlusPerDay ),
    type: 'bar'
  },
  {
    name: 'tested per day',
    marker: {color: '#bbbbbb'},
  	x: displayDates,
  	y: getValuesReadyToPlot( testedPerDay ),
    type: 'bar'
  },
  {
    name: '% detected per day',
    marker: {color: '#ff7f0e'},
    x: displayDates,
    y: detectedPerCentPerDay,
    type: 'bar'
  },
  {
    name: 'infected per day',
    marker: {color: '#8c564b'},
  	x: displayDates,
  	y: getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ),
    type: 'bar'
  },

  {
    name: 'infected per day smoothed',
    marker: {color: '#d62728'},
    x: displayDates,
    y: smoothValues( getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ) ),
    type: 'bar'
  },
  {
    name: 'recovered per day',
    marker: {color: '#2ca02c'},
  	x: displayDates,
  	y: multiplyValues( getValuesReadyToPlot( recoveredPerDay ), -1 ),
    type: 'bar'
  },
  {
    name: 'recovered per day -8 days',
    marker: {color: '#bcbd22'},
    x: displayDates,
    y: multiplyValues( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ), -1),
    type: 'bar',
    barmode: 'stack',
    xaxis: 'x1'
  },
  {
    name: 'recovered per day -8 days smoothed',
    marker: {color: '#2ca02c'},
    x: displayDates,
    y: multiplyValues( smoothValues( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ) ), -1),
    type: 'bar'
  },
  {
    name: 'lethal cases per day',
    marker: {color: '#1f77b4'},
    x: displayDates,
    y: multiplyValues( getValuesReadyToPlot( gonePerDay ), -1 ),
    type: 'bar',
    barmode: 'stack',
    xaxis: 'x1'
  },
  {
    name: 'infected',
    marker: {color: '#e377c2'},
    x: displayDates,
    y: infected,
    type: 'bar'
  },
  {
    name: 'infected smoothed',
    marker: {color: '#9467bd'},
    x: displayDates,
    y: infectedSmoothed,
    type: 'bar'
  },
  {
    name: 'SIR susceptible',
    marker: {color: '#17becf'},
    x: displayDates,
    y: getValuesReadyToPlot( sirS )
  },
  {
    name: 'SIR infected',
    marker: {color: '#9467bd'},
    x: displayDates,
    y: getValuesReadyToPlot( sirI )
  },
  {
    name: 'SIR recovered',
    marker: {color: '#bcbd22'},
    x: displayDates,
    y: getValuesReadyToPlot( sirR )
  },
  {
    name: 'SIR infected per day',
    marker: {color: '#d62728'},
    x: displayDates,
    y: getValuesReadyToPlot( sirIperDay )
  },
  {
    name: 'SIR recovered per day',
    marker: {color: '#2ca02c'},
    x: displayDates,
    y: getValuesReadyToPlot( sirRperDay )
  } /*,
  {
    name: 'SIR DDE susceptible',
    marker: {color: '#17becf'},
    x: displayDates,
    y: getValuesReadyToPlot( sirSdde )
  },
  {
    name: 'SIR DDE infected',
    marker: {color: '#9467bd'},
    x: displayDates,
    y: getValuesReadyToPlot( sirIdde )
  },
  {
    name: 'SIR DDE recovered',
    marker: {color: '#bcbd22'},
    x: displayDates,
    y: getValuesReadyToPlot( sirRdde )
  }*/
],
{
  margin: { t: 20 } }
);


function updateGraph(){
  SIR();
  document.getElementById('textRepro_0').innerHTML = sirRepro_0;

  Plotly.deleteTraces( graphDiv, [/*-8,-7,-6,*/-5,-4,-3, -2, -1] );
  // SIR_DDE();

  var data = [
    {
      name: 'SIR susceptible',
      marker: {color: '#17becf'},
      x: displayDates,
      y: getValuesReadyToPlot( sirS )
    },
    {
      name: 'SIR infected',
      marker: {color: '#9467bd'},
      x: displayDates,
      y: getValuesReadyToPlot( sirI )
    },
    {
      name: 'SIR recovered',
      marker: {color: '#bcbd22'},
      x: displayDates,
      y: getValuesReadyToPlot( sirR )
    },
    {
      name: 'SIR infected per day',
      marker: {color: '#d62728'},
      x: displayDates,
      y: getValuesReadyToPlot( sirIperDay )
    },
    {
      name: 'SIR recovered per day',
      marker: {color: '#2ca02c'},
      x: displayDates,
      y: getValuesReadyToPlot( sirRperDay )
    }/*,
    {
      name: 'SIR DDE susceptible',
      marker: {color: '#17becf'},
      x: displayDates,
      y: getValuesReadyToPlot( sirSdde )
    },
    {
      name: 'SIR DDE infected',
      marker: {color: '#9467bd'},
      x: displayDates,
      y: getValuesReadyToPlot( sirIdde )
    },
    {
      name: 'SIR DDE recovered',
      marker: {color: '#bcbd22'},
      x: displayDates,
      y: getValuesReadyToPlot( sirRdde )
    } */
] ;
  Plotly.addTraces( graphDiv, data );
};

function updateN(val) {
    sirN = parseFloat(val);
    document.getElementById('textN').value = val;
    updateGraph();
};

function updateI_0(val) {
    sirI_0 = parseFloat(val);
    document.getElementById('textI_0').value = val;
    updateGraph();
};

function updateBeta(val) {
    sirBeta = parseFloat(val);
    document.getElementById('textBeta').value = val;
    updateGraph();
};

function updateGamma(val) {
    sirGamma = 1 / parseFloat(val);
    document.getElementById('textGamma').value = val;
    updateGraph();
};
