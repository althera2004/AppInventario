/* fastclick */
$(function() { FastClick.attach(document.body); });
/* botón menú */
var elmenu = function() {
   if( $("#content").hasClass('menuopen')) {
      $("#content").removeClass('menuopen');
      $(".lopen").removeClass('open');
      $("#menu").removeClass('menus');
      $("#estado").html('cierra menu');
   } else {
      $("#content").addClass('menuopen');
      $("#menu").addClass('menus');
      $(".lopen").addClass('open');
      $("#estado").html('abre menu');
   }
}
/* cuando da click en un área diferente al menú */
$(".lopen").tap(function() { cierramenu(); }); //para móviles
$(".lopen").click(function() { cierramenu(); }); //para navegador web
var cierramenu = function() {
   if( $("#content").hasClass('menuopen') ) {
      $("#content").removeClass('menuopen');
      $(".lopen").removeClass('open');
      $("#menu").removeClass('menus');
      $("#estado").html('cierra menu');
   }
   $(".lopen").removeClass('open');
};
/* cuando elige alguna opción del menu... */
var menusel = function(e) {
   cierramenu();
   $("#estado").html('Elegido del menú '+e);
};
