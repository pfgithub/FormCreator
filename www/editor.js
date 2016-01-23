/* global socket */
console.log('Loaded (editor.js v2)');

var data = [];


var compileData = function(){
  $('#data').empty();
  data.forEach(function(bit,i){
    switch(bit.type){
      case types.multipleChoice:
        var addOption = $('<li>')
          .append($('<input>')
            .val('Click to add option')
            .attr('class','italic multiplechoice input')
            .click());
        $('#data').append($('<div>')
          .append($('<input>')
            .val(bit.help == 0 ? "Click to add text" : bit.help)
            .attr('class','title input'))
          .append($('<input>')
            .val(bit.help == 0 ? "Click to add text" : bit.help)
            .attr('class','helpline input'))
          .append($('<ul>')
            .append(addOption))
        );
        
        break;
      default:
        console.log("err_type_not_found");
        $('#data').append($('<h1>').text('Error! Type not found'));
    }
  });
};