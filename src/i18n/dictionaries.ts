import type { Locale } from "./config";

export const dictionaries = {
  en: {
    nav: { how: "How it works", services: "Services", pricing: "Payments", start: "Start an order" },
    hero: { eyebrow: "Language services, built from Cameroon for the world", titleA: "Turn every", titleEm: "voice & page", titleB: "into work you can use.", lead: "Transcribe audio and video, or translate documents and books. MboaScribe combines AI-assisted workflows with human review for dependable delivery.", primary: "Start a project", secondary: "See how it works" },
    trust: ["English", "Français", "Español", "More as we grow"],
    proof: "Designed for the work behind",
    sectors: ["Research", "NGOs", "Publishing", "Consulting", "Media"],
    workflow: { kicker: "Simple workflow", title: "From source file to reliable delivery.", lead: "Choose a service, upload securely, review the quote, pay, and follow the project through human quality assurance.", steps: [["01","Choose","Select transcription or translation."],["02","Upload","Send audio, video, documents or manuscripts securely."],["03","Human QA","A specialist reviews language, names, numbers and context."],["04","Deliver","Download clean files ready for your next workflow."]] },
    payments: { kicker: "Flexible payments", title: "Pay in the way that fits the project.", lead: "MVP payments support Selar and verified manual payments, with Grey bank transfer and Airtm available as manually verified international options when account eligibility permits.", methods: [["S","Selar","Online checkout"],["G","Grey","International bank transfer"],["A","Airtm","Manual international payment"],["₣","Manual","Verified before processing"]] },
    footer: "Human-verified language services, starting in Cameroon.",
    dashboard: { kicker: "New project", title: "What would you like to do?", lead: "Start with the service you need. We keep one order workflow while each service gets the right production process.", transcription: "Transcribe", transcriptionText: "Audio and video → AI-assisted draft → human review.", translation: "Translate", translationText: "Documents, manuscripts and books → translator → proofreading / QA.", start: "Start", custom: "Books and long or specialist documents start with a custom quote." }
  },
  fr: {
    nav: { how: "Fonctionnement", services: "Services", pricing: "Paiements", start: "Créer une commande" },
    hero: { eyebrow: "Services linguistiques, du Cameroun vers le monde", titleA: "Transformez chaque", titleEm: "voix et page", titleB: "en contenu utile.", lead: "Transcrivez vos fichiers audio et vidéo, ou traduisez vos documents et livres. MboaScribe associe des outils assistés par IA à une révision humaine pour une livraison fiable.", primary: "Démarrer un projet", secondary: "Voir le fonctionnement" },
    trust: ["English", "Français", "Español", "D'autres à venir"],
    proof: "Conçu pour les besoins de",
    sectors: ["Recherche", "ONG", "Édition", "Conseil", "Médias"],
    workflow: { kicker: "Processus simple", title: "Du fichier source à une livraison fiable.", lead: "Choisissez un service, téléversez vos fichiers en toute sécurité, consultez le devis, payez et suivez le projet jusqu'au contrôle qualité humain.", steps: [["01","Choisir","Sélectionnez transcription ou traduction."],["02","Téléverser","Envoyez audio, vidéo, documents ou manuscrits."],["03","Contrôle humain","Un spécialiste vérifie la langue, les noms, les chiffres et le contexte."],["04","Livraison","Téléchargez des fichiers propres et prêts à l'emploi."]] },
    payments: { kicker: "Paiements flexibles", title: "Payez selon les besoins du projet.", lead: "Le MVP prend en charge Selar et les paiements manuels vérifiés. Grey et Airtm peuvent servir d'options internationales vérifiées manuellement lorsque le compte est éligible.", methods: [["S","Selar","Paiement en ligne"],["G","Grey","Virement bancaire international"],["A","Airtm","Paiement international manuel"],["₣","Manuel","Vérifié avant traitement"]] },
    footer: "Services linguistiques vérifiés par des humains, depuis le Cameroun.",
    dashboard: { kicker: "Nouveau projet", title: "Que souhaitez-vous faire ?", lead: "Commencez par le service dont vous avez besoin. Une commande unique, avec un processus de production adapté à chaque service.", transcription: "Transcrire", transcriptionText: "Audio et vidéo → brouillon assisté par IA → révision humaine.", translation: "Traduire", translationText: "Documents, manuscrits et livres → traducteur → relecture / QA.", start: "Commencer", custom: "Les livres et documents longs ou spécialisés commencent par un devis personnalisé." }
  },
  es: {
    nav: { how: "Cómo funciona", services: "Servicios", pricing: "Pagos", start: "Crear pedido" },
    hero: { eyebrow: "Servicios lingüísticos, desde Camerún para el mundo", titleA: "Convierte cada", titleEm: "voz y página", titleB: "en contenido útil.", lead: "Transcribe audio y vídeo, o traduce documentos y libros. MboaScribe combina flujos asistidos por IA con revisión humana para una entrega fiable.", primary: "Iniciar proyecto", secondary: "Ver cómo funciona" },
    trust: ["English", "Français", "Español", "Más próximamente"],
    proof: "Diseñado para el trabajo de",
    sectors: ["Investigación", "ONG", "Editorial", "Consultoría", "Medios"],
    workflow: { kicker: "Flujo sencillo", title: "Del archivo fuente a una entrega fiable.", lead: "Elige un servicio, sube el archivo de forma segura, revisa el presupuesto, paga y sigue el proyecto hasta el control de calidad humano.", steps: [["01","Elegir","Selecciona transcripción o traducción."],["02","Subir","Envía audio, vídeo, documentos o manuscritos."],["03","Control humano","Un especialista revisa idioma, nombres, cifras y contexto."],["04","Entregar","Descarga archivos limpios y listos para usar."]] },
    payments: { kicker: "Pagos flexibles", title: "Paga según las necesidades del proyecto.", lead: "El MVP admite Selar y pagos manuales verificados. Grey y Airtm pueden utilizarse como opciones internacionales verificadas manualmente cuando la cuenta sea elegible.", methods: [["S","Selar","Pago en línea"],["G","Grey","Transferencia bancaria internacional"],["A","Airtm","Pago internacional manual"],["₣","Manual","Verificado antes de procesar"]] },
    footer: "Servicios lingüísticos con revisión humana, desde Camerún.",
    dashboard: { kicker: "Nuevo proyecto", title: "¿Qué quieres hacer?", lead: "Empieza por el servicio que necesitas. Mantenemos un solo flujo de pedidos y un proceso de producción adecuado para cada servicio.", transcription: "Transcribir", transcriptionText: "Audio y vídeo → borrador asistido por IA → revisión humana.", translation: "Traducir", translationText: "Documentos, manuscritos y libros → traductor → corrección / QA.", start: "Empezar", custom: "Los libros y documentos largos o especializados comienzan con un presupuesto personalizado." }
  }
} as const;

export function getDictionary(locale: Locale) { return dictionaries[locale]; }
