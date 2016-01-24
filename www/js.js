/* global SockJS */
console.log('Loaded');
var sock = new SockJS(window.location.protocol + '//' + window.location.hostname + ':9999/formeditor');

var data = [];

function error(message){
  $('#err').removeClass('errormsg invisible')
    .text('Error: ' + message)
    .addClass('errormsg')
}

sock.onopen = function() {
  console.log('Connected to server');

  sock.send('auth: '+sessid);
  //sock.close();
};

function parseData(message){
  switch (typeof message) {
    case "string":
      var spm = message.split(': ');
      return {
        "type": "string",
        "header": spm[0],
        "data": message.substring(spm[0].length + 2)
      };
    default:
      return undefined;
  }
}

sock.onmessage = function(e) {
  var msg = parseData(e.data);
  if(msg.type == 'string'){
    switch (msg.header) {
      case "Basedata":
        data = JSON.parse(msg.data).formdata;
        break;
      default:

    }
  }
};
sock.onclose = function() {
  console.log('Server closed the connection');
  error('Lost connection from server');
};
var types = {
  multipleChoice:0,
  multiline:1,
  oneline:2};

var prevBtn = addClose;

var addClose = function(){
  prevBtn = addClose;
  $('#add').empty();
  $('#add').append($('<button>').text('Add question').click(addOpen));
  $('#add').append($('<button>').text('Add other').click(otherOpen));
  $('#add').append($('<button>').text('Settings').click(settingsOpen));
  $('#add').append($('<button>').text('Save').click(compileData));
};
var addOpen = function(){
  prevBtn = addOpen;
  $('#add').empty();
  $('#add').append($('<button>').text('<').click(addClose));
  $('#add').append($('<button>').text('Multiple Choice').click(addMultipleChoice));
  $('#add').append($('<button>').text('Multiline Text').click(niy));
  $('#add').append($('<button>').text('One line text').click(niy));
};
var otherOpen = function(){
  prevBtn = otherOpen;
  $('#add').empty();
  $('#add').append($('<button>').text('<').click(addClose));
  $('#add').append($('<button>').text('Text section').click(niy));
  $('#add').append($('<button>').text('Help section').click(niy));
  $('#add').append($('<button>').text('Link').click(niy));
  $('#add').append($('<button>').text('Image').click(niy));
  $('#add').append($('<button>').text('Video').click(niy));
};
var settingsOpen = function(){
  prevBtn = settingsOpen;
  $('#add').empty();
  $('#add').append($('<button>').text('<').click(addClose));
  $('#add').append($('<button>').text('Mode').click(niy));
  $('#add').append($('<button>').text('Responses').click(niy));
};
function niy(){
  $('#add').empty();
  $('#add').append($('<button>').text('<').click(prevBtn));
  $('#add').append($('<span>').text('Not Implemented Yet'));
}

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
      help: {
        text: ""
      },
      responses:[
        {
          text: ""
        }
      ]
    }
  );
  compileData();
};

function updateText(e){
  setTimeout(function(){
    this.text = $(e.target).val();
  }.bind(this),5);
}

function addMCOption(e){
  setTimeout(function(){
    this.arr.push({
      text: ""
    });
    this.me.noCallback = true;
    this.me.focus = true;
    compileData();
  }.bind(this),5);
}

var compileData = function(){
  $('#data').empty();
  data.forEach(function(item,i){
    switch(item.type){
      case types.multipleChoice:
        var mcOptions = $('<ul>');
        item.responses.forEach(function(resp){
          var iToAppend =
            $('<input>')
              .val(resp.text)
              .attr('placeholder', resp.noCallback ? 'Click to add text' : 'Click to add option')
              .addClass('helpline input')
              .keypress(updateText.bind(resp))
              .focusin(resp.noCallback ? undefined : addMCOption.bind({"arr": item.responses, "me": resp}));
          mcOptions.append(
            $('<li>').append(iToAppend)
          );
          setTimeout(function(){
            if(resp.focus){
              iToAppend.focus();
              resp.focus = false;
            }
          }.bind(this),5);
        });
        $('#data').append(
          $('<div>')
            .append($('<input>')
              .val(item.text)
              .attr('placeholder', 'Click to add text')
              .addClass('italic multiplechoice input')
              .keypress(updateText.bind(item))
            )
            .append(mcOptions)
        );


        break;
      default:
        console.log("err_type_not_found");
        $('#data').append($('<h1>').text('Error! Type not found'));
    }
  });
  sock.send('save: ' + JSON.stringify({formdata:data}));
};

$('#addOpen').click(function(){
  addOpen();
});
