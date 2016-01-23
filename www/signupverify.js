$("#password").keypress(function(){
  setTimeout(function(){
    if($("#password").val() == $("#passwordConf").val()){
      $("#passwordConf").removeClass("invalid");
      $("#passwordConf").addClass("valid");
    }else{
      $("#passwordConf").removeClass("valid");
      $("#passwordConf").addClass("invalid");
    }
  },5);
});