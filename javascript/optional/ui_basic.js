/*
 *  Définit des méthodes de base pour l'UI
 *
 *
 *  METHODS
 *  -------
 *
 *    UI.is_text_field(<DOM Element|jQuery Set>)
 *  
 */
if('undefined' == typeof UI) UI = {}
$.extend(UI,{

  /*
   *  Return TRUE if +foo+ is a TEXTAREA or a INPUT[type text]
   *  
   */
  is_text_field:function(foo)
  {
    var tagname = $(foo)[0].tagName.toLowerCase()
    if( tagname == 'textarea') return true
    return tagname == 'input' && $(foo).attr('type').toLowerCase() == "text"
  }
  
})