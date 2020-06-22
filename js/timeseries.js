
// time series functions **************************************************************

class TimeSeries {

  constructor( varName ){

    this.dataObj = {};
    for( var d in varName ){
        this.dataObj[this._dateStrToObj(d)] = varName[d];
    };

    this.length = 0;
    for( var d in this.dataObj ){
      this.length++;
    };

    this.startDateObj = this._getStartDate( this.dataObj );
    this.endDateObj = this._getEndDate( this.dataObj );

  }

  _getStartDate( dataObj ){
    var minDateObj = new Date( 2046, 5, 11 );
    var dObj;
    for( var d in dataObj ){
      dObj = new Date(d);
      if( dObj <= minDateObj ){
        minDateObj = this._cloneDate( dObj );
      }
    };
    return minDateObj;
  }

  _getEndDate( dataObj ){
    var maxDateObj = new Date( 1966, 5, 11 );
    var dObj;
    for( var d in dataObj ){
      var dObj = new Date(d);
      if( dObj >= maxDateObj ){
        maxDateObj = this._cloneDate( dObj );
      }
    };
    return maxDateObj;
  }

  _dateStrToObj( dateStr ){
    return new Date(
      parseInt( dateStr.substr(6,4) ),
      parseInt( dateStr.substr(3,2) )-1,
      parseInt( dateStr.substr(0,2) )
    );
  }

  _dateObjToStr( dateObj ){
    var str = String( dateObj.getDate() ).padStart( 2, '0' ) + "/";
    str += String( dateObj.getMonth() + 1 ).padStart( 2, '0' ) + "/";
    str += String( dateObj.getFullYear() );
    return str;
  }

  _cloneDate( dateObj ){
    return this._dateStrToObj( this._dateObjToStr( dateObj ) );
  }

  shiftByDays( days ) {
    var shiftedDataObj = {};
    var newDateObj;
    for( var d in this.dataObj ){
      newDateObj = new Date(d);
      newDateObj.setDate( newDateObj.getDate() + days );
      shiftedDataObj[newDateObj] = this.dataObj[d];
    };
    this.dataObj = shiftedDataObj;
    this.startDateObj = this._getStartDate( this.dataObj );
    this.endDateObj = this._getEndDate( this.dataObj );
  }

  smoothValues() {
    var smoothedDataObj = {};
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

/*
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
*/

}
