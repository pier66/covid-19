
// date functions **************************************************************

function dateStrToObj( dateStr ){
  return new Date(
    parseInt( dateStr.substr(6,4) ),
    parseInt( dateStr.substr(3,2) )-1,
    parseInt( dateStr.substr(0,2) )
  );
};

function dateObjToStr( dateObj ){
  var str = String( dateObj.getDate() ).padStart(2, '0') + "/";
  str += String( dateObj.getMonth() + 1 ).padStart(2, '0') + "/";
  str += String( dateObj.getFullYear() );
  return str;
};

function dateObjToStr2( dateObj ){
  var str = String( dateObj.getFullYear() ) + "-";
  str += String( dateObj.getMonth() + 1 ).padStart(2, '0') + "-";
  str += String( dateObj.getDate() ).padStart(2, '0');
  return str;
};

// data functions **************************************************************

function translateValuesByDays( varName, byDays ){
  var translatedValues = {};
  for( var i in varName ){
    var date = parseInt(i.substr(0,2));
    var month = parseInt(i.substr(3,2))-1;
    var year = parseInt(i.substr(6,4));
    var curDate = new Date( year, month, date );
    var newDate = curDate;
    newDate.setDate( date + byDays );
    var newDateString = String( newDate.getDate()).padStart(2, '0');
    newDateString += "/" + String( newDate.getMonth()+1 ).padStart(2, '0');
    newDateString += "/" + String( newDate.getFullYear() );
    translatedValues[newDateString] = varName[i];
  };
  return translatedValues;
};

function getValuesReadyToPlot( varName ){
  var valuesReadyToPlot = [];
  for( var i = 0; i < displayDates.length; i++ ) {
    var dateStr = dateObjToStr( displayDates[i] );
    if( varName[dateStr] ){
      valuesReadyToPlot.push( varName[dateStr] );
    }
    else {
      valuesReadyToPlot.push( 0 );
    }
  }
  return valuesReadyToPlot;
};

function smoothValues( values ){
  var smoothedValues = [];
  for( var i = 0; i < values.length; i++ ){
    if( i == 0 || i == values.length-1 ) {
      smoothedValues.push( values[i] );
    } else if( i == 1 || i == values.length-2 ) {
      smoothedValues.push( ( values[i-1] + values[i] + values[i+1] ) / 3 );
    } else if( i == 2 || i == values.length-3 ) {
       var sum = 0;
       for( var j = -2; j <= 2; j++ ){
         sum += values[i+j];
       };
       smoothedValues.push( sum / 5 );
    } else {
      var sum = 0;
      for( var j = -3; j <= 3; j++ ){
        sum += values[i+j];
      };
      smoothedValues.push( sum / 7 );
    }
  }
  return smoothedValues;
};

function multiplyValues( values, factor ) {
  var multipliedValues = [];
  for( var i = 0; i < values.length; i++ ){
    multipliedValues[i] = factor * values[i];
  };
  return multipliedValues;
};

function accumulateValues( values ) {
  var sum = 0;
  var cumulatedValues = [];
  for( var i = 0; i < values.length; i++ ){
    sum += values[i];
    cumulatedValues[i] = sum;
  };
  return cumulatedValues;
};

function addValues( values1, values2 ){
  var addedValues = [];
  for( var i = 0; i < values1.length; i++ ){
    addedValues[i] = values1[i] + values2[i];
  };
  return addedValues;
};

function divideValues( values1, values2 ){
  var dividedValues = [];
  for( var i = 0; i < values1.length; i++ ){
    dividedValues[i] = values1[i] / values2[i];
  };
  return dividedValues;
};



/******************************************************************************

var S_lockDown = {};
var I_lockDown = {};
var R_lockDown = {};

function beta_lockDown( dateObj ) {
  if( dateObj < dateStrToObj( '18/03/2020' ) ){
    return 0.37;
  }
  else if( dateObj < dateStrToObj( '25/03/2020' ) ){
    return 0.33;
  }
  else {
    return 0.29;
  }
};

function SIR_lockDown() {
  // count days
  var diffDays = Math.round( Math.abs( ( endDateObj - startDateObj ) / (24 * 60 * 60 * 1000) ) );
  // console.log( diffDays );
  var steps = diffDays * stepsPerDay;

  var S2 = [];
  var I2 = [];
  var R2 = [];

  S2[0] = N;
  I2[0] = I_0 * N;
  R2[0] = 0;

  var i = 0;
  for( var d = 0; d < displayDates.length; d++ ) {
    // console.log(d);
    S_lockDown[dateObjToStr(displayDates[d])] = S2[i];
    I_lockDown[dateObjToStr(displayDates[d])] = I2[i];
    R_lockDown[dateObjToStr(displayDates[d])] = R2[i];

    for( var s = 1; s <= stepsPerDay; s++ ){
      S2[i+1] = S2[i] - beta_lockDown(displayDates[d]) * S2[i] * I2[i] / stepsPerDay;
      I2[i+1] = I2[i] + ( beta_lockDown(displayDates[d]) * S2[i] * I2[i] - gamma * I2[i] ) / stepsPerDay;
      R2[i+1] = R2[i] + gamma * I2[i] / stepsPerDay;
      i++;
    }
  }
};

**/
/*
var sirSdde = {};
var sirIdde = {};
var sirRdde = {};
var sirIddePerDay = {};
var sirRddePerDay = {};
var c = 0.001;

function SIR_DDE(){
  sirSdde = {};
  sirIdde = {};
  sirRdde = {};
  sirIddePerDay = {};
  sirRddePerDay = {};

  sirRepro_0 = sirBeta / sirGamma;

  var capGamma = - gsl_sf_lambert_W0( - sirRepro_0 * Math.exp( -sirRepro_0 ) ) / sirRepro_0;

  for( var d = 0; d < displayDates.length; d++ ) {

    var x = Math.exp( sirBeta * ( 1 - capGamma ) * d );

    sirSdde[dateObjToStr(displayDates[d])] = sirN *
      ( Math.pow( 1 - capGamma, 2 ) + capGamma * c * x )
      /
      ( Math.pow( 1 - capGamma, 2 ) + c * x );

    sirIdde[dateObjToStr(displayDates[d])] = sirN *
      ( Math.pow( 1 - capGamma, 4 ) * c * x )
      /
      (
        ( Math.pow( 1 - capGamma, 2 ) + c * x )
        *
        ( Math.pow( 1 - capGamma, 2 ) + capGamma * c * x )
      );

    sirRdde[dateObjToStr(displayDates[d])] = sirN *
      ( capGamma * ( 1 - capGamma ) * c * x )
      /
      ( Math.pow( 1 - capGamma, 2 ) + capGamma * c * x );
  };
};

*/
