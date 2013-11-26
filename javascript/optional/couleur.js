/*
    Objet `Couleur' permettant de gérer les couleurs
    --------------------------------------
    Il permet notamment d'afficher un div flottant pour les choisir (cf. Couleur.pick)

    MODE D'EMPLOI DU FLOTTANT :
      * On déplace les curseurs pour choisir les couleurs du fond ou du texte en fonction
        de la valeur du menu "Définir".
      * On peut sélectionner un curseur et régler sa valeur avec les flèches UP et DOWN
      * On peut passer de curseur en curseur avec la touche TAB.
      * Cliquer n'importe où (autre que sur les curseurs) pour ré-activer les raccourcis
        clavier normaux.
      
    @note À besoin aussi de 'couleur.css'
    
*/
  // À remettre si non défini ailleurs
  // const K_UpArrow     =38;
  // const K_RigthArrow  =39;
  // const K_DownArrow   =40; 

if('function'!= typeof stop_event){
  function stop_event(evt){
    evt.stopPropagation();
    evt.preventDefault() ;
    return false ;
  }
}
String.prototype.to_dec = function(){return parseInt(this,16)}
Number.prototype.to_hex = function(){return this.toString(16)}

window.Couleur = {
  
  /*
      Affiche une boite pour choisir une couleur
    
      @param    options   Options éventuelles
                          default     : valeur par défaut. C'est un hash définissant
                                        {fond:"RRGGBB", text:"RRGGBB"}
                          pour_suivre : La méthode qui sera invoquée avec les valeurs
                                        Elle doit recevoir un hash contenant :
                                            fond  : La couleur du fond
                                            text        : La couleur du texte
      
      @note C'est un raccourci pour Couleur.Pick.show
  */
  pick:function(options){
    this.Pick.show(options || {});
  },
  
  // // Prend une valeur entière et retourne la valeur hexadécimal
  // to_hex:function(nombre){ return nombre.toString(16)}
  // // Prend une valeur hexadécimal et retour la valeur entière
  // to_dec:function(hex){return parseInt(hex,16)}
  
  /* -------------------------------------------------------------------
      Sous-objet Couleur.Pick
  */
  Pick:{
    boite       :null,        // Objet DOM jQuery de la boite
    box_sample  :null,        // Objet DOM jQuery du div pour afficher l'exemple 
    target      :'text',      // La "cible", c'est-à-dire la couleur qu'on change
    options     :null,        // Les options envoyées
    // -- Les données qui servent à afficher et qui seront renvoyées --
    data:{
      fond  :{red:  0,  green:  0,  blue:  0},
      text  :{red:255,  green:255,  blue:255}
    },
    // Affiche la boite pour choisir une couleur
    // @param   options   Cf. Couleur.pick
    show:function(options){
      this.options = options;
      if(this.boite == null) this.build_boite();
      this.boite.show();
    },
    
    // Masque le picker
    hide:function(){
      this.boite.hide();
    },
    
    // Quand on clique sur le bouton "OK"
    on_choose:function(){
      var data_couleurs = {
        fond:this.couleur_fond_html(),
        text:this.couleur_text_html()
        };
      if(this.options.pour_suivre) this.options.pour_suivre(data_couleurs);
      else{
        alert("Couleur du fond  : "+   data_couleurs.fond+
              "\nCouleur du texte : "+ data_couleurs.text);
      }
      this.hide();
    },
    
    // Quand on choisit entre le texte et le fond comme cible
    on_change_target:function(target){
      this.target = target;
      this.regle_curseurs();
    },
    
    // Règle les valeurs si une valeur par défaut a été transmise
    // Règle les curseurs
    set_values:function(){
      if(!this.options.default) this.options.default = $.extend({}, this.data);
      else{
        // Il faut transformer la valeur HTML (p.e. "FF0723" en hash contenant
        // red:…, green:…, blue:… comme dans les data)
      }
      this.show_couleurs();
      this.regle_curseurs();
    },
    
    // Règle les curseurs à la valeur donnée, suivant la cible (fond ou texte)
    regle_curseurs:function(){
      console.log("-> regle_curseurs");
      var data = this.data[this.target];
      for(var teinte in data){
        this.set_curseur_at(teinte, data[teinte]);
      }
    },
    // Règle la hauteur d'un curseur
    set_curseur_at:function(teinte, valeur){
      this.boite.find('div#coulbox_cursor_'+teinte+' > div.coulbox_cursor').css({top:(127 - (valeur/2))+"px"});
    },
    
    // Affecte la couleur de fond et de texte en même temps
    show_couleurs:function(value){
      this.set_couleur_text();
      this.set_couleur_fond();
    },
    // Règle la couleur du texte
    set_couleur_text:function(){
      var coul = this.couleur_text_html();
      this.boite.find('span#coulbox_value_text').html(coul);
      this.box_sample.css('color', coul);
    },
    // Règle la couleur du fond
    set_couleur_fond:function(){
      var coul = this.couleur_fond_html();
      this.boite.find('span#coulbox_value_fond').html(coul);
      this.box_sample.css('background-color', coul);
    },
    // Retourne la couleur de fond au format HTML
    couleur_fond_html:function(){
      return this.code_couleur_html_for(this.data.fond);
    },
    // Retourne la couleur du text au format HTML
    couleur_text_html:function(){
      var d = this.code_couleur_html_for(this.data.text);
      return d;
    },
    // Retourne une couleur HTML d'après un hash {red:…, green:…, blue}
    code_couleur_html_for:function(h){
      return '#' + this.hexTwoChars(h.red)+this.hexTwoChars(h.green)+this.hexTwoChars(h.blue);
    },
    
    // Renvoie la valeur +nombre+ comme une couleur sur deux lettres
    hexTwoChars:function(nombre){
      var h = nombre.toString(16);
      if(h.length < 2) h = "0"+h;
      return h;
    },
    
    // Méthode captant les touches clavier
    onkeydown:function(evt){
      var val;
      switch(evt.keyCode){
        case K_UpArrow:
          this.add_to_current(1 * (evt.shiftKey ? 10 : 1));
          break;
        case K_DownArrow:
          this.add_to_current(-1 * (evt.shiftKey ? 10 : 1));
          break;
        case K_TAB: // sélection du curseur suivant
          this.deselect_cursor();
          var newt;
          // C'est lourd, mais bon, j'ai la flemme de faire autrement…
          switch(this.current_teinte){
            case 'red'    : newt = 'green'; break;
            case 'green'  : newt = 'blue' ; break;
            case 'blue'   : newt = 'red'  ; break;
          }
          this.on_select_cursor({currentTarget:this.boite.find('div#coulbox_cursor_'+newt)});
          break;
      }
      return stop_event(evt);
    },
    
    onclick:function(evt){
      if(false == $(evt.target).hasClass('coulbox_divcursor')){
        if(this.current_cursor) this.deselect_cursor();
      }
      return true;
    },
    
    // Ajoute +ajout+ au curseur courant
    add_to_current:function(ajout){
      var cur = this.data[this.target][this.current_teinte];
      cur += ajout;
      if (cur > 255)    cur = 255;
      else if (cur < 0) cur = 0;
      this.data[this.target][this.current_teinte] = cur;
      this['set_couleur_'+this.target]();
      this.set_curseur_at(this.current_teinte, cur);
    },

    // Méthode appelée quand on clique sur un curseur (le div le contenant)
    current_cursor:null,      // Objet DOM jQuery du curseur
    current_teinte:null,      // La teinte courant (p.e. 'red' ou 'green')
    // @param   evt     L'évènement. Noter qu'il peut être simulé (chercher l'appel à cette
    //                  méthode)
    on_select_cursor:function(evt){
      if(this.current_cursor) this.deselect_cursor();
      this.current_cursor = $(evt.currentTarget);
      this.current_cursor.addClass('selected');
      this.current_teinte = this.current_cursor.find('> div.coulbox_cursor').attr('data-color');
      window.onkeydown = $.proxy(this.onkeydown, this);
    },
    deselect_cursor:function(){
      this.current_cursor.removeClass('selected');
      window.onkeydown = null;
    },
    // Méthode évènement appelée quand on clique (mousedown) sur un curseur
    active_cursor:function(evt, ui){
      var cursor = ui.helper;
      cursor.prev().show(); // pour afficher la valeur
    },
    on_move_cursor:function(evt, ui){
      console.log("-> on_move_cursor");
      var cursor = ui.helper;
      var prop  = cursor.attr('data-color');
      var value = 255 - (parseInt(cursor.position().top * 2,10));
      // var value = 255 - parseInt(cursor.position().top,10);
      // On change la valeur des données
      this.data[this.target][prop] = value;
      // On montre le résultat
      this['set_couleur_'+this.target]();
      // On affiche la valeur
      cursor.prev().html(top);
    },
    on_stop_cursor:function(evt, ui){
      // console.log("-> on_stop_cursor");
      var cursor = ui.helper;
      var value = 127 - parseInt(cursor.position().top,10);
      cursor.prev().hide(); // pour masquer la valeur
    },
    
    // Construction de la boite et la rend draggable et observable
    build_boite:function(){
      $('body').append(this.code_boite());
      this.boite = $('div#couleur_box');
      this.box_sample = this.boite.find('> div#coulbox_disp_couleur');
      this.boite.draggable({containment:'parent'});
      this.boite.css('position','fixed');
      this.set_observers();
      this.set_values();
    },
    
    // Place les observeurs
    //  - Pour rendre les cursors draggable
    //  - Pour pouvoir sélectionner les div de curseur (action avec les touches)
    set_observers:function(){
      this.boite.bind('click', $.proxy(this.onclick, this));
      // this.boite.find('div.coulbox_cursor').bind('mousedown', $.proxy(this.active_cursor,this));
      this.boite.find('div.coulbox_cursor').draggable({
        // disable     :false,
        axis        :"y",
        containment :"parent",
        start       :$.proxy(this.active_cursor,this),
        drag        :$.proxy(this.on_move_cursor, this),
        stop        :$.proxy(this.on_stop_cursor,this)
      });
      
      this.boite.find('div.coulbox_divcursor').bind('click', $.proxy(this.on_select_cursor,this));
    },
    
    // Retourne le code HTML pour la boite
    code_boite:function(){
      return  '<div id="couleur_box">'+
                // Pour le rectangle de couleur
                '<div id="coulbox_disp_couleur">Ceci est <b>un texte pour voir</b> la cou&shy;leur appliquée.</div>'+
                // Pour basculer du choix de la couleur pour le fond et pour le texte
                this.code_choix_target()+
                // Les trois curseurs
                this.code_trois_curseurs()+
                // Boutons
                this.code_boutons()+
              '</div>';
    },
    code_choix_target:function(){
      return  '<div id="coulbox_div_target">'+
                "Définir : "+
                '<select id="coulbox_target" onchange="Couleur.Pick.on_change_target(this.value)">'+
                  '<option value="text">Text</option>'+
                  '<option value="fond">Background</option>'+
                '</select>'+
              '</div>';
              
    },
    // Retourne le code HTML pour les trois curseurs
    code_trois_curseurs:function(){
      return  '<div id="coulbox_div_cursors">'+
                this.code_cursor(['red', 'green', 'blue'])+
              '</div>';
    },
    // Retourne le code pour un curseur
    code_cursor:function(teintes){
      if('object'!=typeof teintes) teintes = [teintes];
      var c = "", i, teinte;
      for(var i in teintes){
        teinte = teintes[i];
        c +=  '<div id="coulbox_cursor_'+teinte+'" class="coulbox_divcursor">'+
                '<div class="coulbox_value" style="display:none;"></div>'+
                '<div class="coulbox_cursor" data-color="'+teinte+'"></div>'+
              '</div>';
      }
      return c ;
    },
    // Retourne le code HTML pour les boutons
    code_boutons:function(){
      return  '<div class="buttons" style="text-align:right;">'+
                '<div style="float:left;color:white;font-family:courier;">'+
                  '<div>Text: <span id="coulbox_value_text"></span></div>'+
                  '<div>Fond: <span id="coulbox_value_fond"></span></div>'+
                '</div>'+
                '<input type="button" value="OK" onclick="Couleur.Pick.on_choose()" />'+
              '</div>'
    }
  }
}