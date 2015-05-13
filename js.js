var data = [];
var types = {
  multipleChoice:0,
  multiline:1,
  oneline:2};

var addClose = function(){
  $('#add').empty();
  $('#add').append($('<button>').text('Add question').click(addOpen));
  $('#add').append($('<button>').text('Add other').click(addOpen));
  $('#add').append($('<button>').text('Settings').click(addOpen));
};
var addOpen = function(){
  $('#add').empty();
  $('#add').append($('<button>').text('<').click(addClose));
  $('#add').append($('<button>').text('Multiple Choice').click(addMultipleChoice));
  $('#add').append($('<button>').text('Multiline Text'));
  $('#add').append($('<button>').text('One line text'));
};

addClose();

var rename = function(tag){
  var jtag = $(tag.target);
  jtag.replaceWith($('<input>')
    .val(jtag.text())
    .attr('autofocus', 'autofocus'));
};

var closeRename = function(tag){
  var jtag = $(tag.target);
  jtag.replaceWith($('<span>').text(jtag.val()).click(rename));
};

var addMultipleChoice = function(){
  data.push(
    {
      type: types.multipleChoice,
      text: "",
      help: "",
      responces:[
        
      ]
    }
  );
  compileData();
};



/*var loadOptions = function(tag){
  var jtag = $(tag.target).parent().parent();
  jtag.empty();
  jtag
    .append($('<li>')
      .append($('<input>')
        .val('Option 1')
        .attr('class','italic multiplechoice')))
      .append(addOption);
  
};*/

var compileData = function(){
  $('#data').empty();
  data.forEach(function(bit,i){
    switch(bit.type){
      case types.multipleChoice:
        var addOption = $('<li>')
          .append($('<input>')
            .val('Click to add option')
            .attr('class','italic multiplechoice')
            .click());
        $('#data').append($('<div>')
          .append($('<input>')
            .val(bit.help == 0 ? "Click to add text" : bit.help)
            .attr('class','title'))
          .append($('<input>')
            .val(bit.help == 0 ? "Click to add text" : bit.help)
            .attr('class','helpline'))
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

$('#addOpen').click(function(){
  addOpen();
});




