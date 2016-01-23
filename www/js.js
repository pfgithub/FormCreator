console.log('Loaded');

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

function updateText(e){
  setTimeout(function(){
    console.log(this);
    this.text = $(e.target).val();
  }.bind(this),5);
}

var compileData = function(){
  $('#data').empty();
  data.forEach(function(item,i){
    switch(item.type){
      case types.multipleChoice:
        /*var addOption = $('<li>')
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
        );*/
        $('#data').append(
          $('<div>')
            .append($('<input>')
              .val(item.text)
              .attr('placeholder', 'Click to add text')
              .addClass('italic multiplechoice input')
              .keypress(updateText.bind({"text": item.text}))
            )
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




