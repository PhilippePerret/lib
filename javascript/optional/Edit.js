/*
    Objet Edit
    ----------
    Pour gérer l'édition
    
    DÉPENDANCES
    -----------
      - Librairie js   time.js
      - Librairie css  edit.css
    
    Définition d'une boite d'édition
    --------------------------------
    data = {
      title   : Le titre optionnel à donner à la boite
			[id			: <identifiant de la boite, qui servira pour tous ses éléments>]
      current_target:   Objet jQuery associé à la boite (p.e. pour la placer)
      focus_on:     Le champ sur lequel il faut focusser à l'activation
      fields: <les champs cf. ci-dessous>
      buttons: <les boutons cf. ci-dessous>
      == optionnelmes ==
      width   : <valeur pixel/pourcentage, largeur boite édition>
      height  : <valeur pixel, hauteur boite édition>
    }
    
    data.fieds:{
      <id>:{type:<le type>, ...data...}
    }
      Avec <le type> :
        type            data
        'input_text'    libelle:<le libellé>, default:<valeur def>
        'textarea'      libelle:<le libellé>, default:<valeur def>, width:<largeur>, height:<hauteur>
        'link'          libelle:<le libellé>,
        'eheckbox'      libelle:<le libellé>, default:<valeur>, checked:<true si coché>
    
        Pour ces data on peut ajouter :
          class     La classe CSS à utiliser
          onclick   Méthode à binder quand on click
          onchange  Méthode à binder quand la valeur change (seulement éléments possibles)
          onblur    Idem sur blur
          onfocus   Idem sur focus
          
      // Définition des boutons
      // ----------------------
      // Note: Ils sont à définir de gauche à droite
      data.buttons:{
        cancel  : <méthode à appeler quand on clique sur "Cancel">
              OU: {name:<nom autre que "Cancel">[, onclick: méthode à appeler]}
        ok      : <méthode à appeler quand on clique sur "OK">
              OU: {name:<nom autre que "OK">, onclick: méthode à appeler}
        bouton1 : {name:<nom du bouton 1>, onclick: <méthode>}
        bouton2 : Idem
      }
          
          
    @TODO:
    
*/
window.Edit = {
  current_data: null,       // Les données courantes
  
  // Affiche la boite d'édition
  // Pour l'édition d'un simple texte (input text)
  show:function(data){
    this.current_data = data;
    this.set_default_data();
    Edit.Dom.show_boite(this.current_data);
  },
  
  // Place les valeurs par défaut dans les data
  set_default_data:function(){
    var data = this.current_data;
    // …
    this.current_data = data;
  }
  
}

window.EditBox = function(data){
  this.id     = data.id || ('editbox_'+Time.now())
  this.type   = data.type 	// par exemple 'simple_text'
  this.data   = data 				// les données initiales envoyées
  
  this.html_code = null;
}

// Retourne l'objet DOM de la boite
EditBox.prototype.dom_object = function(){return $('div#'+this.id)}
// Retourne TRUE si la boite existe
EditBox.prototype.exists = function(){ return this.dom_object().length > 0}
// Construction de la boite
EditBox.prototype.build = function(){$.proxy(Edit.Dom.build_boite,Edit.Dom, this)()}
// Affiche la boite
EditBox.prototype.show = function(){ 
  $('body').append(this.html_code);
  this.observe();
  this.positionne();
  var css = {};
  if(this.data.width)   css['width']  = this.data.width;
  if(this.data.height)  css['height'] = this.data.height;
  if(css)this.dom_object().css(css);
}
// Observe la boite
EditBox.prototype.observe = function(){ 
  this.dom_object().draggable({containment:'parent'});
  Edit.Dom.set_observers(this);
}
// Récupère les valeurs entrées
EditBox.prototype.get_values = function(){
  var fds = this.data.fields, values = {}, field, value, obj ;
  for(var f_id in fds){
    if(false == fds.hasOwnProperty(f_id)) continue;
    field = fds[f_id]
    obj   = $('#'+field.dom_id)
    switch(field.type)
    {
    case 'checkbox':
      value = obj[0].checked == true
      break
    default:
      value = obj.val();
    }
    values[f_id] = value
    // console.log("Valeur du champ "+fds[f_id].dom_id+" : " + values[f_id]);
  }
  return values;
}
// Détruit la boite dans le dom et dans la liste des boites
EditBox.prototype.remove = function(){
  this.dom_object().remove();
  Edit.Dom.kill(this);
}
// Retourne l'objet DOM (jQuery) du bouton OK de la boite
EditBox.prototype.button_ok = function(){
  return $('input#'+this.id+'-ok');
}
// Retourne l'objet DOM (jQuery) du bouton CANCEL de la boite
EditBox.prototype.button_cancel = function(){
  return $('input#'+this.id+'-cancel');
}
EditBox.prototype.on_ok = function(){
  var values = this.get_values();
  this.remove();
  if('function' == typeof this.data.buttons.ok.onclick) 
    this.data.buttons.ok.onclick(values);
}
EditBox.prototype.on_cancel = function(){
  this.remove();
  if('function' == typeof this.data.buttons.cancel.onclick) 
    this.data.buttons.cancel.onclick();
}
EditBox.prototype.on_bouton1 = function(){
  if('function' == typeof this.data.buttons.bouton1.onclick) 
    this.data.buttons.bouton1.onclick();
}
EditBox.prototype.on_bouton2 = function(){
  if('function' == typeof this.data.buttons.bouton2.onclick) 
    this.data.buttons.bouton2.onclick();
}
// Place la boite près de l'élément édité s'il est fourni
EditBox.prototype.positionne = function(){
  if(! this.data.current_target) return;
  var max_bottom  = $(window).height();
  var max_right   = $(window).width();
  var obj_pos     = this.data.current_target.offset();
  var top         = obj_pos.top  + 20;
  var left        = obj_pos.left + 20;
  var hauteur_box = this.dom_object()[0].offsetHeight;
  var largeur_box = this.dom_object()[0].offsetWidth;
  // Gérer le dépassement des limites de la page
  if(top + hauteur_box > max_bottom){top  = max_bottom - hauteur_box - 10;}
  if(left + largeur_box > max_right){left = max_right - largeur_box -10;}
  this.dom_object().css({'top':top+'px', 'left':left+'px'});
}
// Met la boite au premier plan
EditBox.prototype.premier_plan = function(){
  this.dom_object().css({'z-index':5000});
  this.dom_object().addClass('actived');
}
// Recule la boite
EditBox.prototype.recule = function(){
  this.dom_object().css({'z-index':100});
  this.dom_object().removeClass('actived');
}
// Focus sur le champ d'édition donné en paramètre ou le champ par défault
// @param   field     String de l'identifiant simple (tel que défini dans <data>.fields)
//                    ou objet DOM (jQuery)
EditBox.prototype.focus_on = function(field){
  if('undefined' == typeof field){
    if(this.data.focus_on) field = this.data.focus_on;
    else field = 'title';
  }
  if('string'==typeof field) field = $('#'+this.id+'-field-'+field);
  field.focus();
  field.select();
}

/*
    Gestion de la partie DOM de l'édition
*/
Edit.Dom = {
  boites:{},          // Liste des boites ouvertes. Instances EditBox.
  stack:[],           // Liste ordonnée des boites ouvertes
  current_box:null,   // La boite courante (au premier plan)
  /*
      Main fonction: construit et affiche la boite à partir des +data+
  */
  show_boite:function(data){
    var newbox = new EditBox(data);
    this.boites[newbox.id] = newbox ;
    newbox.build();
    newbox.show();
    this.focus_on_box(newbox);
  },
  // Active au premier plan la boite +box+ (la met en boite courante)
  // @param   box   Instance EditBox de la boite à activer
  focus_on_box:function(box){
    if(this.current_box) this.current_box.recule();
    box.premier_plan();
    box.focus_on();
    this.current_box = box;
    if(this.last_box() && this.last_box().id != box.id){
      this.destack(box);
    }
    this.stack.push(box);
  },
  // Retourne la dernière fenêtre
  last_box:function(){return this.stack[this.stack.length-1]},
  // Détruit une fenêtre
  kill:function(box){
    this.destack(box);
    delete box;
    delete this.boites[this.id];
    if(this.last_box()) this.focus_on_box(this.last_box());
  },
  // Retire la boite +box+ (instance EditBox) de la pile des boites ouvertes
  destack:function(box){
    var newstack = [];
    for(var i=0, len=this.stack.length;i<len;++i){
      if(this.stack[i].id != box.id) newstack.push(this.stack[i]);
    }
    this.stack = newstack;
  },
  
  // Place les observers (sur les boutons, les champs, etc.)
  // @param   box   Instance BoxEdit
  set_observers:function(box){
    var d = box.data;
    // La boite doit passer au premier plan quand on clique dessus
    box.dom_object().bind('click focus', $.proxy(this.focus_on_box, this, box));
    // == BUTTONS ==
    for(var btn in d.buttons){
      if(false == d.buttons.hasOwnProperty(btn)) continue;
      $('input#'+box.id+'-'+btn).bind('click', $.proxy(this['on_'+btn], this));
    }
    // == FIELDS ==
    for(var f_id in box.data.fields){
      if(false == box.data.fields.hasOwnProperty(f_id)) continue;
      var dfield = box.data.fields[f_id];
      var objdom = $('#'+dfield.dom_id);
      // onclick
      if ('function'== typeof dfield.onclick){
        objdom.bind('click', dfield.onclick);
      }
      // onchange
      if ('function'==typeof dfield.onchange){
        objdom.bind('change', dfield.onchange);
      }
      // onfocus
      if ('function'==typeof dfield.onfocus){
        objdom.bind('focus', dfield.onfocus);
      }
      // onblur
      if ('function'==typeof dfield.onblur){
        objdom.bind('blur', dfield.onblur);
      }
      // Comportement spécial sur les textarea pour empêcher la raccourci RETURN
      if(dfield.type == 'textarea'){
        objdom.bind('keypress', $.proxy(this.keypress_on_textarea, this))
      }
    }
    // RETURN et ESCAPE doivent correspondre aux méthodes OK et Cancel
    if('object'==typeof UI && 'object'==typeof UI.Events){
      UI.Events.function_on_return = $.proxy(this.on_ok, this);
      UI.Events.function_on_cancel = $.proxy(this.on_cancel, this);
    }
  },
  // Construit le code HTML de la boite
  // Cf. explications
  // 
  // @param   box     Instance EditBox de la boite
  build_boite:function(box){
    box.html_code =  
            '<div class="edit_box" id="'+box.id+'">'+
              this.build_title(box)   +
              this.build_fields(box)  +
              this.build_buttons(box) +
            '</div>';
  },
  build_title:function(box){
    if(!box.data.title) return "";
    return '<div id="'+box.id+'-title" class="title">'+box.data.title.replace(/\n/g, '<br>')+'</div>';
  },
  // Construit les champs d'édition
  // @param   box   Instance BoxEdit de la boite
  // @return  Le code HTML des champs d'édition
  // @note    Ajoute la propriété `dom_id', identifiant absolu du champ d'édition
  build_fields:function(box){
    if(! box.data.fields) return "";
    var data = box.data.fields;
    var fds = '<div id="'+box.id+'-fields" class="fields">';
    var f_id, f_data;
    for(f_id in data){
      if(false == data.hasOwnProperty(f_id)) continue;
      f_data        = data[f_id];
      f_data.dom_id = box.id+"-field-"+f_id;
      fds += '<div id="div_'+box.id+'">' + this.BuildField[f_data.type](data[f_id]) + '</div>';
    }
    fds += '</div>';
    return fds;
  },
  // Construction des boutons
  // @return  Le code HTML des boutons
  build_buttons:function(box){
    var buts = '<div id="'+box.id+'-buttons" class="buttons">';
    for(var btn in box.data.buttons){
      if(false == box.data.buttons.hasOwnProperty(btn)) continue;
      // On transforme toujours la donnée en Hash, même si seule une méthode
      // a été définie
      if('object' != typeof box.data.buttons[btn] || box.data.buttons[btn]==null){
        box.data.buttons[btn] = {name:btn.capitalize(), onclick:box.data.buttons[btn]};
      }
      buts += '<input id="'+box.id+'-'+btn+'" '+
              (btn == 'cancel' ? ' class="fleft"' : '') +
              'type="button" '+
              'value="'+box.data.buttons[btn].name+'" />';
    }
    buts += '</div>';
    return buts;
  },
  /*
      Construction de tout type de champ d'édition
      
      @param    d   Hash des valeurs utiles (défini dans les data envoyées à Edit,
                    auquel a été ajouté 'dom_id', l'identifiant absolu du champ)
  */
  BuildField:{
    input_text:function(d){
      var f = "";
      if(d.libelle) f += '<span class="libelle">'+d.libelle+'</span>';
      f += '<input id="'+d.dom_id+'" name="'+d.dom_id+'" type="text" value="'+d.default+'" />';
      return f;
    },
    // écriture d'un lien
    link:function(d){
      return '<a id="'+d.dom_id+'" name="'+d.dom_id+'" href="'+(d.href || '#')+'">'+d.libelle + '</a>';
    },
    select:function(d){
      
    },
    checkbox:function(d){
      var f = ""
      f += '<input id="'+d.dom_id+'" name="'+d.dom_id+'" type="checkbox" value="'+d.default
      if(d.checked) f += ' checked="CHECKED"'
      f += '" />';
      if(d.libelle) f += '<label for="'+d.dom_id+'" class="libelle">'+d.libelle+'</label>';
      return f
    },
    textarea:function(d){
      var f = "";
      if(d.libelle) f += '<span class="libelle">'+d.libelle+'</span>';
      var sty = [];
      if(d.width  ) sty.push("width:" + d.width);
      if(d.height ) sty.push("height:" + d.height);
      f += '<textarea id="'+d.dom_id+'" name="'+d.dom_id+'" '+
              'style="'+sty.join(';')+';">'+
              (d.default || "")+
            '</textarea>';
      return f;
    },
    radio:function(d){
      
    }
  },
  // -------------------------------------------------------------------
  
  /*
      Réception des clicks sur les boutons
  */
  // Retourne l'identifiant de boite d'un élément quelconque
  get_box_id_from:function(domel){
    return $(domel).attr('id').split('-')[0]; // par exemple 'editbox_2376567'
  },
  current_box     : null, // la boite courante  (Instance EditBox)
  current_button  : null, // Objet jQuery
  // Définit la boite courante et le bouton courant (le bouton cliqué)
  get_current:function(evt){
    this.current_button = evt.currentTarget;
    this.current_box    = this.boites[this.get_box_id_from(this.current_button)];
  },
  // @Note: Ce sont des méthodes par défaut, lorsque le bouton est demandé mais
  // sans qu'une méthode propre lui soit associé.
  on_ok:function(evt){
    if(evt.type == 'keypress'){
      this.current_button = Edit.Dom.current_box.button_ok();
      this.current_box    = Edit.Dom.current_box;
    } else this.get_current(evt);
    this.current_box.on_ok();
  },
  on_cancel:function(evt){
    if(evt.type == 'keypress'){
      this.current_button = Edit.Dom.current_box.button_cancel();
      this.current_box    = Edit.Dom.current_box;
    } else this.get_current(evt);
    this.current_box.on_cancel();
  },
  on_button_2:function(evt){
    this.get_current(evt);
    this.current_box.remove();
  },
  on_button_3:function(evt){
    this.get_current(evt);
    this.current_box.remove();
  },
  keypress_on_textarea:function(evt){
    // Pour empêche RETURN => OK
    if(evt.keyCode == 13){evt.stopPropagation();}
    return true;    
  }
}