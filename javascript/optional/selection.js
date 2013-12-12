/*
 *  Objet Selection
 *  ---------------
 *  Gestion de la sélection courante
 *  
 */
window.Selection = {
  
  /*
   *  Retourne les données de sélection du DOM Element +obj+
   *
   *  @param  obj   DOM Element ou set jQuery
   *  
   */
  of:function(obj)
  {
    if(undefined != obj.jquery) obj = obj[0]
  	var t     = obj.value
  	var start = obj.selectionStart
  	var end   = obj.selectionEnd
  	return {content	:	t.substring(start, end), start:	start, end:	end };
  },
  
  /*
   *  Sélectionne dans +obj+ d'après les données fournies
   *  par +dselection+
   *  
   *  @param  obj     {DOMElement} ou {jQuerySet}
   *  @param  dsel    {Hash} définissant `start' et `end' 
   */
  select:function(obj, dsel)
  {
  	$(obj)[0].setSelectionRange(dsel.start, dsel.end) ;
    $(obj)[0].focus()
  },
  
  /*
   *  Mettre la sélection courant à la valeur +value+
   *
   *  @param  obj     {DOM Element|set jQuery} Objet visé
   *  @param  value   {String} Pour le moment, seulement un code HTML
   *                  Si contient `_$_', le dollar sera remplacé par 
   *                  le texte actuel.
   *  @param  options {Hash} Options pour l'insertion
   *                    end   :   Si TRUE, on place le curseur à la fin
   *
   */
  set:function(obj, new_value, options)
  {
    
    if(undefined == options) options = {}
    if(undefined != obj.jquery) obj = obj[0]

    var current_scroll = obj.scrollTop

    var obj_selection = Selection.of(obj)
    var obj_value     = obj.value
    var old_from      = obj_selection.start
    var old_to        = obj_selection.end
    
    // Le nouveau texte
    if(new_value.indexOf('$') > -1)
    {
      new_value = new_value.replace(/_\$_/, obj_selection.content)
    }
    var text_avant = obj_value.substring(0, old_from)
    var text_apres = obj_value.substring(old_to, obj_value.length)
    obj.value = text_avant + new_value + text_apres
    
    // Sélection du nouveau contenu
    var cursor ;
    var end_selection = old_from + new_value.length
    if(options.end) cursor = {in:end_selection, out:end_selection}
    else            cursor = {in:old_from,      out:end_selection}
  	obj.setSelectionRange(cursor.in, cursor.out) ;
	  obj.focus();
  	obj.scrollTop = current_scroll ;
    
  },
  
  get:function()
  {
    return window.getSelection()
  },
  
  data:function()
  {
    
  }
  
}