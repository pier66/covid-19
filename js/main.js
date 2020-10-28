
// html tag
const graphDiv = document.getElementById('graphDiv');

// display dates *********************************************
const startDateStr = "01/02/2020";
const endDateStr = dateObjToStr( new Date() ); // "22/07/2020";

const startDateObj = dateStrToObj( startDateStr );
const endDateObj = dateStrToObj( endDateStr );

var displayDates = [];
var startDateObjFor = dateStrToObj( startDateStr );
for( var d = startDateObjFor; d <= endDateObj-4; d.setDate( d.getDate() + 1 )) {
    displayDates.push( new Date(d) );
};

var dateRangeArr = [ dateObjToStr2( startDateObj ), dateObjToStr2( endDateObj ) ];


// plot ************************************************************************



var detectedPerDayPer100 =
    multiplyValuesByFactor(
      divideValues(
        getValuesReadyToPlot( covidPlusPerDay ),
        getValuesReadyToPlot( testedPerDay )
      ), 100
    );


var infectedPerDayPer100 =
    multiplyValuesByFactor(
      divideValues(
        getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ),
        getValuesReadyToPlot( translateValuesByDays( testedPerDay, -8 ) )
      ), 100
    );

/*
var infected =
    accumulateValues (
      addValues(
        addValues(
          getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ),
          multiplyValuesByFactor( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ) , -1 )
        ),
        multiplyValuesByFactor( getValuesReadyToPlot( gonePerDay ), -1 )
      )
    );

var infectedSmoothed =
      smoothValues(
        accumulateValues (
          addValues(
            addValues(
              getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ),
              multiplyValuesByFactor( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ) , -1 )
            ),
            multiplyValuesByFactor( getValuesReadyToPlot( gonePerDay ), -1 )
          )
        )
      );
*/


var infected = accumulateValues( getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ) );
var infectedSmoothed = smoothValues( infected );

var infectedPerDaySmoothed = smoothValues(
  getValuesReadyToPlot(
    translateValuesByDays( covidPlusPerDay, -8 )
  )
);

var infectedPerDayPerAccumulatedPercent =
  multiplyValuesByFactor(
    divideValues(
      infectedPerDaySmoothed,
      accumulateValues( infectedPerDaySmoothed )
    ),
    100
);


var sir = new SIR();
// sir.importTestData( translateValuesByDays( testedPerDay, -8 ) ,translateValuesByDays( covidPlusPerDay, -8 ) );
var sirResult = sir.compute();

var sirS = sirResult.S
var sirI = sirResult.I;
var sirR = sirResult.R;
var sirIperDay = sirResult.IperDay;
var sirRperDay = sirResult.RperDay;
var stageAB = sirResult.stageAB;
var stageBC = sirResult.stageBC;

var Isir_Ipcr = subtractValues( getValuesReadyToPlot( sirResult.IperDay, true ), smoothValues( infectedPerDayPer100 ) );

for( var i = 0; i < 45; i++ ) {
  Isir_Ipcr[i] = 0;
};



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
      marker: { color: 'rgba( 214, 39, 40, 0.5 )' }, //  #d62728
      x: displayDates,
      y: getValuesReadyToPlot( covidPlusPerDay ),
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'detected per day smoothed',
      marker: { color: '#d62728' },
      x: displayDates,
      y: smoothValues( getValuesReadyToPlot( covidPlusPerDay ) ),
      /* type: 'bar', */
      visible: 'legendonly'
    },
    {
      name: 'detected per day smoothed cumulated',
      marker: { color: 'rgba( 214, 39, 40, 0.5 )' }, //  #d62728
      x: displayDates,
      y: accumulateValues( smoothValues( getValuesReadyToPlot( covidPlusPerDay ) ) ),
      type: 'scatter',
      yaxis: 'y2',
      visible: 'legendonly'
    },
    {
      name: 'tested per day',
      marker: { color: 'rgba( 100, 100, 100, 0.5 )' }, //   #bbbbbb
      x: displayDates,
      y: getValuesReadyToPlot( testedPerDay ),
      yaxis: 'y2',
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'tested per day smoothed',
      marker: { color: '#333333' },
      x: displayDates,
      y: smoothValues( getValuesReadyToPlot( testedPerDay ) ),
      yaxis: 'y2',
      /* type: 'bar', */
      visible: 'legendonly'
    },
    {
      name: 'tested per day smoothed -8 days /10',
      marker: {color: '#bbbbbb'},
      x: displayDates,
      y: multiplyValuesByFactor( smoothValues( getValuesReadyToPlot( translateValuesByDays( testedPerDay, -8 ) ) ), 1/10 ),
      /* type: 'bar', */
      visible: 'legendonly'
    },
    {
      name: 'detected per day per 100',
      marker: { color: 'rgb( 255, 127, 14, 0.5 )' },
      x: displayDates,
      y: detectedPerDayPer100,
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'detected per day per 100 smoothed',
      marker: { color: '#8c564b' },
      x: displayDates,
      y: smoothValues( detectedPerDayPer100 ),
      visible: 'legendonly'
    },
    {
      name: 'detected per day per 100 smoothed cumul',
      marker: { color: '#e377c2' },
      x: displayDates,
      y: accumulateValues( smoothValues( detectedPerDayPer100 ) ),
      visible: 'legendonly'
    },
    {
      name: 'infected per day per 100',
      marker: { color: 'rgb( 255, 127, 14, 0.5 )' },
      x: displayDates,
      y: infectedPerDayPer100,
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'infected per day per 100 smoothed',
      marker: { color: '#8c564b' },
      x: displayDates,
      y: smoothValues( infectedPerDayPer100 ),
      visible: 'legendonly'
    },
    {
      name: 'infected per day',
      marker: { color: 'rgb( 255, 127, 14, 0.5 )' },
      x: displayDates,
      y: getValuesReadyToPlot( translateValuesByDays( covidPlusPerDay, -8 ) ),
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'infected per day smoothed',
      marker: { color: '#8c564b' },
      x: displayDates,
      y: infectedPerDaySmoothed,
      visible: 'legendonly'
    },
     /*
    {
      name: 'infected per day versus accumulated (%)',
      marker: {color: '#aaaaaa'},
      x: displayDates,
      y: infectedPerDayPerAccumulatedPercent,
      type: 'bar',
      visible: 'legendonly'
    }
    {
      name: 'recovered per day',
      marker: {color: '#2ca02c'},
      x: displayDates,
      y: multiplyValuesByFactor( getValuesReadyToPlot( recoveredPerDay ), -1 ),
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'recovered per day -8 days',
      marker: {color: '#bcbd22'},
      x: displayDates,
      y: multiplyValuesByFactor( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ), -1),
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'recovered per day -8 days smoothed',
      marker: {color: '#2ca02c'},
      x: displayDates,
      y: multiplyValuesByFactor( smoothValues( getValuesReadyToPlot( translateValuesByDays( recoveredPerDay, -8 ) ) ), -1 ),
      type: 'bar',
      visible: 'legendonly'
    },*/
    {
      name: 'lethal cases per day',
      marker: { color: '#1f77b4' },
      x: displayDates,
      y: getValuesReadyToPlot( gonePerDay ),
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'soins normaux',
      marker: { color: '#bcbd22' },
      x: displayDates,
      y: getValuesReadyToPlot( hospital ),
      /*type: 'bar',*/
      visible: 'legendonly',
      yaxis: 'y2'
    },
    {
      name: 'soins intensifs',
      marker: { color: '#d62728' },
      x: displayDates,
      y: getValuesReadyToPlot( icu ),
      /*type: 'bar',*/
      visible: 'legendonly',
      yaxis: 'y2'
    },/*,
    {
      name: 'infected',
      marker: {color: '#e377c2'},
      x: displayDates,
      y: infected,
      type: 'bar',
      visible: 'legendonly'
    },
    {
      name: 'infected smoothed',
      marker: {color: '#e377c2'},
      x: displayDates,
      y: infectedSmoothed, /*,
      type: 'bar'
      mode: 'markers',
      type: 'scatter',
      visible: 'legendonly'
    } */
    {
      name: 'PCR error 1,6%',
      mode: 'lines',
      line: {
        color: '#111111',
        width: 1,
        dash: 'dot'
      },
      x: displayDates,
      y: drawConstant( 1.6 ),
      visible: 'legendonly'
    }
  ]
};

function sirData(){
  return [
    {
      name: 'infected smoothed no LD',
      marker: {color: '#e377c2'},
      x: displayDates,
      y: addValues( infectedSmoothed, multiplyValuesByFactor( multiplyValues( Isir_Ipcr, infectedSmoothed ), 0.01 ) ),
      mode: 'lines',
      line: {
        dash: 'dot',
        width: 2
      }, /*,
      type: 'bar'
      mode: 'markers',
      type: 'scatter',*/
      visible: 'legendonly'
    },
    {
      name: 'SIR susceptible',
      marker: {color: '#17becf'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.S, true ),
      //visible: 'legendonly'
    },
    {
      name: 'SIR infected',
      marker: {color: '#9467bd'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.I, true )
    },
    {
      name: 'SIR recovered',
      marker: {color: '#bcbd22'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.R, true ),
      //visible: 'legendonly'
    },
    {
      name: 'SIR infected per day',
      marker: {color: '#d62728'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.IperDay, true )
    },
    {
      name: 'SIR recovered per day',
      marker: {color: '#2ca02c'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.RperDay, true ),
      //visible: 'legendonly'
    },
    {
      name: 'SIR I<sub>0</sub>e<sup>(beta-gamma)t</sup>',
      marker: {color: '#000000'},
      x: displayDates,
      y: getValuesReadyToPlot( sirResult.exp, true )
    } /*,
    {
      name: 'SIR I<sub>0</sub> beta e<sup>(beta-gamma)t</sup>',
      marker: {color: '#000000'},
      x: displayDates,
      y: multiplyValuesByFactor( getValuesReadyToPlot( sirResult.exp, true ), sir.beta )
    },
    {
      name: 'I<sub>SIR</sub> - I<sub>PCR+</sub>',
      marker: {color: '#1f77b4'},
      x: displayDates,
      y: Isir_Ipcr
    },
    {
      name: 'infected cumul smoothed',
      marker: {color: '#e377c2'},
      x: displayDates,
      y: accumulateValues( infectedPerDaySmoothed ),
      yaxis: 'y2' /*,
      type: 'bar'
      mode: 'markers',
      type: 'scatter',
      visible: 'legendonly'*//*
    },
    {
      name: 'infected cumul smoothed no LD',
      marker: {color: '#e377c2'},
      x: displayDates,
      y: accumulateValues( addValues( infectedPerDaySmoothed, multiplyValuesByFactor( multiplyValues( Isir_Ipcr, smoothValues( getValuesReadyToPlot( translateValuesByDays( testedPerDay, -8 ) ) ) ), 0.01 ) ) ),
      mode: 'lines',
      line: {
        dash: 'dot',
        width: 2
      },
      yaxis: 'y2' /*,
      type: 'bar'
      mode: 'markers',
      type: 'scatter',
      visible: 'legendonly'
    }*/
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
      x0: dateStrToObj( sir.t_LD ),
      y0: 0,
      x1: dateStrToObj( sir.t_LD ),
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
  },
  {
    x: dateStrToObj( sir.t_LD ),
    y: 0.97,
    xref: 'x',
    yref: 'paper',
    text: sir.t_LD,
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
    annotations: [],
    font: {
      family: 'Arial',
      size: 15,
      color: '#111111'
    },
    yaxis2: {
      overlaying: 'y',
      side: 'right'
    },
    legend: {
      x: 1.05,
      y: 0
    }/*,
    barmode: 'group'
      ,
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
    // stageLabels = getStageLabels();
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

function showHideSecondAxis(){
  if ( document.getElementById('checkboxSecondAxis').checked == true ){
    Plotly.relayout( graphDiv, { 'yaxis2.visible': true } );
  }
  else {
    Plotly.relayout( graphDiv, { 'yaxis2.visible': false } );
  };
};


function update( param, val ) {
  var repro_0;
    switch( param ){
      case 't_0':
        sir.setParams( { 't_0': val } );
        console.log( val );
        break;

      case 'R_0':
        sir.setParams( { 'R_0': parseFloat( val ) } );
        document.getElementById('textR_0').value = val;
        break;

      case 'S_0':
        sir.setParams( { 'S_0': parseFloat( val ) } );
        document.getElementById('textS_0').value = val;
        break;

      case 'I_0':
        sir.setParams( { 'I_0': parseFloat( val ) / sir.S_0 } );
        document.getElementById('textI_0').value = val;
        break;

      case 'beta':
        sir.setParams( { 'beta': parseFloat( val ) } );
        document.getElementById('textBeta').value = val;
        repro_0 = sir.beta / sir.gamma;
        document.getElementById('textRepro_0').innerHTML = repro_0.toFixed( 2 );
        break;

      case 'gamma':
        sir.setParams( { 'gamma': 1 / parseFloat( val ) } );
        document.getElementById('textGamma').value = val;
        repro_0 = sir.beta / sir.gamma;
        document.getElementById('textRepro_0').innerHTML = repro_0.toFixed( 2 );
        break;

      case 'lockDown':
        if( document.getElementById('checkboxSIRLockDown').checked == true ){
          sir.setParams( { 'lockDown': true } );
        }
        else {
          sir.setParams( { 'lockDown': false } );
        };
        break;

      case 't_LD':
        sir.setParams( { 't_LD': val } );
        break;

      case 'beta_LD':
        sir.setParams( { 'beta_LD': parseFloat( val ) } );
        document.getElementById('textBetaLD').value = val;
        break;
    };

    sirResult = sir.compute();
    Isir_Ipcr = subtractValues( getValuesReadyToPlot( sirResult.IperDay, true ), smoothValues( infectedPerDayPer100 ) );
    for( var i = 0; i < 45; i++ ) {
      Isir_Ipcr[i] = 0;
    };

    Plotly.deleteTraces( graphDiv, [  -7, -6, -5, -4, -3, -2, -1 ] ); // -11, -10, -9, -8,
    Plotly.addTraces( graphDiv, sirData() );
    showHideStagesLockdown();
};


var timeSeriesI = new TimeSeries( sirI );
//console.log( timeSeriesI );

timeSeriesI.shiftByDays( -8 );
//console.log( timeSeriesI );
