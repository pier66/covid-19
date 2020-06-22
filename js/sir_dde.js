
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
