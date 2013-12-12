/*
    Fonction "L", pour la gestion plus facile des listes (Array et Hash)

  REQUIRED
  --------

    utils.js

*/
// On définit la liste par L(<liste>)
// Et ensuite on peut utiliser les méthodes en envoyant la méthode
// en premier attribut.
// Par exemple :
//    var maliste = [1,2,4];
//    L(maliste).each(function(foo){
//      console.log(foo);
//    });
//    // Va écrire en console 1, 2, 4 ligne à ligne.
// 
//    new_liste = L(maliste).remove(2)
window.L = function(liste){
  var a = new _Array(liste);
  return a;
}
window._Array = function(liste){
  this.liste = liste;
  return this;
}
_Array.prototype.each = function(fct){
  if('array' == exact_typeof(this.liste)){
    for(var i in this.liste){
      fct(this.liste[i]);
    }
  }else{
    for(var k in this.liste){
      fct(k, this.liste[k]);
    }
  }
  return this;
}


/*
 *  Collecte les données dans un {Array} ou un {Hash}
 *  
 *  Le premier argument de collect doit être une fonction
 *  qui retourne TRUE si l'élément doit être conservé et
 *  FALSE dans le cas contraire.
 *
 */
_Array.prototype.collect = function(fct){
  var collecteds = []
  if('array' == exact_typeof(this.liste)){
    for (var i in this.liste)
    {
      if(fct( this.liste[i] )) collecteds.push( this.liste[i] )
    }
  } else {
    for(var k in this.liste)
    {
      if(fct(k, this.liste[k])) collecteds.push(k)
    } 
  }
  return collecteds;
}
// Même que précédent, mais retourne un string des éléments join
// avec le séparateur +sep+ ("" par défaut)
_Array.prototype.collectj = function( fct, sep ){
  if(undefined == sep) sep = ""
  return this.collect(fct).join(sep)
}
_Array.prototype.remove = function(foo){
  var newliste = [];
  for(var i in this.liste){
    if(this.liste[i]==foo) continue;
    newliste.push(this.liste[i]);
  }
  return newliste;
}
