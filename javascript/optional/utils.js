function method_exists( m ){  return typeof m == 'function'   }
function isset(foo){          return "undefined"!=typeof foo  }
function defined(foo){        return "undefined"!=typeof foo  }
function not_defined(foo){    return "undefined"==typeof foo  }
function is_nil(foo){         return not_defined(foo) || foo == null }
function is_function(foo){    return 'function' == typeof foo }
function is_string(foo){      return 'string'   == typeof foo }
function is_array(foo){
  if (typeof foo != 'object') return false ;
  return defined( foo.length ) && foo.class != 'object';
}
// Pour pouvoir utiliser cette méthode, il faut soit que l'objet soit un
// vrai objet (c'est-à-dire sans .length défini, soit, si .length est défini
// qu'il contienne aussi la propriété `class' mise à 'object')
function is_object( foo ){
  if (typeof foo != 'object') return false ;
  return false == defined( foo.length ) || foo.class == 'object' ;
}

// Retourne le « type exact » de la valeur +valeur+
// array, integer, float (marge d'erreur si aucune décimale), 'nan', 'infinity', 'null', etc. 
function exact_typeof(valeur){
	switch(typeof valeur){
		case 'function'	:
			// if(this.toString().indexOf('.') > -1) return 'method'
			return 'function'
		case 'object'		:
			if(valeur === null)                   return 'null'
      if(valeur instanceof RegExp)          return 'regexp'
			if('function' == typeof valeur.slice) return 'array'
			else return 'object'
		case 'number'		:
			var tos = valeur.toString()
			if(tos == "NaN") 				return "nan"
			if(tos == "Infinity") 	return "infinity"
			if(tos.indexOf('.')>-1) return 'float'
			else 										return 'integer'
		default: return typeof valeur // 'string', 'boolean'
	}
}
