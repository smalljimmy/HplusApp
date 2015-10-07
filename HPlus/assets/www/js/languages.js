/**************************************************************

	file di traduzione per le stringhe base dell'app
	lingue previste: "de", "fr", "it"
	
	struttura gerarchica: [pagina][string id][lingua]

	convenzione: le string_id che cominciano per _ non sono associate a una pagina ma sono generali
	
***************************************************************/


// nomi delle lingue
var lang_names = {
	"de": "Deutsch",
	"fr": "français",
	"it": "italiano"
}

// codici SOAP WS dei linguaggi 
var language_codes = { 
	"de": 0,
	"fr": 1,
	"it": 2
};

// *********************************************  stringhe localizzate

var languages = {
	// ------------------- stringhe generali ------------------------
	"general": {
		"_alert": {
			"de": "Achtung",
			"fr": "Attention",
			"it": "Attenzione"
		},
		"_no_connection": {
			"de": "keine Verbindung",
			"fr": "pas de connexion",
			"it": "nessuna connessione"
		},
		"_btn_labels": {
			"de": "Ok,Abbrechen",
			"fr": "Ok,Annuller",
			"it": "Ok,Annulla"
		},
		"_title": {
			"de": "Spitalsuche",
			"fr": "Recherche d'hôpitaux",
			"it": "Ricerca ospedaliera"
		},
		"_no_town_selected": {
			"de": "Wählen Sie eine Position, bevor Sie fortfahren",
			"fr": "Sélectionnez une position avant de procéder",
			"it": "Selezionare una posizione prima di procedere"
		},
		"_em_page_title": {
			"de": "Suche nach Notfallstation",
			"fr": "Recherche par service d'urgences",
			"it": "Ricerca per pronto soccorso"
		},
		"_ac_page_title": {
			"de": "Suche nach Akutspital",
			"fr": "Recherche par hôpital de somatique aiguë",
			"it": "Ricerca per ospedale acuto"
		},
		"_re_page_title": {
			"de": "Suche nach Rehabilitationsklinik",
			"fr": "Recherche par clinique de réadaptation",
			"it": "Ricerca per clinica riabilitativa"
		},
		"_ps_page_title": {
			"de": "Suche nach Psychiatrischer Institution",
			"fr": "Rechercher par institution psychiatrique",
			"it": "Ricerca per istituzione psichiatrica"
		},
		"_page_title": { // titolo generale di pagina per gli elenchi a seguito delle ricerche
			"de": "de",
			"fr": "fr",
			"it": "it"
		},
		"_no_res": {
			"de": "Keine Ergebnisse",
			"fr": "Pas de résultats",
			"it": "Nessun risultato"
		},
		"_logo_title": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info ospedali"
		},
		"_not_found": {
			"de": "nicht gefunden",
			"fr": "pas trouvé",
			"it": "non trovato"
		},
		"_impressum": {
			"de": "Info",
			"fr": "Info",
			"it": "Info"
		},
		"_confirm_call": {
			"de": "Wollen Sie wirklich der Nummer ### anrufen?",
			"fr": "Voulez-vous appeler le numéro de téléphone ###?",
			"it": "Volete davvero chiamare il numero ###?"
		},
		"_info_editor":  {
			"de": "Herausgeber",
			"fr": "Editeur",
			"it": "Editore"
		},
		"_info_name":  {
			"de": "H+ Die Spitäler der Schweiz",
			"fr": "H+ Les Hôpitaux de Suisse",
			"it": "H+ Gli ospedali Svizzeri"
		},
		"_info_legal":  {
			"de": "Rechtliche Hinweise",
			"fr": "Informations légales",
			"it": "Informazioni giuridiche"
		},
		"_info_disclaimer": {
			"de": "H+ übernimmt keine Verantwortung und Haftung für die Richtigkeit der Angaben und für die Internetverbindung Ihres Geräts.",
			"fr": "H+ décline toute responsabilité quant à l'exactitude des indications et à la connexion internet de votre appareil.",
			"it": "H+ non si assume alcuna responsabilità per la correttezza delle informazioni e per il collegamento internet del vostro apparecchio."
		},
		"_bern": {
			"de": "Bern",
			"fr": "Berne",
			"it": "Berna"
		},
		"_tel": {
			"de": "Tel.",
			"fr": "tél.",
			"it": "Tel."
		},
		"_fax": {
			"de": "Fax",
			"fr": "fax",
			"it": "Fax"
		}
	},
	
	
	// ------------------- home ------------------------
	"home": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info ospedali"
		},
		"hospital_search": {
			"de": "Spital- und Kliniksuche",
			"fr": "Recherche des hôpitaux et cliniques",
			"it": "Ricerca degli ospedali e delle cliniche"
		},
		"emergence": {
			"de": "Bei Notfällen",
			"fr": "En cas d'urgence",
			"it": "In caso di urgenze"
		},
		"general_search_title": {
			"de": "Suchmethoden ab Ihrem Standort",
			"fr": "Recherches en fonction de votre position",
			"it": "Metodi di ricerca dal vostro luogo"
		},
		"ac_search": {
			"de": "Suche nach Akutspital",
			"fr": "Recherche par hôpital de somatique aiguë",
			"it": "Ricerca per ospedale acuto"
		},
		"re_search": {
			"de": "Suche nach Rehabilitationsklinik",
			"fr": "Recherche par clinique de réadaptation",
			"it": "Ricerca per clinica di riabilitazione"
		},
		"ps_search": {
			"de": "Suche nach psychiatrischer Institution",
			"fr": "Recherche par institution psychiatrique",
			"it": "Ricerca per istituzione psichiatrica"
		},
		"gps_title": {
			"de": "Ihr Standort",
			"fr": "Votre lieu",
			"it": "Il vostro luogo"
		},
		"gps_search": {
			"de": "lhr aktueller Standort (GPS)",
			"fr": "Votre lieu actuel (GPS)",
			"it": "Il vostro luogo attuale (GPS)"
		},
		"town_placeholder": {
			"de": "PLZ/ORT manuell eingeben",
			"fr": "insérer NPA/localité à la main",
			"it": "inserire CAP/luogo a mano"
		}
	},
	
	
	// ------------------- subcat ------------------------
	"cat": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		},
		"ps-performance_group": {
			"de": "Wählen Sie eine Leistungsgruppe",
			"fr": "Veuillez choisir un groupe de prestations",
			"it": "Scegliete un gruppo di prestazioni"
		},
		"re-performance_group": {
			"de": "Wählen Sie eine Art der Rehabilitation",
			"fr": "Veuillez choisir un type de réadaptation",
			"it": "Scegliete un tipo di riabilitazione"
		},
		"ac-performance_group": {
			"de": "Wählen Sie eine Leistungsgruppe",
			"fr": "Veuillez choisir un groupe de prestations",
			"it": "Scegliete un gruppo di prestazioni"
		}
	},
	
	
	// ------------------- cat ------------------------
	"subcat": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		},
		"em-operation_sectors": {
			"de": "Wählen Sie eine Art von Notfallstation",
			"fr": "Veuillez choisir un type de service d'urgences",
			"it": "Scegliete un tipo di pronto soccorso"
		},
		"ac-operation_sectors": {
			"de": "Wählen Sie einen Leistungsbereich",
			"fr": "Veuillez choisir un domaine de prestations",
			"it": "Scegliete un settore di prestazioni"
		},
		"psych_footer": {
			"de": "Der psychiatrische Notfalldienst umfasst Sofortmassnahmen, Triage und Organisation der weiteren Behandlungen.",
			"fr": "Le service des urgences psychiatriques inclut les mesures d'urgence, le tri et l'organisation de la poursuite du traitement.",
			"it": "Il servizio delle urgenze psichiatriche comprende misure immediate, triage e organizzazione del trattamento ulteriore."
		}
	},
	
	
	// ------------------- elenco ------------------------
	"elenco": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		}, 
		"institution": {
			"de": "Standorte",
			"fr": "Sites",
			"it": "Siti"
		},
		"num_cases": {
			"de": "Fallzahl",
			"fr": "Nombre de cas",
			"it": "Cifra per caso"
		},
		"group_footer_1": {
			"de": "Nur stationäre Fälle mit Austritt im 2011<br>Quelle: Bundesamt für Statistik",
			"fr": "Seuls les cas stationnaires avec sortie en 2011<br>Source : Office fédéral de la statistique",
			"it": "Solo casi in degenza, con dimissione nel 2011<br>Fonte: Ufficio federale di statistica"
		},
		"group_footer_2": {
			"de": "Diesem Standort sind Leistungsdaten der gesamten Institution hinterlegt",
			"fr": "Les données de prestations affichées pour ce site sont celles de l'ensemble de l'institution",
			"it": "I dati delle prestazioni presentati presso questa sede si riferiscono all'intera istituzione"
		},
		"no_near_clinic": {
			"de": "Keine Ergebnisse im Umkreis von ",
			"fr": "Pas de résultats dans le rayon de ",
			"it": "Nessun risultato nei dintorni di "
		}
	},
	
	
	// ------------------- dettaglio ------------------------
	"dettaglio": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		},
		"emerg_dep": {
			"de": "Dies ist ein Spital mit Notfallstation",
			"fr": "Cet hôpital dispose d'un service d'urgences",
			"it": "Si tratta di un ospedale con un reparto di pronto soccorso"
		},
		"tele_numb": {
			"de": "Zentrale Notfallnummer",
			"fr": "Numéro d'urgence central",
			"it": "Numero centrale di emergenza"
		},
		"surgical": {
			"de": "Medizinisch-chirurgisch",
			"fr": "Médico-chirurgical",
			"it": "Medico-chirurgico"
		},
		"children": {
			"de": "Kinder",
			"fr": "Pediatriqué",
			"it": "Pediatrico"
		},
		"ob_gyn": {
			"de": "Geburtshilfe/Gynäkologie",
			"fr": "Obstétrique/Gynécologique",
			"it": "Ginecologia/Ostetricia"
		},
		"psico": {
			"de": "Psychiatrisch",
			"fr": "Psychiatrique",
			"it": "Psichiatrico"
		},
		"ocular_emerg": {
			"de": "Augennotfall",
			"fr": "Urgences oculaires",
			"it": "Emergenze oculari"
		},
		"location": {
			"de": "Standort",
			"fr": "Site",
			"it": "Sede"
		},
		"contact": {
			"de": "Kontakt",
			"fr": "Coordonnées",
			"it": "Contatti"
		},
		"reception": {
			"de": "Empfang",
			"fr": "Réception",
			"it": "Ricezione"
		},
		"visit_hours": {
			"de": "Besuchszeiten",
			"fr": "Heures de visite",
			"it": "Orari delle visite"
		},
		"general": {
			"de": "Allgemein",
			"fr": "Général",
			"it": "In generale"
		},
		"comment": {
			"de": "Bemerkung",
			"fr": "Remarque",
			"it": "Osservazione"
		},
		"emerg_station": {
			"de": "Notfallstationen",
			"fr": "Services d'urgences",
			"it": "Reparti di pronto soccorso"
		},
		"cases_line": {
			"de": "Fallzahlen",
			"fr": "Nombres de cas",
			"it": "Cifre per caso"
		}
	},
	
	
	// ------------------- casi ------------------------
	"casi": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		},
		"grouped_header": {
			"de": "Diesem Standort sind die Leistungsdaten der gesamten Institution “__inst__” hinterlegt.",
			"fr": "Les données de prestations affichées pour ce site sont celles de l'ensemble de l'institution “__inst__”.",
			"it": "I dati delle prestazioni presentati presso questa sede si riferiscono all'intera istituzione “__inst__”."
		},
		"perf_group": {
			"de": "Leistungsgruppe",
			"fr": "Groupe de prestations",
			"it": "Gruppo di prestazioni"
		},
		"num_cases": {
			"de": "Fallzahl",
			"fr": "Nombre de cas",
			"it": "Cifra per caso"
		}
	},
	
	
	// ------------------- emergenza ------------------------
	"emergenza": {
		"serious_emerg": {
			"de": "Sanitätsnotruf",
			"fr": "Appel d'urgence sanitaire",
			"it": "Chiamata d'emergenza sanitaria"
		},
		"useful_info": {
			"de": "Nützliche Hinweise",
			"fr": "Informations utiles",
			"it": "Informazioni utili"
		},
		"no_danger": {
			"de": "Keine Lebensgefahr",
			"fr": "Pas de danger de mort",
			"it": "Nessun pericolo di vita"
		},
		"notice_1": {
			"de": "Bitte wenden Sie sich zuerst an <strong>Ihre Hausarztpraxis oder an die nächstgelegene Apotheke</strong>.",
			"fr": "Adressez-vous d'abord à votre <strong>médecin de famille ou à la pharmacie la plus proche</strong>.",
			"it": "Siete pregati di rivolgervi dapprima allo <strong>studio del vostro medico di famiglia o alla prossima farmacia</strong>."
		},
		"notice_2": {
			"de": "Falls <strong>diese nicht erreichbar sind</strong>, suchen Sie eine Notfallstation.",
			"fr": "<strong>Au cas où ces derniers ne sont pas atteignables</strong>, cherchez une station d'urgences.",
			"it": "<strong>Se questi non dovessero essere raggiungibili</strong>, cercate un pronto soccorso."
		},
		"seek_hospital": {
			"de": "Spital mit Notfallstation suchen",
			"fr": "Chercher un hôpital avec service d'urgences",
			"it": "Cercare un ospedale con reparto di pronto soccorso"
		},
		"intoxication_call": {
			"de": "<strong>Bei Vergiftungen</strong><br>145 (Tox-Zentrum)",
			"fr": "<strong>En cas d'empoisonnement</strong><br>145 (Centre «Tox»)",
			"it": "<strong>In caso di intossicazioni</strong><br>145 (centro tossicologico)"
		},
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		},
		"case_emerg": {
			"de": "Bei Notfällen",
			"fr": "En cas d'urgence",
			"it": "In caso di urgenze"
		},
		"case_serious_emerg": {
			"de": "Bei schweren Notfällen",
			"fr": "En cas d'urgence grave",
			"it": "In caso di urgenze gravi"
		},
		"emerg_footer": {
			"de": "H+ übernimmt keine Verantwortung und Haftung für die Richtigkeit der Angaben und für die Internetverbindung Ihres Geräts.",
			"fr": "H+ décline toute responsabilité quant à l'exactitude des indications et à la connexion internet de votre appareil.",
			"it": "H+ non si assume alcuna responsabilità per la correttezza delle informazioni e per il collegamento internet del vostro apparecchio."
		}
	},
	
	
	// ------------------- info_utili ------------------------
	"info_utili": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		},
		"useful_info_emerg": {
			"de": "Nützliche Hinweise bei Notfällen",
			"fr": "Informations utiles pour les situations d'urgence",
			"it": "Informazioni utili per le emergenze"
		},
		"rep_scheme": {
			"de": "Meldeschema",
			"fr": "Schéma d'alarme",
			"it": "Schema di chiamata"
		},
		"tel_144": {
			"de": "Anruf auf die 144",
			"fr": "Appel au 144",
			"it": "Chiamare il 144"
		},
		"light_scheme": {
			"de": "Ampelschema",
			"fr": "Règle ORA",
			"it": "Schema del semaforo"
		},
		"how_behave": {
			"de": "Wie handle ich?",
			"fr": "Comment se comporter?",
			"it": "Come comportarsi?"
		},
		"reviving": {
			"de": "Reanimation",
			"fr": "Réanimation",
			"it": "Rianimazione"
		},
		"BLS_AED": {
			"de": "Nach BLS+AED",
			"fr": "Selon BLS+AED",
			"it": "Secondo BLS+AED"
		},
		"notice_3": {
			"de": "Es lohnt sich, die Hinweise regelmässig zu wiederholen und auswendig zu lernen. ",
			"fr": "Il vaut la peine de se remémorer régulièrement ces informations et de les apprendre par cœur.",
			"it": "Vale la pena ripassare regolarmente le informazioni e studiarle a memoria."
		},
		"notice_4": {
			"de": "Ihre richtige Reaktion kann Leben retten!",
			"fr": "Une réaction appropriée peut sauver des vies!",
			"it": "Se reagite correttamente, potete salvare una vita!"
		},
		"notice_5": {
			"de": "Erste Hilfe Kurse können beim Samariterverbund und beim Schweizerischen Roten Kreuz wiederholt werden.",
			"fr": "Pour rafraîchir vos connaissances, vous pouvez suivre un cours de premiers secours de l'Alliance des samaritains ou de la Croix-Rouge suisse.",
			"it": "I corsi soccorritori possono essere rinfrescati regolarmente presso l'associazione samaritani e la Croce Rossa Svizzera."
		},
		"_footer": {
			"de": "Quelle: Schweizerischer Samariterbund, modifiziert durch den IVR",
			"fr": "Source: Alliance suisse des samaritains, modifié par l'IAS",
			"it": "Fonte: Federazione svizzera dei samaritani, modificato dall'IAS"
		}
	},
	
	
	// ------------------- semaforo ------------------------
	"semaforo": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		},
		"light_scheme_behave": {
			"de": "Ampelschema - wie reagiere ich?",
			"fr": "Règle ORA – Comment se comporter?",
			"it": "Schema del semaforo – come comportarsi?"
		},
		"observe": {
			"de": "Schauen",
			"fr": "Observer",
			"it": "Osservare"
		},
		"assess_sit": {
			"de": "Situation überblicken!",
			"fr": "Evaluer la situation",
			"it": "Valutare la situazione"
		},
		"what_hap": {
			"de": "Was ist geschehen?",
			"fr": "Que s'est-il passé?",
			"it": "Che cosa è successo?"
		},
		"who_involved": {
			"de": "Wer ist beteiligt?",
			"fr": "Qui est impliqué?",
			"it": "Chi è coinvolto?"
		},
		"who_affected": {
			"de": "Wer ist betroffen?",
			"fr": "Qui est blessé?",
			"it": "Chi è colpito?"
		},
		"think": {
			"de": "Denken",
			"fr": "Penser",
			"it": "Pensare"
		},
		"rec_danger": {
			"de": "Gefahr erkennen",
			"fr": "Reconnaître le danger",
			"it": "Riconoscere il pericolo"
		},
		"no_danger_res": {
			"de": "Gefahr für Helfende ausschliessen",
			"fr": "Ecarter tout danger pour les sauveteurs",
			"it": "Escludere pericolo per i soccorritori"
		},
		"no_danger_pers": {
			"de": "Gefahr für andere Personen ausschliessen",
			"fr": "Ecarter tout danger pour d'autres personnes",
			"it": "Escludere pericolo per altre persone"
		},
		"no_danger_pat": {
			"de": "Gefahr für Unfallopfer ausschliessen",
			"fr": "Ecarter tout danger pour les patients",
			"it": "Escludere pericolo per il paziente"
		},
		"act": {
			"de": "Handeln",
			"fr": "Agir",
			"it": "Agire"
		},
		"pers_protection": {
			"de": "Selbstschutz",
			"fr": "Protection personnelle",
			"it": "Protezione personale"
		},
		"rep_accident": {
			"de": "Unfallstelle absichern und signalisieren",
			"fr": "Protéger et signaler le lieu de l'accident",
			"it": "Assicurare e segnalare il luogo dell'infortunio"
		},
		"turn_off_mac": {
			"de": "Maschinen und Geräte abschalten",
			"fr": "Couper les moteurs",
			"it": "Disinserire le macchine"
		},
		"emerg_aid": {
			"de": "Nothilfe leisten",
			"fr": "Donner les premiers secours",
			"it": "Prestare i primi soccorsi"
		},
		"_footer": {
			"de": "Quelle: Schweizerischer Samariterbund, modifiziert durch den IVR",
			"fr": "Source: Alliance suisse des samaritains, modifié par l'IAS",
			"it": "Fonte: Federazione svizzera dei samaritani, modificato dall'IAS"
		}
	},
		
		
	// ------------------- telefona ------------------------
	"telefona": {
		"hospital_info": {
			"de": "Spitalinformation",
			"fr": "Info hôpitaux",
			"it": "Info sull'ospedali"
		},
		"call_144": {
			"de": "Anruf auf die 144 – Meldeschema",
			"fr": "Appel au 144 – schéma d'alarme",
			"it": "Chiamare il 144 – schema di chiamata"
		},
		"scheme_where": {
			"de": "Wo?",
			"fr": "Où?",
			"it": "Dove?"
		},
		"scheme_who": {
			"de": "Wer?",
			"fr": "Qui?",
			"it": "Chi?"
		},
		"scheme_what": {
			"de": "Was?",
			"fr": "Quoi?",
			"it": "Che cosa?"
		},
		"scheme_when": {
			"de": "Wann?",
			"fr": "Quand?",
			"it": "Quando?"
		},
		"scheme_how": {
			"de": "Wieviele?",
			"fr": "Combien?",
			"it": "Quante?"
		},
		"scheme_other": {
			"de": "Weiteres?",
			"fr": "Autres?",
			"it": "Altro?"
		},
		"scheme_confirm": {
			"de": "Rückmeldung",
			"fr": "Confirmation",
			"it": "Conferma"
		},
		"place_injury": {
			"de": "Wo genau ist der Notfallort?",
			"fr": "Où exactement est survenu l'accident?",
			"it": "Dov'è esattamente l'urgenza?"
		},
		"infomation_call": {
			"de": "Rückrufnummer und Name des Anrufers",
			"fr": "Numéro de rappel et nom de l'appelant",
			"it": "Numero di telefono e nome della persona che sta chiamando"
		},
		"kind_accident": {
			"de": "Art des Notfalls",
			"fr": "Type d'urgence",
			"it": "Genere di urgenza"
		},
		"when_happened": {
			"de": "Zeitpunkt des Notfalls",
			"fr": "Moment de l'évènement",
			"it": "Orario dell'urgenza"
		},
		"presents_status": {
			"de": "Anzahl und Zustand der Personen, Art der Verletzungen",
			"fr": "Nombre et état des patients, types de blessures",
			"it": "Numero e stato dei pazienti, genere di lesioni"
		},
		"accident_info": {
			"de": "Benzin fliesst aus, Bahnübergang,…",
			"fr": "Fuite d'essence, obstacle sur la voie de chemin de fer, etc.",
			"it": "Perdita di benzina, passaggio a livello,…"
		},
		"confirm_instruction": {
			"de": "Beantworten Sie Fragen der Notfallzentrale, warten Sie bis die Zentrale den Anruf beendet",
			"fr": "Répondez aux questions de la centrale d'appels d'urgence, attendez que la centrale mette fin à l'appel avant de raccrocher",
			"it": "Rispondere alle domande della centrale di pronto intervento, aspettare finché la centrale conclude la chiamata"
		},
		"people_info": {
			"de": "Helfer und Patienten über Alarmierung informieren",
			"fr": "Informer less sauveteurs at less patients que l'alarme est donnée",
			"it": "Informare le persone che aiutano e i pazienti del fatto che è stato dato l'allarme"
		},
		"delegate_alarm": {
			"de": "Bei mehreren Helfern die Alarmierung delegieren",
			"fr": "Si plusieurs sauveteurs sont présents, déléguer l'alarme à l'un d'entre eux",
			"it": "Se vi sono più soccorritori delegare il compito di allarme"
		},
		"_footer": {
			"de": "Quelle: Schweizerischer Samariterbund, modifiziert durch den IVR",
			"fr": "Source: Alliance suisse des samaritains, modifié par l'IAS",
			"it": "Fonte: Federazione svizzera dei samaritani, modificato dall'IAS"
		}
	},
		
		
	// ------------------- rianimazione ------------------------
	"rianimazione": {
		"reha_title": {
			"de": "Reanimation",
			"fr": "Réanimation",
			"it": "Rianimazione"
		},
		"_footer": {
			"de": "Quelle: Schweizerischer Samariterbund, modifiziert durch den IVR",
			"fr": "Source: Alliance suisse des samaritains, modifié par l'IAS",
			"it": "Fonte: Federazione svizzera dei samaritani, modificato dall'IAS"
		}
	}
	
}
