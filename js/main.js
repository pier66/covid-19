
// html tag
const graphDiv = document.getElementById('graphDiv');

// display dates *********************************************
const startDateStr = "01/02/2020";
const endDateStr = "31/05/2020";

const startDateObj = dateStrToObj( startDateStr );
const endDateObj = dateStrToObj( endDateStr );

var displayDates = [];
var startDateObjFor = dateStrToObj( startDateStr );
for( var d = startDateObjFor; d <= endDateObj; d.setDate( d.getDate() + 1 )) {
    displayDates.push( new Date(d) );
};

var dateRangeArr = [ dateObjToStr2( startDateObj ), dateObjToStr2( endDateObj ) ];


// plot ************************************************************************

var sir = new SIR();
var sirResult = sir.compute();

var sirS = sirResult.S
var sirI = sirResult.I;
var sirR = sirResult.R;
var sirIperDay = sirResult.IperDay;
var sirRperDay = sirResult.RperDay;
var stageAB = sirResult.stageAB;
var stageBC = sirResult.stageBC;

//v SIR_DDE();

var detectedPerCentPerDay =
    multiplyValues(
      divideValues(
        getValuesReadyToPlot( covidPlusPerDay ),
        getValuesReadyToPlot( testedPerDay )
      ), 100
    );


var infected =
    accumulateValues (
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
        accumulateValues (
          addValues(
            addValues(
              getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ),
              multiplyValues( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ) , -1 )
            ),
            multiplyValues( getValuesReadyToPlot( gonePerDay ), -1 )
          )
        )
      );


var infectedPerDaySmoothed = smoothValues(
  getValuesReadyToPlot(
    translateValuesByDays( covidPlusPerDay, -8 )
  )
);

var infectedPerDayPerAccumulatedPercent =
  multiplyValues(
    divideValues(
      infectedPerDaySmoothed,
      accumulateValues( infectedPerDaySmoothed )
    ),
    100
);

/*

var deltaBetaLockdown =
  multiplyValues(
    addValues(
      infectedSmoothed,                                   // infected smoothed
      multiplyValues( getValuesReadyToPlot( sirI ), -1 )  // -I
    ),
    1 / ( sirStepsPerDay  )
  );
*/


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

function staticData(){
  return [
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
      y: infectedPerDaySmoothed,
      type: 'bar'
    },
    {
      name: 'infected per day versus accumulated (%)',
      marker: {color: '#aaaaaa'},
      x: displayDates,
      y: infectedPerDayPerAccumulatedPercent,
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
    }
  ]
};

function sirData(){
  return [
    {
      name: 'SIR susceptible',
      marker: {color: '#17becf'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.S )
    },
    {
      name: 'SIR infected',
      marker: {color: '#9467bd'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.I )
    },
    {
      name: 'SIR recovered',
      marker: {color: '#bcbd22'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.R )
    },
    {
      name: 'SIR infected per day',
      marker: {color: '#d62728'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.IperDay )
    },
    {
      name: 'SIR recovered per day',
      marker: {color: '#2ca02c'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.RperDay )
    }
  ]
};

function getStageRectangles(){
  return [
        // phase A
        {
            type: 'rect',
            // x-reference is assigned to the x-values
            xref: 'x',
            // y-reference is assigned to the plot paper [0,1]
            yref: 'paper',
            x0: dateStrToObj( sir.t_0 ),
            y0: 0,
            x1: sirResult.stageAB,
            y1: 1,
            fillcolor: '#FF5733',
            opacity: 0.2,
            line: {
                width: 0
            }
        },
        // phase B
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: sirResult.stageAB,
            y0: 0,
            x1: sirResult.stageBC,
            y1: 1,
            fillcolor: '#FFC300',
            opacity: 0.2,
            line: {
                width: 0
            }
        },
        // phase C
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: sirResult.stageBC,
            y0: 0,
            x1: endDateObj,
            y1: 1,
            fillcolor: '#48C9B0',
            opacity: 0.2,
            line: {
                width: 0
            }
        }
    ];
};

function getLockDownLine(){
  return [
    {
      type: 'line',
      xref: 'x',
      yref: 'paper',
      x0: '2020-03-16',
      y0: 0,
      x1: '2020-03-16',
      y1: 1,
      line: {
        color: 'rgb(55, 128, 191)',
        width: 2
      }
    }
  ];
};

function getSirT_0Line(){
  return [
    {
      type: 'line',
      xref: 'x',
      yref: 'paper',
      x0: dateStrToObj( sir.t_0 ),
      y0: 0,
      x1: dateStrToObj( sir.t_0 ),
      y1: 1,
      line: {
        color: 'rgb(55, 128, 191)',
        width: 2
      }
    }
  ];
};

function getStageLabels(){
  return [
  {
    x: averageOfDateObj( dateStrToObj( sir.t_0 ), sirResult.stageAB ),
    y: 0.99,
    xref: 'x',
    yref: 'paper',
    text: 'Stage A',
    showarrow: false
  },
  {
    x: averageOfDateObj( sirResult.stageAB, sirResult.stageBC ),
    y: 0.99,
    xref: 'x',
    yref: 'paper',
    text: 'Stage B',
    showarrow: false
  },
  {
    x: averageOfDateObj( sirResult.stageBC, endDateObj ),
    y: 0.99,
    xref: 'x',
    yref: 'paper',
    text: 'Stage C',
    showarrow: false
  }
]
};

Plotly.newPlot(
  graphDiv,
  staticData().concat( sirData() ),
  {
    margin: { t: 20 },
    shapes: [],
    annotations: []
      /*,
    xaxis: {
      autorange: true,
      range: dateRangeArr,
      rangeslider: { range: dateRangeArr },
      type: 'date'
    } */
  }/*,
  { responsive: true }
  */
);


function showHideStagesLockdown() {
  var shapes = [];
  var stageLabels = [];
  if ( document.getElementById('checkboxStages').checked == true ){
    shapes = shapes.concat( getStageRectangles() );
    stageLabels = getStageLabels();
  };

  if ( document.getElementById('checkboxLockDown').checked == true ){
    shapes = shapes.concat( getLockDownLine() );
  };

  if ( document.getElementById('checkboxT_0').checked == true ){
    shapes = shapes.concat( getSirT_0Line() );
  };

  Plotly.relayout( graphDiv, {
    shapes: shapes,
    annotations: stageLabels
  });
 };

function updateGraph(){
  sirResult = sir.compute();

  Plotly.deleteTraces( graphDiv, [/*-8,-7,-6,*/-5,-4,-3, -2, -1] );
  Plotly.addTraces( graphDiv, sirData() );

  showHideStagesLockdown();
};


function updateT_0( val ) {
  console.log(val);

  sir.setParams( { 't_0': val } );
  // sirT_0 = val;
  updateGraph();
};

function updateN( val ) {
    // sirN = parseFloat(val);
    sir.setParams( { 'S_0': parseFloat(val) } );
    document.getElementById('textN').value = val;
    updateGraph();
};

function updateI_0( val ) {
    // sirI_0 = parseFloat( val / sirN );
    sir.setParams( { 'I_0': parseFloat( val / sir.S_0 ) } );

    document.getElementById('textI_0').value = val;
    updateGraph();
};

function updateBeta(val) {
    //sirBeta = parseFloat(val);
    sir.setParams( { 'beta': parseFloat( val ) } );
    document.getElementById('textBeta').value = val;
    updateGraph();
};

function updateGamma(val) {
    // sirGamma = 1 / parseFloat(val);

    sir.setParams( { 'gamma': 1 / parseFloat( val ) } );
    document.getElementById('textGamma').value = val;
    updateGraph();
};
