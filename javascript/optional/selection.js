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
  /**
    * Retourne le texte autour de la sélection
    * @method around
    * @usage  :  Selection.around(<obj>, <params>)
    * @param {jQuerySet|DOMElement} obj   L'objet DOM
    * @param {Object} params  Paramètres définissant ce qu'il faut remonter
    *   @param  {Boolean} before    Si True (par défaut), le texte avant la sélection
    *   @param  {Number}  length    La longueur de texte qu'il faut prendre.
    * @return {Object} contenant {content:le texte, start:début, end: fin}
    */
  around:function(obj, params)
  {
    if(undefined != obj.jquery) obj = obj[0]
  	var t     = obj.value
  	var start = obj.selectionStart
  	var end   = obj.selectionEnd
    if(undefined == params.before) params.before = true
    if(params.before)
    {
      end    = parseInt(start,10)
      start -= params.length
    }
    else
    {
      start  = parseInt(end,10)
      end   += params.length
    }
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
    $(obj)[0].focus()
  	$(obj)[0].setSelectionRange(dsel.start, dsel.end) ;
  },
  
  /**
    * Met la sélection courante de l'objet +obj+ à la valeur +value+
    * et place le curseur et la nouvelle sélection en fonction des
    * valeur de +options+.
    *
    * @method set
    * @param  obj     {DOM Element|set jQuery} Objet visé
    * @param  value   {String} Pour le moment, seulement un code HTML
    *                 Si contient `_$_', le dollar sera remplacé par 
    *                 le texte actuel.
    * @param {Hash} Options pour l'insertion
    *   @param {Boolean|Number} options.end   Si TRUE, on place le curseur à la fin
    *                             Si un nombre `x` on place le curseur à x de la fin (-1 par exemple pour placer juste avant)
    *   @param {Number} options.length  Longueur de la sélection finale.
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
    if(undefined != options.end)
    {
      if('number' == typeof options.end) end_selection += options.end
      cursor = {in:end_selection, out:end_selection + (options.length || 0)}
    } 
    else cursor = {in:old_from,      out:end_selection}
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