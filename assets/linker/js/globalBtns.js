$(document).ready(function() {
  $(".deleteBtn").on("click", function() { 
    $(this).hide();
    $(this).parent("td").children('form').children('.confirmDelete').show();
  });
});