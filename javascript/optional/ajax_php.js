window.Ajax = {
	// URL pour appeler le script Ajax
	// @noter que contrairement à mes autres applications, qui appellent un fichier
	// propre, PureJSTests utilise toujours `tests.php` que ce soit pour charger
	// l'application de test ou pour traiter les requêtes ajax.
	url:window.location.href,
  options:null,
  
  // Envoie une requête Ajax
  // @param   data      Les données à envoyer
  //                    @note: peut contenir 'pour_suivre' qui sera mis dans les options.
  // @param   options   Les options, à commencer par la méthode pour suivre :
  //                    pour_suivre
  //                    OU la méthode pour suivre
  // 
  send:function(data, options){
    if('undefined'==typeof options)options = {};
    else if ('function' == typeof options) options = {pour_suivre: options}
    if('undefined' != typeof data.pour_suivre){
      options.pour_suivre = data.pour_suivre;
      delete data.pour_suivre;
    }
    this.options = options;
    $.ajax({
      url     : this.url,
      type    : 'POST', 
      data    : {data:data, ajax:1},
      success : $.proxy(this.on_success, this),
      error   : $.proxy(this.on_error, this)
      });
  },
  on_success:function(data, textStatus, jqXHR){
    // console.dir({
    //   jqXHR:jqXHR, textStatus:textStatus, data:data
    // })
    if(this.options.pour_suivre) this.options.pour_suivre(data);
    // console.dir(data);
    return true;
  },
  on_error:function(jqXHR, errStatus, error){
    if(console)console.dir(jqXHR);
    alert("CROTTE… " + error);
  }
}