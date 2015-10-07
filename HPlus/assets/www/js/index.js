/************************************************************

				ANDROID MAIN JS FILE

*************************************************************/

function _______ANDROID_______() {
	// fake function per leggere nell'elenco funzioni la versione
}

/**************************** init **************************/

// url del service SOAP
/*
var baseSoapURL = "http://hplus-test.dataforge.ch:8080/AndroidWebservice/services/"; // url webservice test -- geo coords
var baseSoapURL = "http://hplus-dev.dataforge.ch:8080/AndroidWebservice/services/"; // url webservice intermedio di sviluppo
*/
var baseSoapURL = "http://webservice.spitalinformation.ch:8080/AndroidWebservice/services/"; // url webservice finale

// dati delle clicniche (evita il ricaricamento da web service)
var clinicGlobalData = {};

// dati di pagina
var page_data = {};				// contenitore dati per la pagina attuale

var pageName;					// nome con estensione della pagina attuale
var shortPageName;				// nome breve (senza estensione) della pagina attuale
var pageParams = {};			// parametri get della pagina attuale
	pageParams.cat = "";

var pageCache = [];				// elenco delle pagine attraversate (per caching)

var connectionError;			// errore di connessione

var maxDistance = 200;			// distanza massima per la ricerca
var maxClinics = 15;			// numero massimo di cliniche
var alertDistanceLimit = 20;	// distanza limite per l'alert

var SVGSupport; 				// flag di supporto per SVG (non supportato da Android < 3)

var stopGPSResults; 			// flag per evitare di mostrare la geoloc in caso di interruzione

var saveTownFlag = true;

var firstRun = true;

var imageMaxScale = 200;		// massimo resize per l'immagine reha

// elenco pagine dipendenti da DB --> bloccate in assenza di connessione e scelta città
var DBPages = [
	"cat.html", "subcat.html", "elenco.html", "dettaglio.html", "casi.html"
];

var appStorage = {};			// sostituisce localStorage non più necessario

// possibile estensione futura (dovessero aumentare le variazioni sulle pagine)
/*
var pageProps = {
		"home.html": {
			blockNoTown: false,
			blockNoConn: false
		},
		"emergenza.html": {
			blockNoTown: false,
			blockNoConn: false
		},
		"telefona.html": {
			blockNoTown: false,
			blockNoConn: false
		},
		"semaforo.html": {
			blockNoTown: false,
			blockNoConn: false
		},
		"rianimazione.html": {
			blockNoTown: false,
			blockNoConn: false
		},
		"info_utili.html": {
			blockNoTown: false,
			blockNoConn: false
		},
		"cat.html": {
			blockNoTown: true,
			blockNoConn: true
		},
		"subcat.html": {
			blockNoTown: true,
			blockNoConn: true
		},
		"elenco.html": {
			blockNoTown: true,
			blockNoConn: true
		},
		"dettaglio.html": {
			blockNoTown: true,
			blockNoConn: true
		},
		"casi.html": {
			blockNoTown: true,
			blockNoConn: true
		},
		"test.html": {
			blockNoTown: false,
			blockNoConn: false
		}
};
*/


/**************************** debug functions **************************/

function navigatorRedefine() {
	if (!navigator.notification) {
		console.log("navigator.notification redefinition");
		navigator.notification = {};
		navigator.notification.alert = function() {
			alert(arguments[0]);
		}	
	};
	if (!navigator.connection) {
		console.log("navigator.connection redefinition");
		navigator.connection = {};
		navigator.connection.type = "Ethernet";
		Connection = {};
		Connection.NONE = "";
	};
}

function printObj(theObj) {
	var outString = "";
	var i;
	
	for (i in theObj) {
		//if (typeof(theObj[i]) != "function")
			outString += i  + ": " + theObj[i] + "\n";
		
	}
	return outString;
}

function DBG() {
	// console.log("--------- DBG ----------");
	// console.log("active page: " + $.mobile.activePage.text());
	// console.log("window size: " + $(window).width() + ", " + $(window).height());

	console.log("page pos: " + $("[data-role='page']").offset().left + ", " + $("[data-role='page']").offset().top);
	console.log("page size: " + $("[data-role='page']").outerWidth() + ", " + $("[data-role='page']").outerHeight());
	// console.log("page text: " + $("[data-role='page']").text());

	console.log("content pos: " + $("[data-role='content']").offset().left + ", " + $("[data-role='page']").offset().top);
	console.log("content size: " + $("[data-role='content']").outerWidth() + ", " + $("[data-role='page']").outerHeight());
	// console.log("content text: " + $("[data-role='content']").text());

	console.log("cases_table pos: " + $("#cases_table").offset().left + ", " + $("#cases_table").offset().top);
	console.log("cases_table size: " + $("#cases_table").outerWidth() + ", " + $("#cases_table").outerHeight());
	console.log("------------------------");
}

function changeRes() {
	var scale = prompt("scala", 3);
	if (scale) {
		$('meta[name="viewport"]').attr("content", "user-scalable=no, initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=1, width=device-width, height=device-height");
		alert($('meta[name="viewport"]').attr("content"));
	}
}

function isTouchDevice() {
	return !!('ontouchstart' in window);
}

function changeTouchWithClick() {
	// DBG -- sostituisco il touchend con il click se non disponibile
	if (!isTouchDevice()) {
		$('[ontouchend]').each(function() {
			$(this).attr("onclick", $(this).attr("ontouchend"));
		});
	}
}

function clickToTap() {
	// sostituisco onclick con il tap di quojs
	if (isTouchDevice()) {
		$('[onclick]').each(function() {
			var exec = $(this).attr("onclick");
			$(this).removeAttr("onclick");
			$$(this).tap(function(evt) {
				eval(exec);
				evt.preventDefault();
			}); 
		});
	}
}


/**************************** general functions **************************/

function AndroidSVGCorrect() {
	// sostituisce gli SVG in pagina con la corrispondente immagine png -------------------- ANDROID < 3
	// console.log("AndroidSVGCorrect");
	if (!SVGSupport) {
		// console.log("  ------- changing svg to png");
		// cambio tutte le img
		svgeezy.init(false, 'png');
		// intervengo sui css
		$(".svgcss").addClass("nosvg");
	}
}

function goBack(evt) {
	// gestione del pulsante di back
	
	showPreloader(false);
	
	evt.preventDefault();
	evt.stopPropagation();
	
	// se era aperto il pannello opzioni lo chiudo
	if (parseInt($("#options_panel").css("right")) >= 0)
		moveOptionsPanel("out");
	else {
		// se eravamo alla home, esco dall'app
		if (pageCache.length == 0) {
			navigator.app.exitApp();
		} else {
			// ci sono pagine in cache, ricarico la precedente
			var prev = pageCache.pop();
			$("#no_result").hide();
			$("#base_page").html(prev.html);
			
			 // se siamo tornati alla home, rimetto a posto tutto
			if (pageCache.length == 0) {
				$("body").addClass("lightgrey_bg");
				$("#back_button").hide();
				if (appStorage.ort != "" && appStorage.plz != "")
				    $("#town_input").val(appStorage.plz + " " + appStorage.ort);
				locationComboSetup("#town_selector");
				AndroidSVGCorrect();
			}
		}
	}
}

function confirmCall(phone) {
	// conferma di chiamata
	if (device.platform == "iOS") // iOS presenta un alert di conferma automaticamente, non serve
		location.href = "tel:" + phone;
	else // Win/Andr non presentano un alert di conferma, lo mostro
		navigator.notification.confirm(
			languages.general._confirm_call[appStorage.sys_lang].replace("###", phone),
			function (btn) {
				if (btn == 1)
					location.href = "tel:" + phone;
			},
			phone,
			languages.general._btn_labels[appStorage.sys_lang]
		);
}

function openMap() {
	// apre la mappa sul punto prescelto
	var param;
	
	// decido il parametro da passare all'URL swlla mappa
	if ($("#map_link").attr("lat") && $("#map_link").attr("lon")) // ricavo lat e long dal link
		param = $("#map_link").attr("lat") + "," + $("#map_link").attr("lon");
	else // non ci sono lat e long --> fallback: parametro generale dall'indirizzo	
		param = encodeURIComponent($("span[data_link='address']").text() + " " + $("span[data_link='plz']").text() + " " + $("span[data_link='ort']").text());
	
	// console.log("coords", $("#map_link").attr("lat"), $("#map_link").attr("lon"));
	// console.log("param", param);
	// uso una substr perché win torna "WinCE" per WP7 e "Win32NT" per WP8
	switch (device.platform.substr(0,3).toLowerCase()) {
		case "ios": // --> maps.apple.com 
			var mapURL = "http://maps.apple.com/?q=" + param;
			break;
		case "and": //  --> maps.google.com
			var mapURL = "http://maps.google.com/?q=" + param;
			break;
		case "win": // --> bing map
			// maps:{streetAddress} {addressLocality} {addressRegion} {postalCode} {addressCountry}
			var mapURL = "maps:" + param;
			break;
	}

	window.open(mapURL, "_system");
}

function openMailTo(theMail) {
	// apre la mail app del device con theMail nel campo To:
	if (theMail && theMail != "--")
		location.href = "mailto:" + theMail;
}

function openBrowserURL(theURL) {
	// apre il browser del device su theURL
	if (theURL.indexOf("http") == -1)
		theURL = "http://" + theURL;
	window.open(theURL, "_system");
}

function getPageData(pageUrl) {
	/* estrae i page data da un url in formato MIME
	es: www/home.html?cat=em&id=123
		pageName		string --> home.html
		shortPageName	string --> home
		pageParams		object --> {cat: "em", id: 123}
	*/
	
	var page_obj = {};
	
	// divido path da parametri
	pageUrl = pageUrl.split("?");
	
	// nome pagina semplice (senza cartelle)
	page_obj.pageName = pageUrl[0].split("/").pop();
	
	// nome pagina breve (senza suffisso)
	page_obj.shortPageName = page_obj.pageName.split(".")[0];
	
	// parametri
	page_obj.pageParams = {};
	page_obj.pageParams.cat = "";
	
	if (pageUrl[1]) { // c'è una string di parametri non vuota
		var i,nameValue;
		
		// divido la stringa parametri sul carattere &
		var paramArray = pageUrl[1].split("&");
		
		// percorro l'array dei parametri generando i parametri di uscita
		for (i in paramArray) {
			// divido la coppia nome=valore sul carattere =
			nameValue = paramArray[i].split("=");
			// aggiungo name: value al risultato
			page_obj.pageParams[nameValue[0]] = nameValue[1];
		}
	}
	
	return page_obj;
};

function formatTelephone(phone, mode) {
	// dal 26.6.2013 i numeri sono già formattati nel DB
	if (mode == "none")
		return phone;
	if (mode == "int")
		return "+" + phone.substr(0, 2) + "-" + phone.substr(2, 2) + "-" + phone.substr(4);
	else
		return "00" + phone.substr(0, 2) + " " + phone.substr(2, 2) + " " + phone.substr(4);
}

function changeGeneralPageTitle(cat, lang) {
	if (cat) {
		languages.general["_page_title"][lang] = languages.general["_" + cat + "_page_title"][lang];
	}
};

function setPageLanguage(lang) {
	// sostituisco le stringhe di lingua nella pagina attuale (shortPageName)
	
	changeGeneralPageTitle(page_data.pageParams.cat, lang);
	
	function changeLanguageStrings(stringObj) {
		// carico le stringhe a partire dai valori registrati in languages cercandole col selettore attributo
		var i;
		if (page_data.shortPageName == "emergenza") // per emergenza bisogna rispettare il grassetto
			for (i in stringObj) {
				$("[string_id='" + i + "']").html(stringObj[i][lang]);
			}
		else
			for (i in stringObj) {
				$("[string_id='" + i + "']").text(stringObj[i][lang]);
			}
	}
	// carico sempre le stringhe generali
	changeLanguageStrings(languages.general);
	// infine carico le stringhe della pagina attuale
	changeLanguageStrings(languages[page_data.shortPageName]);
	// casi particolari
	$("#town_input").attr("placeholder", languages.home.town_placeholder[lang]); // placeholder input città - home
};

function confirmResetAppLanguage(lang, old_lang) {
	// decide se reimpostare la lingua dell'app a quella indicata
	lang = lang.substr(0, 2).toLowerCase();
	// controllo che la lingua sia una di quelle disponibili
	if (!language_codes[lang])
		lang = "de";
	if (!old_lang) { // non c'era una lingua precedentemente attiva
		// salvo le preferenze utente
	    appStorage.sys_lang = lang;
		// cambio la lingua mostrata
		setPageLanguage(lang);
	} else { // c'era una lingua precedentemente attiva
		if (lang != old_lang) { // ed era diversa da quella di sistema attuale
			// salvo le preferenze utente
		    appStorage.sys_lang = lang;
			setPageLanguage(lang);
		}
	}
};

function changeLanguage(new_lang) {
	// imposta la lingua a seguito di un click sul pulsante
	// vecchia versione: click su bandiera cambia lingua nella pagina attuale
	// confirmResetAppLanguage(new_lang, appStorage.sys_lang);
	// variazione 7.6.2013: click sulla bandiera cambia lingua e porta alla home
    appStorage.sys_lang = new_lang;
	loadPage("home.html");
	moveOptionsPanel("out");
}

function getSystemLanguage() {
	// legge la lingua impostata nel device e la imposta per l'app
	navigator.globalization.getPreferredLanguage(
		function (language) { // success
			confirmResetAppLanguage(language.value, appStorage.sys_lang)
		},
		function () { // error
			navigator.notification.alert('Error getting device language.');
		}
	);
};

function blockWithErrorMsg(status, errMsg) {
	// blocca (o sblocca) l'interazione con l'app con un eventuale messaggio di errore
	if (errMsg) {
		$("#error_message").text(errMsg);
		$("#error_message").show();
	} else
		$("#error_message").hide();
	if (status)
		$("#page_mask").show();
	else
		$("#page_mask").hide();
}


function checkConnection() {
	// legge lo stato della connessione internet del device
	if (navigator.connection.type == Connection.NONE) {
	    blockWithErrorMsg(true, languages.general._no_connection[appStorage.sys_lang]);
		connectionError = "no_network";
	} else {
		blockWithErrorMsg(false, "");
		connectionError = "";
	}
};

function showPreloader(show) {
	// apre lo schermo di blocco con animazione della rotella
	
	if (show) {
		// correggo l'animazione se Android < 4 (non funziona appieno l'animazione CSS3)
		var animStyle = device.platform == "Android" && device.version < "4" ? "spinner old" : "spinner";
		$.blockUI({
			message: "<img id='preloader_img' class='" + animStyle + "' src='img/spinner.png'>",
			css: { 
				// background: "url(img/spinner.gif) center center no-repeat rgba(255, 255, 255, 0.5)",
				"background-color": "rgba(255, 255, 255, 0.5)",
				border: "none",
				height: "100%",
				left: 0,
				top: 0,
				width: "100%"
			}
		});
	} else
		$.unblockUI();
};

function moveOptionsPanel(direction) {
	// gestione del pulsante delle options
	var rightPos;
	if (direction == "in") { 
		rightPos = 0;
		$("#options_panel_mask").show();
	} else {
		rightPos = -$("#options_panel").outerWidth();
		$("#options_panel_mask").hide();
	}
	$("#options_panel").animate({
		right: rightPos
	});
}

function showImpressum(show) {
	if (show) {
		$("#impressum").show(400);
	} else
		$("#impressum").hide(400);
}

function popupToggle(state, evt, popupHTML) {
	// gestione del popup --- state: open/close, evt: evento, popupHTML: html nel popup
	evt.stopPropagation();
	evt.preventDefault();
	var popup = $("#popup");
	var popupArrow = $("#popup_arrow");
	if (state == "open") {
		// posiziono la freccina (x: dx target, y: centro verticale target)
		popupArrow
			.show()
			.offset({
				left: $(evt.target).offset().left + $(evt.target).outerWidth() - popupArrow.outerWidth() / 2,
				top: $(evt.target).offset().top + $(evt.target).outerHeight() / 2 - popupArrow.outerHeight() / 2
			});
		// posiziono il box (x: dx freccina, y: centro target se non esce, appoggiato sopra/sotto altrimenti)
		popup
			.html(popupHTML)
			.show()
			.on({
				"click": function(clickevt) {
					popupToggle("close", clickevt);
					clickevt.preventDefault();
				}
			})
			.offset({ // tento il posizionamento verticale centrato sul link (i)
				left: popupArrow.offset().left + popupArrow.outerWidth(),
				top: $(evt.target).offset().top + $(evt.target).outerHeight() / 2 - $("#popup").outerHeight() / 2
			});
		// controllo che il popup stia tutto dentro il viewport
		if (popup.offset().top < 0) // usciamo da sopra?
			popup.offset({ top: 0});
		else if	(popup.offset().top + popup.outerHeight() > $("#base_page").height()) // usciamo da sotto?
			popup.offset({ top:  $("#base_page").height() - popup.outerHeight()});		
		$("#page_mask").css("opacity",0.01).show();
	} else {
		popup
			.hide()
			.off('click');
		popupArrow.hide();
		$("#page_mask").removeAttr("style").hide();
	};
}

function toggleImageResize(theImg) {
	// console.log("toggleImageResize", theImg);
	var baseAxis = $(theImg).attr("baseaxis");
	// console.log(baseAxis, $(theImg).css(baseAxis), $(theImg)[0].style[baseAxis]) // piccola --> ingrandisco
	if ($(theImg)[0].style[baseAxis] == "100%") // piccola --> ingrandisco
		$(theImg).css(baseAxis, imageMaxScale + "%").css({
			left: $(theImg).attr("origleft") + "px",
			top: 0
		});
	else // grande --> rimpicciolisco
		$(theImg).css(baseAxis, "100%").css({
			left: $(theImg).attr("origleft") + "px",
			top: 0
		});
}

function imageSwipeSetup(imgSel) {
	// var di base
	var touchLimitMs = 200; // limite in ms sotto cui si considera tap
	var touchLimitDistance = 10; // distanza limite tra un drag e un tap
	
	var touchStartTime = 0; // inizio del tocco in ms (lo uso anche come flag di avvenuto mousedown per il drag)
	var clickDistance; // distanza del punto di touch iniziale dall'angolo alto/sx
	var touchStartPt; // posizione dell'inizio del touch
	var dragBounds; // limiti di spostamento nel drag
	var dragging = false; // flag di drag
	
	// console.log("------------ imageSwipeSetup");
	$(imgSel).on({
		
		"touchstart": function(evt) {
			evt.preventDefault();
			/*
			console.log("touchstart");
			console.log("evt.originalEvent:", evt.originalEvent);
			*/
			touchStartTime = evt.timeStamp; // registro il tempo di primo touch (per decidere se tap)
			touchStartPt = { // punto iniziale di touch
				x: evt.originalEvent.touches[0].pageX,
				y: evt.originalEvent.touches[0].pageY
			};
			if ($(this).width() > $(this).parent().width()) { // immagine in ingrandimento, attivo il drag
				dragBounds = {
					left: $(this).parent().width() - $(this).width(),
					top: $(this).parent().height() - $(this).height(),
					right: 0,
					bottom: 0
				};
				clickDistance = { // distanza del punto iniziale di touch dal top/left dell'immagine
					x: evt.originalEvent.touches[0].pageX - $(this).position().left,
					y: evt.originalEvent.touches[0].pageY - $(this).position().top
				};
				dragging = true;
				/*
				console.log("image: " + $(this).width() + ", " + $(this).height());
				console.log("scroller: " + $(this).parent().width() + ", " + $(this).parent().height());
				console.log("touchStartPt: ", touchStartPt);
				*/
				// console.log("dragBounds --> x: (" +  dragBounds.left + "," + dragBounds.right + ") --- y: (" + dragBounds.top + "," + dragBounds.bottom + ")" );
			}
		},
		
		"touchmove": function(evt) { // dragging
			// console.log("touchStartTime", touchStartTime);
			evt.preventDefault();
			if (dragging) {
				var newx = evt.originalEvent.touches[0].pageX - clickDistance.x;
				var newy = evt.originalEvent.touches[0].pageY - clickDistance.y;
				// limito lo spostamento
				//     sulle x
				if (newx < dragBounds.left)
					newx = dragBounds.left;
				else if (newx> dragBounds.right)
					newx = dragBounds.right;
				//     sulle y
				if (newy < dragBounds.top)
					newy = dragBounds.top;
				else if (newy > dragBounds.bottom)
					newy = dragBounds.bottom;
				$(this).css({
					left: newx,
					top: newy
				});
				// console.log("new pos:", newx, newy, " ---- obj pos:", $(this).css("left"), $(this).css("top"));
			}
		},
		
		"touchend": function(evt) {
			evt.preventDefault();
			/*
			console.log("touchend");
			console.log("evt.originalEvent:", evt.originalEvent);
			*/
			var dt = evt.timeStamp - touchStartTime;
			var dx = Math.abs(touchStartPt.x - evt.originalEvent.changedTouches[0].pageX);
			var dy = Math.abs(touchStartPt.y - evt.originalEvent.changedTouches[0].pageY);
			
			dragging = false; // comunque termino il drag
			
			// era un tap?
			if (dx < touchLimitDistance && dy < touchLimitDistance && dt <= touchLimitMs) { // sì, era un tap
				// ridimensiono l'immagine
				toggleImageResize(this);
			};
		}
	});
}

function correctForFooter(added_y_space) {
	// aggiunge spazio al piede alle pagine col footer
	if (shortPageName == "rianimazione") // la pagina rianimazione va gestita in modo differente
		$("#bottom_footer").prev().css("bottom", $("#bottom_footer").outerHeight() + added_y_space);
	else
		$("#bottom_footer").prev().css("margin-bottom", $("#bottom_footer").outerHeight() + added_y_space);
}
	

/**************************** SOAP functions **************************/
/*
VIP se testate in un browser, usare Safari!!!
non funziona con Chrome, Firefox per problemi di sandbox e sicurezze varie
*/


function createSOAPRequest(soapOp, soapFlds) {
	// genera la request SOAP con l'operation soapOp e i campi soapFlds
	var i;
	var outFlds = "";
	// genero i campi request
	for (i in soapFlds) {
		outFlds += "\
	<" + i + ">" + soapFlds[i] + "</" + i + ">";
	}
	
	var json2XML = new X2JS(); // JSON to XML string lib
	
    var xmlDocStr = json2XML.json2xml_str(soapFlds);
	
	return '\
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://com/hplus/websvc">\
	<soapenv:Header/>\
	   <soapenv:Body>\
		  <web:' + soapOp + '>' +
		  xmlDocStr + '\
		  </web:' + soapOp + '>\
   </soapenv:Body>\
</soapenv:Envelope>';
};

function clearTownText() {
	// cancella il testo della ricerca città al tap sulla x
	$("#town_input").val("");
	// cancello i dati in appStorage
	appStorage.ort = "";
	appStorage.plz = "";
	saveTownFlag = false;
	// riporto il focus nel campo se l'aveva prima del tap esterno --------------------------------- TODO?
	//$("#town_input").focus();
}

function saveTownInput(townData) {
	// salva la città inserita in appStorage
	townData = townData.split(" ");
	appStorage.plz = townData.shift();
	appStorage.ort = townData.join(" ");
}

function loadTownInput() {
	// torna i dati della città in appStorage
    return appStorage.plz  + " " + appStorage.ort;
}

function locationComboSetup(baseJQSel) {
	// gestione dell'input field per l'inserimento della località
	
	/* costruzione:
			<div>			contenitore generale (baseJQSel)
				<ul>		lista valori
				<input>		campo di inserimento
	*/
	
	// var di base
	var touchStart; // inizio touch per lo scroll
	var touchStartPt; // punto di touch per la velocità
	var touchStartTime; // inizio del tocco in ms
	var touchLimitMs = 200; // limite in ms sotto cui si considera tap
	var touchLimitDistance = 5; // distanza limite tra un drag e un tap
	var touchSpeedLimit = 1; // velocità limite per attivare uno scroll armonico
	var friction = 1.5; // coefficiente di attrito
	var minCharsLimit = 2; //minimo numero di caratteri inseriti per effettuare la ricerca
	
	var baseList = $(baseJQSel + " ul");
	var baseInput = $(baseJQSel + " input");

	var soapURL = baseSoapURL + "LocationServicePort";

	function populateTownList() {
		// riempie la lista delle città trovate su ricerca
		if (baseInput.val().length >= minCharsLimit) {// abbiamo raggiunto la soglia, apro la lista
		
			var soapParams =  {
				pattern: baseInput.val(),
				sort: 3
			};
			
			// effettuo la ricerca
			$.ajax({
				url: soapURL,
				type: "POST",
				dataType: "xml",
				data: createSOAPRequest("getPlzOrt", soapParams),
				contentType: "text/xml; charset='utf-8'",
				beforeSend: function(xhr) {
					xhr.setRequestHeader('SOAPAction', soapURL);
				},
				success: function(theXML) {

					var html = "";
					var townData = $("plzOrt", theXML);
					if (townData.length > 0)
						// popolo la lista
						$.map(townData, function(item) {
							html += "<li>" + $(item).text() + "</li>";
						});
					else
						html = "<li align='center'> --- </li>";
					
					baseList.html(html).show().css({
						bottom: baseInput.position().top + baseInput.outerHeight() + 8,
						"max-height": baseInput.offset().top - $(window).scrollTop() - $("#header_spacer").height(),
						overflow: "hidden",
						width: baseInput.width() + 12
					});
					// spengo tutte le righe della lista
					baseList.children().removeClass("blue-hilite");
					// se ci sono dati validi accendo la I riga
					if (townData.length > 0)
						baseList.children().eq(0).addClass("blue-hilite");
					
				}
				// questa funzione non ha una callback d'errore perché non deve mostrare i messaggi di crisi del server
			})
		} else { // siamo sotto la soglia
			// nascondo la lista
			baseList.hide();
		}
	}
	
	// nascondo e posiziono la lista
	baseList.hide();
			
	// gestione tastiera nell'input
	baseInput.on({
		
		"keyup": function(evt) {
			if (evt.keyCode == 13)
				$(this).blur();
			else
				populateTownList();
		},
		
		"focus": function (evt) {
			evt.stopPropagation();
			if (navigator.connection.type != Connection.NONE)
				populateTownList();
			else {
			    navigator.notification.alert(languages.general._no_connection[appStorage.sys_lang], null, languages.general._alert[appStorage.sys_lang]);
				saveTownFlag = false;
				baseInput.blur();
			}
		},
		
		"blur": function (evt) { // -------------------------- evento base: il field ha perso il focus
			// se il blur avviene per tap sulla lista o su conferma/fine, registro i dati
			// altrimenti ripristino il contenuto precedente del campo

			if (saveTownFlag) {
				// salvo la selezione in memoria (CAP e città)
				if ($(baseJQSel + " li.blue-hilite").length > 0)
					var selectData = $(baseJQSel + " li.blue-hilite").text();
				else
					var selectData = "";
				baseInput.val(selectData);
				saveTownInput(selectData);
				// vuoto il campo GPS
				$("#current_gps").html("&nbsp;");
				// rimetto a grigio l'icona GPS
				$("#icon_gps").attr("src", "img/gps_icon.svg");
				AndroidSVGCorrect();
			}
				
			// in ogni caso chiudo la lista risultati
			baseList.hide();
			
			saveTownFlag = true;
			
		}
	});
	
	// gestione touch events
	baseList.on({
		
		"touchstart": function(evt) {
			evt.preventDefault();
			// fermo l'eventuale animazione della lista
			$(this).stop();
			touchStart = $(this).scrollTop() + evt.originalEvent.touches[0].pageY;
			touchStartTime = evt.timeStamp;
			touchStartPt = {
				x: evt.originalEvent.touches[0].pageX,
				y: evt.originalEvent.touches[0].pageY
			};
			// hilite della riga toccata
			$(".blue-hilite").removeClass("blue-hilite");
			$(evt.target).addClass("blue-hilite");
		},
		
		"touchmove": function(evt) {
			evt.preventDefault();
			$(this).scrollTop(touchStart - evt.originalEvent.touches[0].pageY);
		},
		
		"touchend": function(evt) {
			evt.preventDefault();
			var dt = evt.timeStamp - touchStartTime;
			var dy = touchStartPt.y - evt.originalEvent.changedTouches[0].pageY;
			var y_speed = dy / dt * 1000;
	
			// c'è stato un tap nella lista?
			if (Math.abs(dy) < touchLimitDistance && dt <= touchLimitMs) { // sì, è un tap
				// flag di conferma
				saveTownFlag = true;
				// inserisco la selezione nel field e tolgo il focus ------------- gestito dal blur() ----- baseInput.val($(evt.target).text()).blur();
				baseInput.blur();
			}
			
			// scroll armonico
			if (Math.abs(y_speed) > touchSpeedLimit) {
				$(this).animate({
					scrollTop: "+=" + y_speed / friction
				});
			}
		}
		
	});
};

function loadGeolocation() {
	// accede alle funzioni di geolocazione del device
	// e carica la,posizione dal service SOAP
	var img_type = SVGSupport ? "svg" : "png";
	
	if ($("#icon_gps").hasClass("anim_gps")) { // l'utente ha cliccato mentre era in  corso una geolocation
		// fermo l'animazione e rimetto l'icona base
		$("#icon_gps").removeClass("anim_gps").attr("src", "img/gps_icon." + img_type);
		// blocco i risultati
		stopGPSResults = true;
	} else {
		stopGPSResults = false;
		$("#icon_gps").attr("src", "img/gps_icon." + img_type).addClass("anim_gps");
		
		navigator.geolocation.getCurrentPosition(
			function (position) { // on success
				// console.log("geolocation ok - stopResults: " + stopGPSResults + " - position: " + position.coords.latitude + ", " + position.coords.longitude);
				if (stopGPSResults) // risultati bloccati
					return;
			
				var soapWS = "getLocationInfo";
				var soapURL = baseSoapURL + "LocationServicePort";
				var soapParams = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					};
				
				$.ajax({
					url: soapURL,
					type: "POST",
					dataType: "xml",
					// data: soapData,
					data: createSOAPRequest(soapWS, soapParams),
					contentType: "text/xml; charset='utf-8'",
					beforeSend: function(xhr) {
						xhr.setRequestHeader('SOAPAction', soapURL);
					},
					success: function(theXML) {
						// salvo la città trovata
						var selectedTown = $("ort", theXML).text();
						var thePlz = $("plz", theXML).text();
						// fermo l'animazione dell'icona
						$("#icon_gps").removeClass("anim_gps").attr("src", "img/gps_icon_succ." + img_type);
						// salvo la posizione in memoria
						appStorage.plz = thePlz;
						appStorage.ort = selectedTown;
						// azzero la pos nel combo field
						$("#town_input").val("");
						// e la scrivo nella riga di testo
						$("#current_gps").text(thePlz + " " + selectedTown);
			
						// DBG -- sostituisco il touchend con il click se non disponibile
						// changeTouchWithClick();
		
					},
					error: function(jqXHR, textStatus, errorThrown) {
						$("#icon_gps").removeClass("anim_gps").attr("src", "img/gps_icon_err." + img_type);
						navigator.notification.alert(textStatus + "\n" + errorThrown, null, languages.general._alert[appStorage.sys_lang]);
					}
				});
			},
			function (error) { // errore del GPS
			
				// console.log("geolocation ok - stopResults: ", stopGPSResults);
				if (stopGPSResults) // risultati bloccati
					return;
					
				$("#icon_gps").removeClass("anim_gps").attr("src", "img/gps_icon_err." + img_type);
				// navigator.notification.alert('GPS ERROR\ncode: ' + error.code + '\n' + 'message: ' + error.message + '\n');
				$("#current_gps").html("<em>" + languages.general._not_found[appStorage.sys_lang] + "</em>");
			}
		);
	}
};

function populateCatList(cat) {
	// popola la lista delle categorie ---------- Akutspital, Psych, reha
	// per tutte le categorie di questo livello bisogna passare al SOAP
	// i 2 parametri langid e sort (sempre 3, alfabetico diretto)
	
	// console.log("---------------- populateCatList ---------------------------------- ");
	
	// preparo i parametri per la ricerca SOAP
	var soapParams = {
			langId: language_codes[appStorage.sys_lang], // lingua, dal appStorage
			sort: 3	// ordinamento alfabetico
		};
		
	switch (cat) {
		case "ac": // acute
			var soapWS = "getServiceGroups";
			var nextPage = "elenco.html";
			// clinic id --> serve per le ricerche da akut
			soapParams.serviceRangeId = page_data.pageParams.cid;
			break;
		case "ps": // psycs
			var soapWS = "getPsycs";
			var nextPage = "elenco.html";
			break;
		case "re": // reha
			var soapWS = "getRehas";
			var nextPage = "elenco.html";
			break;
	}
	
	// calcolo il titolo generale delle pagine categorie
	changeGeneralPageTitle(cat, appStorage.sys_lang);
	
	var soapURL = baseSoapURL + "ServiceTypePort";
	
	$.ajax({
		url: soapURL,
		type: "POST",
		dataType: "xml",
		data: createSOAPRequest(soapWS, soapParams),
		contentType: "text/xml; charset='utf-8'",
		beforeSend: function(xhr) {
			xhr.setRequestHeader('SOAPAction', soapURL);
			showPreloader(true);
		},
		success: function(theXML) {
			var list = $("serviceType", theXML);
			if (list.length != 0) {
				
				var popupHTML, html = '';
				// campi utili DB
				var _id, _info, _name;
				
				// preparo le righe di selezione da aggiungere alla lista
				$.map(list, function(item) {
					// estraggo i campi utili dal db
					_id = $("id", item).text();
					_info = $("info", item).text();
					_name = $("name", item).text();
					// preparo il popup
					popupHTML = _name  + "<hr>" +  _info;
					// preparo l'html
					html += '\
					<li class="has_arrow svgcss">\
						<a href="#popup" class="popup_link" onclick="popupToggle(\'open\', event, $(this).attr(\'popup-html\'))" popup-html="' + popupHTML + '"><img src="img/i.svg" width="25" height="25" /></a>\
						<a href="javascript: loadPage(\'' + nextPage + '?cat=' + cat + '&cid=' + _id + '\')">' + _name + '</a>\
					</li>';
				});
				// aggiungo l'html
				$("#elencoCat").append(html);
				
			} else // nessun risultato, mostro il banner
				$("#no_result").show();

		},
		error: function(jqXHR, textStatus, errorThrown) {
			navigator.notification.alert(textStatus + "\n" + errorThrown, null, languages.general._alert[appStorage.sys_lang]);
		},
		complete: function() {
			// DBG -- sostituisco il touchend con il click se non disponibile
			// changeTouchWithClick();
			// correggo gli SVG
			AndroidSVGCorrect();
				
			showPreloader(false);
		}
	});
};


function populateSubcatList(cat, cid) {
	// popola la lista delle sotto-categorie ---------- solo Akutspital

	// console.log("---------------- populateSubcatList ---------------------------------- ");
	
	switch (cat) {
		case "ac": // acute
			var soapWS = "getServiceRanges";
			var nextPage = "cat.html";
			var sortCode = 3;
			break;
		case "em": // emergency
			var soapWS = "getEmergencyCategories";
			var nextPage = "elenco.html";
			var sortCode = 1;
			break;
	}
	
	// preparo i parametri per la ricerca SOAP
	var soapParams = {
			langId: language_codes[appStorage.sys_lang], // lingua, dal appStorage
			sort: sortCode	// ordinamento a seconda del tipo di ricerca
		};
	
	// calcolo il titolo generale delle pagine categorie
	changeGeneralPageTitle(cat, appStorage.sys_lang);
	
	var soapURL = baseSoapURL + "ServiceTypePort";
	
	$.ajax({
		url: soapURL,
		type: "POST",
		dataType: "xml",
		data: createSOAPRequest(soapWS, soapParams),
		contentType: "text/xml; charset='utf-8'",
		beforeSend: function(xhr) {
			xhr.setRequestHeader('SOAPAction', soapURL);
			showPreloader(true);
		},
		success: function(theXML) {
			var list = $("serviceType", theXML);
			if (list.length != 0) {
					
				var html = "";
				// campi utili DB
				var _id, _name;
				
				// preparo le righe di selezione da aggiungere alla listview
				$.map(list, function(item) {
					// estraggo i campi utili dal db
					_id = $("id", item).text();
					_name = $("name", item).text();
					// preparo l'html
					// 2013-08-07 --> se veniamo da Emergenza, psichiatria (id = 5)  ha un richiamo al footer
					html += '<li class="has_arrow svgcss"><a href="#" onclick=\'loadPage("' + nextPage + '?cat=' + cat + '&cid=' + _id + '")\'>' + _name + (cat == "em" && _id == "5" ? "*" : "") + '</a></li>';
				});
				$("#elencoGrup").append(html);
				
			// se veniamo da Emergenze mostro il banner per psych
			if (cat == "em")
				$(".content").append("<div id='bottom_footer' class='grouped_data_cell base_padding'>\
					<span class='group_star'>*</span><p string_id='psych_footer'>" + languages.subcat.psych_footer[appStorage.sys_lang] + "</p>\
					</div>");

				
			} else // nessun risultato, mostro il banner
				$("#no_result").show();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			navigator.notification.alert(textStatus + "\n" + errorThrown, null, languages.general._alert[appStorage.sys_lang]);
		},
		complete: function() {
			// DBG -- sostituisco il touchend con il click se non disponibile
			// changeTouchWithClick();
			// correggo gli SVG
			AndroidSVGCorrect();
			showPreloader(false);
		}
	});
};


function populateHospitalList(cat, cid) {
	// popola la lista delle cliniche
	/* per tutte le categorie di questo livello bisogna passare al SOAP i parametri
			id		
			langid
			sort (sempre 3, alfabetico diretto)
	
	VIP		il sistema ritorna TUTTI i dati dell'ospedale nell'XML
			evito una nuova chiamata al service registrando i dati in un array associativo
			(clinicGlobalData) che riuso nella pagina di dettaglio
	*/
	
	// console.log("---------------- populateHospitalList ---------------------------------- ");

	switch (cat) {
		case "em": // emergency
			var soapWS = "getEmergencyHospitalList";
			var idName = "categoryId";
			var sortCode = 9;
			var showCases = false;
			$("#casi, .block_title [string_id='num_cases'], .block_title br").hide();
			$(".block_title p.right").css("padding-top", "+=7");
			break;
		case "ac": // acute
			var soapWS = "getServiceGroupHospitalList";
			var idName = "serviceGroupId";
			var sortCode = 11;
			var showCases = true;
			$("#star").text("*");
			var stars = "**"; // asterischi da mettere accanto ai casi
			break;
		case "ps": // psycs
			var soapWS = "getPsycHospitalList";
			var idName = "psycId";
			var sortCode = 9;
			var showCases = false;
			var stars = "*"; // asterischi da mettere accanto ai casi
			$("#casi, .block_title [string_id='num_cases'], .block_title br").hide();
			$(".block_title p.right").css("padding-top", "+=7");
			break;
		case "re": // reha
			var soapWS = "getRehaHospitalList";
			var idName = "rehaId";
			var sortCode = 9;
			var showCases = false;
			$("#casi, .block_title [string_id='num_cases'], .block_title br").hide();
			$(".block_title p.right").css("padding-top", "+=7");
			break;
	}
	var nextPage = "dettaglio.html";
	
	// preparo i parametri per la ricerca
	var soapParams = {
			searchParam: {
			    ort: appStorage.ort,
			    plz: appStorage.plz,
				distance: maxDistance,
				langId: language_codes[appStorage.sys_lang]
			},
			sort: sortCode
		};
	// aggiungo il nome del codice id di ricerca (è diverso per ogni categoria, porcattroia!)
	soapParams[idName] = cid;
	
	var soapURL = baseSoapURL + "ClinicServicePort";
	var json2XML = new X2JS(); // JSON to XML string lib
	
	$.ajax({
		url: soapURL,
		type: "POST",
		dataType: "xml",
		data: createSOAPRequest(soapWS, soapParams),
		contentType: "text/xml; charset='utf-8'",
		beforeSend: function(xhr) {
			xhr.setRequestHeader('SOAPAction', soapURL);
			showPreloader(true);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			navigator.notification.alert(textStatus + "\n" + errorThrown, null, languages.general._alert[appStorage.sys_lang]);
		},
		success: function(theXML) {
			var list = $("clinic", theXML);
			
			if (list.length != 0) {
				
				var html = "";
				var cData, cases;
				var groupedData = false;
				var clinicCnt = 0;
				var firstCicle = true;
				var minDistance;
				// campi utili DB
				var _clinicid, _clinicnm, _address, _plz, _ort, _cases, _isDatagroup, _drivedistance;
				
				// preparo la raccola dei dati delle cliniche
				clinicGlobalData = new Object();
				// preparo le righe di selezione da aggiungere alla listview
				$.map(list, function(item) {
										
					// estraggo i campi utili dal DB
					_clinicid = $("clinicid", item).text();
					_clinicnm = $("clinicnm", item).text();
					_address = $("address", item).text();
					_plz = $("plz", item).eq(0).text();
					_ort = $("ort", item).eq(0).text();
					_cases = $("cases", item).text();
					_isDatagroup = $("isDatagroup", item).text();
					_drivedistance = $("drivedistance", item).text();

					// salvo nei dati globali i dati della clinica attuale
					clinicGlobalData[_clinicid] = json2XML.xml2json(item);
					cData = _clinicnm + '<br>' + _address + " " + _plz + " " + _ort;

					// mostro i casi solo se previsto (ac, ps)
					if (showCases) {
						cases = _cases != "0" ? _cases : "&nbsp;";
						// se ci sono dati raggruppati, testo in corsivo con asterisco
						if (_isDatagroup == "true") {
							cases = '<br /><span class="casi"><em>' + cases + stars + '</em></span>';
							groupedData = true;
						} else
							cases = '<br /><span class="casi">' + cases + '</span>';
					} else 
						cases = "";
					html += '\
						<tr onclick=\'loadPage("' + nextPage + '?cat=' + cat + '&cid=' + cid + '&hid=' + _clinicid + '")\'>\
							<td class="valign_top base_padding" >' + cData + '</td>\
							<td class="align_right valign_top base_padding" style="padding-left: 0"><span class="km">' + _drivedistance + '</span>' + cases + '</td>\
						</tr>';
						
					// salvo il I valore di Km
					if (firstCicle) {
						firstCicle = false;
						minDistance = parseFloat(_drivedistance);
					}
					/* nessun limite alle cliniche 3/7/2013
					if (++ clinicCnt > maxClinics - 1)
						return false;
					*/
				});
				
				if (minDistance && minDistance > alertDistanceLimit) {
				    navigator.notification.alert(languages.elenco.no_near_clinic[appStorage.sys_lang] + alertDistanceLimit + " km", null, languages.general._alert[appStorage.sys_lang]);
				}
				
				if (groupedData) { // ci sono dati raggruppati
					if (cat == "ac") // acut mostra 2 blocchi con */**
						$(".content").append("<div id='bottom_footer' class='grouped_data_cell base_padding'>\
							<span class='group_star'>*</span><p string_id='group_footer_1' style='margin-bottom: 5px'>" + languages.elenco.group_footer_1[appStorage.sys_lang] + "</p>\
							<span class='group_star'>**</span><p string_id='group_footer_2'>" + languages.elenco.group_footer_2[appStorage.sys_lang] + "</p>\
							</div>");
					else // psych mostra 1 blocco con *
						$(".content").append("<div id='bottom_footer' class='grouped_data_cell base_padding'>\
							<span class='group_star'>*</span><p string_id='group_footer_2'>" + languages.elenco.group_footer_2[appStorage.sys_lang] + "</p>\
							</div>");
				}
					
				$("#elencoOsp").append(html);
				
			} else { // nessun risultato
				$("#no_result").show();
				$("#myfooter").hide();
			}
			
		},
		complete: function() {
			showPreloader(false);
			// DBG -- sostituisco il touchend con il click se non disponibile
			// changeTouchWithClick();
			// correggo gli SVG
			AndroidSVGCorrect();
			// aggiusto la distanza per l'eventuale footer
			correctForFooter(5);
		}
	});
};


function populateDetail(cat, cid, hid) {
	// popola il dettaglio di una clinica
		
	// console.log("---------------- populateDetail ---------------------------------- ");
	var i;
	
	// carico i dati da clinicGlobalData
	var clinicData = clinicGlobalData[hid];
	
	// console.log(clinicData);
	for (i in clinicData) {
		if (i.indexOf("_") == -1) {
			if (clinicData[i].__text) {
				// console.log("[data_link='" + i + "'] (" + $("[data_link='" + i + "']").length + ") --> ",clinicData[i].__text);
				$("[data_link='" + i + "']").text(clinicData[i].__text);
			}
		}
	}
	
	// preparo la chiamata telefonica diretta all'ospedale
	if (clinicData.contactphone.__text != "")
		$("#contactphone").attr("href", "tel:" + clinicData.contactphone.__text);
	// preparo la mail diretta all'ospedale
	if (clinicData.contactemail.__text != "")
		$("#contactemail").attr("href", "javascript:location.href='mailto:" + clinicData.contactemail.__text + "'");
	// preparo la visita al sito web dell'ospedale
	if (clinicData.contactweb.__text != "")
		$("#contactweb").attr("href", "javascript:window.open('http://" + clinicData.contactweb.__text + "','_system')");
		
	// preparo le coordinate della mappa
	$("#map_link").attr({
		"lat": clinicData.latitude.__text,
		"lon": clinicData.longitude.__text
	});
	
	// console.log($("#map_link").attr("lat"), $("#map_link").attr("lon"));
	
	/* ---------------------- non più richiesta 2013-08-01
	// mostro/nascondo le icone dei servizi attivi per questa clinica
	var icnCnt = 0;
	
	if (clinicData.isAkut.__text == "true") {
		$("#icon_ac_active").show();
		icnCnt ++;
	} else
		$("#icon_ac_active	").hide();
		
	if (clinicData.isPsyc.__text == "true") {
		$("#icon_ps_active").show();
		icnCnt ++;
	} else
		$("#icon_ps_active").hide();
		
	if (clinicData.isReha.__text == "true") {
		$("#icon_re_active").show();
		icnCnt ++;
	} else
		$("#icon_re_active").hide();
		
	if (icnCnt > 1)
		$(".detail_table .detail_icons").width(80);
	-------------------------------- */
	
	// mostro/nascondo la fascia Orari e i due titoli
	if (!clinicData.visittime && !clinicData.visitremark.__text) // entrambi vuoti, nascondo titoli e fascetta
		$(" #visit_hour_data").hide();		
	else { // almeno uno pieno
		if (!clinicData.visittime) // è vuoto il tempo di visita, nascondo titolo e dati corrispondenti
			$("[string_id='general'], [data_link='visittime']").hide();
		if (!clinicData.visitremark.__text) // sono vuoti i commenti, nascondo titolo e dati corrispondenti
			$("[string_id='comment'], [data_link='visitremark']").hide();
	}
		
	// mostro/nascondo le frecce per i casi trattati -------------- solo acutspital con numero valido di casi
	if (cat == "ac" && clinicData.cases.__text != "0" && clinicData.cases.__text != "") {
		$("#fascia_casi_line").show();
		// costruisco il link ai casi
		$("#fascia_casi").attr("onclick", "loadPage('casi.html?cat=" + cat + "&cid=" + cid + "&hid=" + hid + "')");
	} else {
		$("#fascia_casi_line").hide();
	}

	// ricerco i dati accessori per pronto soccorso
	var soapParams = {
			clinicId: hid, // clinica prescelta
			langId: language_codes[appStorage.sys_lang], // lingua, dal appStorage
			sort: 1	// ordinamento speciale
		};
	var soapWS = "getHospitalEmergencyData";
	var soapURL = baseSoapURL + "ClinicServicePort";
	
	$.ajax({
		url: soapURL,
		type: "POST",
		dataType: "xml",
		data: createSOAPRequest(soapWS, soapParams),
		contentType: "text/xml; charset='utf-8'",
		beforeSend: function(xhr) {
			xhr.setRequestHeader('SOAPAction', soapURL);
			showPreloader(true);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			navigator.notification.alert(textStatus + "\n" + errorThrown, null, languages.general._alert[appStorage.sys_lang]);
		},
		success: function(theXML) {
			var list = $("emergencyData", theXML);
			
			if (list.length == 0) {
				// se non ci sono dati pronto soccorso, nascondo tutto
				$("#emergency_extra_title, #emergency_extra_data, #emergency_signal_container").hide();
			} else {
	
				// preparo le righe di selezione da aggiungere alla listview
				var html = '';
				// campi utili DB
				var _id, _hours, _name, _phone;
			
				$.map(list, function(item) {
					// estraggo i campi utili dal db
					_id = $("id", item).text();
					_hours = $("hours", item).text();
					_name = $("name", item).text();
					_phone = $("phone", item).text();
					// preparo l'html
					if (_hours != " ")
						_hours = ' (' + _hours + ')';
					// 2013-08-07 --> togliere dal banner il Pronto Soccorso (id = 1)
					if (_id != "1")
						html += '<p>' + _name + _hours + '<br /><a class="blue-text normal" href="tel:' + formatTelephone(_phone, "none") + '">' + formatTelephone(_phone, "none") + '</a></p>';
				});

				if (cat == "em") { // veniamo da una ricerca per pronto soccorso
					$("#dettaglio").prepend("\
					<div id='emergency_signal_container'>\
						<emtitle class='svgcss'>" + languages.dettaglio.emerg_dep[appStorage.sys_lang] + "</emtitle>\
						<div id='emergency_signal_data'>" + html + "</div>\
					</div>");
					$("#emergency_signal_container").show();
				} else { // area emergenza x altre ricerche ---------> cambia layout (3-7-13)
					$("#fascia_casi_line").before("\
					<h5 class='block_title' id='emergency_extra_title' string_id='emerg_station'>" + languages.dettaglio.emerg_station[appStorage.sys_lang] + "</h5>\
					<div id='emergency_extra_data' class='base_padding'>"+ html + "</div>");
				}
				
			}
		},
		complete: function() {
			showPreloader(false);
			// DBG -- sostituisco il touchend con il click se non disponibile
			// changeTouchWithClick();
			// correggo gli SVG
			AndroidSVGCorrect();
		}
	});

};


function populateCaseList(cat, cid, hid) {
	// popola la lista per la sottopagina dei casi trattati ---------- solo Acutspital
	
	// console.log("---------------- populateCaseList ---------------------------------- ");
	var soapWS = "getPerformanceData";
	
	// carico i dati da clinicGlobalData
	var clinicData = clinicGlobalData[hid];

	// preparo i parametri per la ricerca SOAP
	var soapParams = {
			clinicId: hid, // clinica prescelta
			langId: language_codes[appStorage.sys_lang], // lingua, dal appStorage
			sort: 3	// ordinamento alfabetico
		};
	
	var soapURL = baseSoapURL + "ClinicServicePort";
	
	$.ajax({
		url: soapURL,
		type: "POST",
		dataType: "xml",
		data: createSOAPRequest(soapWS, soapParams),
		contentType: "text/xml; charset='utf-8'",
		beforeSend: function(xhr) {
			xhr.setRequestHeader('SOAPAction', soapURL);
			showPreloader(true);
		},
		success: function(theXML, status, xhr) {
			
			// cambio il titolo della pagina
			$("#clinic_name").text(clinicData.clinicnm.__text);
			
			// preparo le righe di selezione da aggiungere alla tabella
			var popupHTML;
			var html = '';
			// campi utili DB
			var _id, _info, _name, _cases;
			
			// se ci sono dati raggruppati inserisco il group_footer
			if (clinicData.isDatagroup.__text  == "true") {
				$("#cases_table thead").append('\
				<tr>\
					<th colspan="3" class="grouped_data_cell" string_id="group_footer_1">' + languages.casi.grouped_header[appStorage.sys_lang].replace("__inst__", clinicData.concernnm.__text) + '</th>\
				</tr>');
			}
			
			var list = $("performanceData", theXML);
			$.map(list, function(item) {
				// estraggo i campi utili dal db
				_id = $("id", item).text();
				_name = $("name", item).text();
				_info = $("info", item).text();
				_cases = $("cases", item).text();
				// prparo il popup
				popupHTML = _name  + "<hr>" +  _info;
				// inserisco il caso in rilievo
				if (_id == cid) {
					$("#cases_table thead").append('\
					<tr class="foreground">\
						<th class="valign_middle">\
							<a href="#popup" onclick="popupToggle(\'open\', event, $(this).attr(\'popup-html\'))" popup-html="' + popupHTML + '">\
								<img src="img/i.svg" width="25" height="25" class="info">\
							</a>\
						</th>\
						<th class="align_left valign_middle">' + _name + '</th>\
						<th class="align_right valign_middle">' + _cases + '</th>\
					</tr>');
				} else {
					// aggiungo solo gli ospedali con numero casi > 0
					if (_cases != "0")
						html += '\
						<tr>\
							<td class="valign_middle">\
								<a href="#popup" onclick="popupToggle(\'open\', event, $(this).attr(\'popup-html\'))" popup-html="' + popupHTML + '">\
									<img src="img/i.svg" width="25" class="info" /> \
								</a>\
							</td>\
							<td class="align_left valign_middle">' + _name + '</td>\
							<td class="align_right valign_middle">' + _cases + '</td>\
						</tr>';
					}
			});

			// aggiungo le righe preparate alla tabella
			$("#cases_table tbody").append(html);
			/*
			// preparo il click sulle (i)
			$("#cases_table a[href='#popup']").click(function(evt) {
				$("#popup").html($(this).attr("popup-html"));
				popupToggle("open", evt);
			});
			*/
			// ordino la tabella in ingresso per numero casi discendente
			sorttable.innerSortFunction.apply($("#cn")[0], []);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			navigator.notification.alert(textStatus + "\n" + errorThrown, null, languages.general._alert[appStorage.sys_lang]);
		},
		complete: function() {
			showPreloader(false);
			// DBG -- sostituisco il touchend con il click se non disponibile
			// changeTouchWithClick();
			// correggo gli SVG
			AndroidSVGCorrect();
		}
	});
};



/**************************** Phonegap **************************/


var app = {

    initialize: function() {
        // console.log("------------ initialize");
        this.bindEvents();
    },

    bindEvents: function() {
        // console.log("------------ bindEvents");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        // console.log("------------ onDeviceReady");
    
        $("#devicestatus").text("DR").css("background-color", "purple");
		
		// Phonegap: gestione back button Android/Windows
        $(document).on("backbutton", goBack);
	
		// setup linguaggio
        getSystemLanguage();
		
		// -- carico la I pagina
        // console.log("------------ loading Page");
        loadPage("home.html");

        $("#devicestatus").text("DR").css("background-color", "green");

    }
};




function loadPage(thePage) {
	// cambia pagina caricandola nel .content di index.html
		
	// ricavo nome pagina completo e breve, e parametri GET
	page_data = getPageData(thePage);
	// console.log("••• loadPage - page_data: ", page_data);
	
	// per le pagine town-dependant, mostra un alert e si blocca se manca la città scelta	console.log(navigator.connection.type, Connection.NONE, pageName, DBPages, $.inArray(pageName, DBPages));
    if ((appStorage.ort == "" || appStorage.plz == "") && $.inArray(page_data.pageName, DBPages) != -1) {
		// mostro l'alert di città da scegliere
        navigator.notification.alert(languages.general._no_town_selected[appStorage.sys_lang], null, languages.general._alert[appStorage.sys_lang]);
		return;
	}
	
	// per le pagine db-dependant, mostra un alert e si blocca se manca la connessione
	if (navigator.connection.type == Connection.NONE && $.inArray(page_data.pageName, DBPages) != -1) {
		// mostro l'alert di assenza di connessione
	    navigator.notification.alert(languages.general._no_connection[appStorage.sys_lang], null, languages.general._alert[appStorage.sys_lang]);
		return;
	}
	
    // salvo la vecchia pagina in cache
	if (thePage != "home.html") {
		$("body").removeClass("lightgrey_bg");
		pageCache.push({
			page: page_data.shortPageName,
			html: $("#base_page").html() // $(".content").attr("nocache") ? "*" : $(".content").html()
		});
	} else
		$("body").addClass("lightgrey_bg");

	// carico la nuova pagina
	$("#base_page").load(
		thePage,
		function() {
			$(document).trigger("pageload", [thePage]);
		}
	);
}

$(document).on("pageload", function(evt, pageData) {
	// decido cosa fare al caricamento di ogni pagina
	
	// console.log("----------pageload---------");
	
		/*
		pageUrl = pageUrl.split("?");
		// nome pagina completo e breve
		pageName = pageUrl[0].split("/");
		pageName = pageName[pageName.length - 1];
		shortPageName = pageName.split(".");
		shortPageName = shortPageName[0];
		// parametri
		page_data.pageParams = extractGET(pageUrl[1]);
		*/
	// console.log("pageload - page name: " + page_data.pageName);
	// console.log("pageload - pageParams: ", page_data.pageParams);
	$("#back_button").show();
	$("#no_result").hide();
				
	// sostituisce gli SVG in pagina con la corrispondente immagine png -------------------- ANDROID < 3
	AndroidSVGCorrect();
	
	// elimino l'eventuale click associato al body da rianimazione
	$("body").off("click");
	
	// selettore pagina attuale
	switch (page_data.pageName) {
		
		case "home.html": // home page --- STATIC
			// GPS automatico, boh
			if (firstRun) {
				// console.log("loading geoloc - ", appStorage.sys_lang);
				loadGeolocation();
				firstRun = false;
			}
			
			// setup combo-box per la location
			locationComboSetup("#town_selector");
			
			// nascondo il btn indietro per la home
			$("#back_button").hide();
		
			// rimetto la posizione nel box di select
			if (appStorage.ort != "" && appStorage.plz != "") {
				$("#town_input").val(appStorage.plz + " " + appStorage.ort);
			}
			
			$("body").addClass("lightgrey_bg");
			
			// reset della cache locale
			pageCache = [];
			
			// DBG -- sostituisco il touchend con il click se non disponibile
			// changeTouchWithClick();
			
			break;
		
		case "cat.html": // categorie (tutte le ricerche)
			$("[string_id='performance_group']").attr("string_id", page_data.pageParams.cat + "-performance_group");
			// console.log(page_data.pageParams.cat + "-performance_group", $("[string_id]")); 
			changeGeneralPageTitle(page_data.pageParams.cat, appStorage.sys_lang);
			populateCatList(page_data.pageParams.cat);
			break;
		
		case "subcat.html": // sottocategorie (solo Akutspital)
			$("[string_id='operation_sectors']").attr("string_id", page_data.pageParams.cat + "-operation_sectors");
			// console.log(page_data.pageParams.cat + "-operation_sectors", $("[string_id]")); 
			changeGeneralPageTitle(page_data.pageParams.cat, appStorage.sys_lang);
			populateSubcatList(page_data.pageParams.cat, page_data.pageParams.cid);
			break;
		
		case "elenco.html": // elenco cliniche (tutte le ricerche)
			changeGeneralPageTitle(page_data.pageParams.cat, appStorage.sys_lang);
			populateHospitalList(page_data.pageParams.cat, page_data.pageParams.cid);
			break;
		
		case "dettaglio.html": // dettaglio clinica
			populateDetail(page_data.pageParams.cat, page_data.pageParams.cid, page_data.pageParams.hid);
			break;
		
		case "casi.html": // subpage per i casi trattati
			populateCaseList(page_data.pageParams.cat, page_data.pageParams.cid, page_data.pageParams.hid);
			sorttable.makeSortable(document.getElementById('cases_table'));
			break;
		
		case "rianimazione.html": // schermata per la rianimazione --- STATIC
			// scelgo il tipo di immagine
			var imgScroller = $("#img_scroller");
			var rehaImg = $("#reha_img");
			
			if (SVGSupport) {
				rehaImg.attr("src", "img/" + appStorage.sys_lang + "_app_reanimation_txt.svg");
				// $("#report").text("SVG");
			} else {
				rehaImg.attr("src", "img/" + appStorage.sys_lang + "_app_reanimation.png");
				// $("#report").text("PNG");
			}
			
			setPageLanguage(appStorage.sys_lang);
			
			// aggiusto l'altezza del campo di scroll
			imgScroller.height($("#bottom_footer").offset().top - imgScroller.offset().top);
			
			/*
			// associo il click all'immagine
			rehaImg.click(function() {
				toggleImageResize(this);
			});
			*/
			
			rehaImg.load(function() { // mi assicuro che l'immagine sia caricata prima di fare i calcoli
				
				// calcolo la scala sugli assi
				// imposto l'img in modo che ci stia tutta nello scroller
				var scale = {
					x: imgScroller.width() / rehaImg.width(),
					y: imgScroller.height() / rehaImg.height()
				};
				
				// riporto tutto alla width
				if ( scale.x > scale.y) { // troppo alta, usa la y
					rehaImg.attr({
						// basescale: $("#img_scroller").height() / rehaImg.height() * $("#img_scroller").width() + "%"
						baseaxis: "height",
						origleft: (imgScroller.width() - rehaImg.width() * scale.y) / 2
					});
					// centro l'immagine
				} else // troppo larga, usa la x
					rehaImg.attr({
						// baseperc: $("#img_scroller").width() / rehaImg.width() * $("#img_scroller").height() + "%",
						baseaxis: "width",
						origleft: 0
					});
				rehaImg.css(rehaImg.attr("baseaxis"), "100%").css("left", rehaImg.attr("origleft") + "px");
				
				// gestione degli eventi tap/drag ----------- uniformati fra i tre ambienti
				imageSwipeSetup("#reha_img");
					/*
				if (device.platform == "Android" && device.version < "4")
				else { // altre piattaforme
					// console.log("drag support");
					// $("#reha_img").attr("onclick", 'toggleImageResize(this)');
					$("body").on({
						click: function(evt) {
						// console.log(evt, evt.target, evt.target.id);
						if (evt.target.id != "back_button" && evt.target.id != "options_button")
							toggleImageResize("#reha_img");
						}
					});
					rehaImg.click(function(evt) {
						toggleImageResize("#reha_img");
					});
				}
					*/
			});
			break;
			
		default: //  --- STATIC
			// changeTouchWithClick();
			break;
			
	}
		
	// traduco la pagina
	setPageLanguage(appStorage.sys_lang);
	// tolgo tutte le eventuali selezioni di testo
	getSelection().removeAllRanges();
	
	correctForFooter(0);
	
});
