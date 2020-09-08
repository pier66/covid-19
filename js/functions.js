
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

function averageOfDateObj( dateObj1, dateObj2 ){
  return new Date( ( ( dateObj1.getTime() + dateObj2.getTime() ) / 2 ) );
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

function getValuesReadyToPlot( varName, cutEnd = false ){
  var valuesDetected = false;
  var valuesReadyToPlot = [];
  for( var i = 0; i < displayDates.length; i++ ) {
    var dateStr = dateObjToStr( displayDates[i] );
    if( varName[dateStr] ){
      valuesDetected = true;
      valuesReadyToPlot.push( varName[dateStr] );
    }
    else {
      if( !cutEnd ) {
          valuesReadyToPlot.push( 0 );
      }
      else {
        if( !valuesDetected ){

          if( varName[dateStr] === 0 ){
            valuesReadyToPlot.push( 0 );
          }
          else {
            valuesReadyToPlot.push( '' );
          }

        }
      }
    }
  }
  return valuesReadyToPlot;
};

function smoothValues( values ){
  var smoothedValues = [];
  /*
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
  */
  for( var i = 0; i < values.length; i++ ){

    var sum = 0;

    if( i <= 3 ) {

      for( var j = 0; j <= 3+i; j++ ){
        sum += values[j];
      };

    } else if ( i >= values.length - 3 ) {

      for( var j = i - 3; j <= values.length - 1; j++ ){
        sum += values[j];
      };

    } else {

      for( var j = -3; j <= 3; j++ ){
        sum += values[i+j];
      };

    };

    smoothedValues.push( sum / 7 );
  };
  return smoothedValues;
};


function multiplyValuesByFactor( values, factor ) {
  var multipliedValues = [];
  for( var i = 0; i < values.length; i++ ){
    if( values[i] === '' ){
      multipliedValues[i] = '';
    }
    else {
      multipliedValues[i] = factor * values[i];
    };
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

function multiplyValues( values1, values2 ){
  var multedValues = [];
  for( var i = 0; i < values1.length; i++ ){
    multedValues[i] = values1[i] * values2[i];
  };
  return multedValues;
};

function subtractValues( values1, values2 ){
  var subtractedValues = [];
  for( var i = 0; i < values1.length; i++ ){
    subtractedValues[i] = values1[i] - values2[i];
  };
  return subtractedValues;
};

function divideValues( values1, values2 ){
  var dividedValues = [];
  for( var i = 0; i < values1.length; i++ ){

    if( values1[i] === 0 ) {
      dividedValues[i] = 0;
    }
    else {
      dividedValues[i] = values1[i] / values2[i];
    }

  };
  return dividedValues;
};
