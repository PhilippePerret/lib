/*
    Objet Backtrace
    ----------------
    Pour le backtrace du programme
    
    Raccourci : BT
    
    REQUIS
    ======
    
      La librairie générale `utils.js' qui définit par exemple is_array()
      
    @usages
    =======

      Initialisation
      --------------
        En début de programme :       BT.reset() ;

      Suivi des méthodes
      -------------------
        Ajouter :  BT.add("-> nom de la méthode");

      Log en cours de programme
      --------------------------
        BT.log( foo[, list_real] );
        +foo+ peut être indifféremment un texte, un objet ou une liste de
        textes et d'objets.
        @noter que ça signifie que si on veut afficher une liste, elle serait
        décomposer en ses éléments. Pour éviter la chose, on met 'list_real'
        à true
        @noter que le test est fait de l'existence de la console, donc qu'on
        ne prend aucun risque à appeler cette méthode.
        
      En fin de programme, appeler en console :
      
        Backtrace.show();
        OU
        BT.show() ;
    
    @WARNING: Attention, cette méthode vide le tampon. Il faut donc en tenir
    compte si on l'utilise en cours de programme.
    
*/
window.Backtrace = {
  tampon      : null,
  console_on  : false, // mis à true si la console est active
  console_off : true,  // contraire de la précédente
  
  // Reset le backtrace
  reset: function(){
    this.console_on = 'object' == typeof console && 'function' == typeof console.dir ;
    this.console_off = !this.console_on ; // convenient
    this.tampon = [] ;
  },
  // Ajoute un texte au tampon backtrace (en général une méthode)
  add: function( method, options ){
    if ( this.console_off ) return ;
    if ( this.tampon == null ) this.tampon = [] ;
    this.tampon.push( method ) ;
  },
  // Ajoute tout de suite un texte en console si elle existe
  // 
  // @param   foo         Contrairement à `console', foo peut être un string ou
  //                      un objet.
  //                      OU une liste de string et d'objets
  // @param   list_real   Mettre à true si c'est vraiment une liste envoyée en
  //                      tant que valeur (pour qu'elle ne soit pas prise pour
  //                      une suite de messages et d'objets à afficher)
  // 
  log: function( foo, list_real ){
    if ( this.console_off ) return ;
    if ( is_array(foo) && 'undefined'==typeof(list_real) || list_real==false)
      for( var i in foo ){ var el = foo[i]; this.log( el ) ; }
    else {
      if ( 'string' == typeof foo ) console.log( foo ) ;
      else                          console.dir( foo ) ;
    }
  },
  // Affiche le backtrace (en console)
  show: function(){
    if ( console ){
      console.log("\n\n--- Backtrace ---") ;
      console.dir( this.tampon.reverse() )
      console.log("\n\n--- /Backtrace ---") ;
      this.reset() ;
    } else {
      F.error( "Il faut activer la console pour voir le backtrace") ;
    }
  },
}
window.BT = Backtrace ;