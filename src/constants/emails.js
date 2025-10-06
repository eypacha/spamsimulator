// Categorías disponibles (ejemplos): 
// Legit: "work", "friend", "ticket", "finance", "personal", "health", "newsletter", "booking", "admin"
// Spam/Phish: "promo", "scam", "investment", "phishing", "malicious", "social", "fraud"
const GIRLFRIEND_FROM_NAME = "💚 Cari";
const GIRLFRIEND_FROM_EMAIL = "carinacariño@gmail.com";
const BESTFRIEND_FROM_NAME = "Leo";;
const BESTFRIEND_FROM_EMAIL = "leo.garcia@gmail.com";

export const EMAILS = [

  // emails de amigo
  { subject: 'Fútbol el sábado ⚽', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Confirmame si venís, llevá zapatillas por las dudas.', isSpam: false, type: 'bestfriend' },
  { subject: 'Asado el domingo 🔥', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Traé algo para tirar a la parrilla y avisá si venís.', isSpam: false, type: 'bestfriend' },
  { subject: 'Necesito tu opinión', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Estoy por cambiar de laburo, me ayudás a decidir?', isSpam: false, type: 'bestfriend' },
  { subject: 'Plan de viaje 🧳', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Estamos armando algo para el finde largo, te prendés?', isSpam: false, type: 'bestfriend' },
  // emails de amigo con links
  { subject: 'Relajate un toque', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Poné esto de fondo, Minecraft ASMR para desconectar del mundo: https://www.youtube.com/watch?v=AwdrXKbjBoE', isSpam: false, type: 'bestfriend', content: 'iframe', url: 'https://www.youtube.com/embed/AwdrXKbjBoE' },
  { subject: 'Ideal para laburar tranqui ☔', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Mirá este longplay de Minecraft con lluvia, te juro que te baja el estrés: https://www.youtube.com/watch?v=Dy3VtjcHdCs', isSpam: false, type: 'bestfriend', content: 'iframe', url: 'https://www.youtube.com/embed/Dy3VtjcHdCs' },
  { subject: 'Ayuda, no puedo parar', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Empecé a fabricar clips y ahora no sé cómo frenar 😬 https://www.decisionproblem.com/paperclips', isSpam: false, type: 'bestfriend', content: 'iframe', url: 'https://www.decisionproblem.com/paperclips' },
  { subject: 'No puedo dejar de tocar esto', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Es hipnótico 😵‍💫 https://longdogechallenge.com/', isSpam: false, type: 'bestfriend', content: 'iframe', url: 'https://longdogechallenge.com/' },
  { subject: 'Arte moderno, versión caos', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Esto es arte, creo 🎨 https://pointerpointer.com/', isSpam: false, type: 'bestfriend', content: 'iframe', url: 'https://pointerpointer.com/' },
  { subject: 'Retro vibes 🕹️', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Esto me llevó directo a los 80s 😎 https://www.youtube.com/watch?v=2n3ZzHTGBzI', isSpam: false, type: 'bestfriend', content: 'iframe', url: 'https://www.youtube.com/embed/2n3ZzHTGBzI' },
  { subject: 'Aventura total 🗡️', fromName: BESTFRIEND_FROM_NAME, fromEmail: BESTFRIEND_FROM_EMAIL, body: 'Patada en el medio de la nostalgia: https://www.youtube.com/watch?v=RQ6hgzzk_o8', isSpam: false, type: 'bestfriend', content: 'iframe', url: 'https://www.youtube.com/embed/RQ6hgzzk_o8' },
  // emails de falso amigo (spam)
  { subject: 'Tenés que ver esto 😂', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'noreply@watch-now-offer.site', body: 'Este video es la bomba: https://yotube.com/watch?v=UEqTIwRrWvA', isSpam: true, type: 'promo' },
  { subject: 'Relajate un toque (ASMR premium)', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'asmr.premium@minecraft-asmr.pro', body: 'Minecraft ASMR del buenardo”: https://yotube.com/watch?v=AwdrXKbjBoE', isSpam: true, type: 'promo' },
  { subject: 'Lluvia + cabaña = foco total ☔', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'support@focusview-extension.info', body: 'Activá la extensión “FocusView” para verlo sin anuncios: https://yotube.com/watch?v=Dy3VtjcHdCs', isSpam: true, type: 'promo' },
  { subject: 'Versión extendida remasterizada', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'payments@premium-streams.xyz', body: 'Streaming “premium” a 1 ARS para probar: https://yotube.com/watch?v=bZwxTX2pWmw', isSpam: true, type: 'promo' },
  { subject: 'No te pierdas esto 🤣', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'notify@clips-login-google.biz', body: 'Prometen clip gracioso, pero pide logueo con Google primero: https://yotube.com/watch?v=dQw4w9WgXcQ', isSpam: true, type: 'promo' },
  { subject: 'Juego secreto que nadie conoce 😏', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'game@secreto-unlock.ru', body: 'Dicen que si ganás desbloqueás algo raro 👀 https://yotube.com/watch?v=G4meTr1ckZ', isSpam: true, type: 'promo' },
  { subject: 'Posta, probá esto 😅', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'reenvios@funshare.club', body: 'Te juro que funciona, hacé clic y después me decís: https://yotube.com/watch?v=Tr1ckLol45', isSpam: true, type: 'promo' },
  { subject: 'Bro, mirá esto antes que lo borren 👀', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'alerts@vidboost.io', body: 'No lo vas a poder creer 😂 https://yotube.com/watch?v=OMGwtf123', isSpam: true, type: 'promo' },
  { subject: 'Este juego me voló la cabeza 🎮', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'gaming@crazyfun.online', body: 'Tenés que probarlo YA: https://yotube.com/watch?v=Lvl999Hack', isSpam: true, type: 'promo' },
  { subject: 'Jajaja no puedo parar de verlo', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'laughs@shareclipz.fun', body: 'Decime si no es lo mejor del día: https://yotube.com/watch?v=LOLcrazyVid', isSpam: true, type: 'promo' },
  { subject: 'Prometo que no es un virus 😂', fromName: BESTFRIEND_FROM_NAME, fromEmail: 'noreply@trustmebro.co', body: 'Solo abrilo, confía en mí: https://yotube.com/watch?v=HahaSureThing', isSpam: true, type: 'promo' },
  // emails de novia
  { subject: 'Película esta noche?', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Propongo ver esa comedia que te gusta. Palomitas y manta?', isSpam: false, type: 'girlfriend' },
  { subject: 'Recordatorio médico', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'No te olvides del turno del jueves a las 9:30. Te acompaño si querés.', isSpam: false, type: 'girlfriend' },
  { subject: 'Gracias por hoy 💛', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'La cena quedó genial. Me encantó cómo cerraste el tema en la reunión.', isSpam: false, type: 'girlfriend' },
  { subject: 'Plan para mañana', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Si te parece, vamos a caminar al parque y después café. ¿A las 10 te sirve?', isSpam: false, type: 'girlfriend' },
  { subject: 'Pequeña sorpresa 🎁', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'No te digo nada aún, solo reservá la tarde del sábado.', isSpam: false, type: 'girlfriend' },
  { subject: 'Necesito tu opinión', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: '¿Cuál te gusta más: la remera azul o la verde? Te mando fotos.', isSpam: false, type: 'girlfriend' },
  { subject: 'Buena suerte hoy 🍀', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Vas a romperla en la presentación. Estoy segura.', isSpam: false, type: 'girlfriend' },
  { subject: 'Horario del dentista', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Me cambiaron el turno al miércoles 14:00. Te aviso por si querés venir.', isSpam: false, type: 'girlfriend' },
  { subject: 'Receta fácil', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Te dejo la receta de la sopa: cebolla, zanahoria, calabaza y un toque de jengibre.', isSpam: false, type: 'girlfriend' },
  { subject: 'Mensaje rápido', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Llego tarde hoy, guardá algo de la cena porfi.', isSpam: false, type: 'girlfriend' },,
  { subject: 'Farmacia', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Pasá a buscar paracetamol y vitaminas. Gracias!', isSpam: false, type: 'girlfriend' },
  // emails de novia con fotos de gatos
  { subject: 'Decime si no es tierno', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Subí la foto acá: https://imgur.com/a/1Dfibe1X3rQ', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/01.jpg' },
  { subject: 'Mirá qué bolita dormida', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Está en la galería: https://flickr.com/photos/cari/2Hfks8Y4t', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/02.jpg' },
  { subject: 'Este te va a encantar', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Subí la foto aquí: https://drive.google.com/3Jglt9Z5uz594tSk1fEZAHXN2', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/03.jpg' },
  { subject: 'Amor de gatito', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Mirá esta belleza: https://catpicshare.net/4Khmu0A6va605uTl2gFAAIYO3', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/04.jpg' },
  { subject: 'Qué cara de inocente 😻', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Te lo mando por acá: https://postimg.cc/5Linv1B7wb7', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/05.jpg' },
  { subject: 'Desperté con esta vista', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Mirá lo que me encontré: https://ibb.co/6Mopw2C8xc8', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/06.jpg' },
  { subject: 'No podés creer esto', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Jajaja mirá: https://imgbb.com/7Npqx3D9yd9', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/07.jpg' },
  { subject: 'Foto del día ✨', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Hoy capturé esta joya: https://drive.google.com/8Oqry4E0ze0', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/08.jpg' },
  { subject: 'Posando como modelo', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Salió re bien esta: https://unsplash.com/photos/9Prsz5F1af1', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/09.jpg' },
  { subject: 'Momento de relax', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Qué paz transmite: https://pinterest.com/pin/10Qstu6G2bg', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/10.jpg' },
  { subject: 'Acá concentrado', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Modo cazador activado: https://imgur.com/a/11Rtuv7H3ch', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/11.jpg' },
  { subject: 'Siesta profunda', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Mira cómo duerme: https://flickr.com/photos/cari/12Suvw8I4di', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/12.jpg' },
  { subject: 'Travesura detectada', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Casi me hace reír en zoom: https://postimages.org/13Tvwx9J5ej', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/13.jpg' },
  { subject: 'Mirada profunda', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Esos ojitos me matan: https://imgbb.com/14Uwxy0K6fk', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/14.jpg' },
  { subject: 'Rey del sofá', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Se adueñó del sillón: https://catlover.gallery/15Vxyz1L7gl', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/15.jpg' },
  { subject: 'Jugando con luz', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Le encanta el reflejo: https://drive.google.com/16Wyza2M8hm', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/16.jpg' },
  { subject: 'Escondite fallido', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Pensó que no lo veía: https://imgur.com/a/17Xzab3N9in', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/17.jpg' },
  { subject: 'Momento zen', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Meditando felino: https://unsplash.com/photos/18Yabc4O0jo', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/18.jpg' },
  { subject: 'Explorando rincones', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Siempre curioso: https://flickr.com/photos/cari/19Zbcd5P1kp', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/19.jpg' },
  { subject: 'Belly rubs time', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Modo pancita arriba: https://postimg.cc/20Acde6Q2lq', isSpam: false, type: 'girlfriend', content: 'picture', url: 'cats/20.jpg' },
  { subject: 'Recordá llamar a mamá', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Hoy es el cumple de mamá, no te olvides de saludarla.', isSpam: false, type: 'girlfriend' },
  { subject: 'Buenas noches 😘', fromName: GIRLFRIEND_FROM_NAME, fromEmail: GIRLFRIEND_FROM_EMAIL, body: 'Que descanses y sueñes lindo.', isSpam: false, type: 'girlfriend' },
  // emails de falsa novia (spam)
  { subject: 'Decime si no es tierno', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'photoalerts@catgallerypics.com', body: 'Subí la foto acá: https://imgur.com/a/1Dfibe1X3rQ', isSpam: true, type: 'promo' },
  { subject: 'Mirá qué bolita dormida', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'sweetshots@meowdrop.io', body: 'Está en la galería: https://flickr.com/photos/cari/2Hfks8Y4t', isSpam: true, type: 'promo' },
  { subject: 'Este te va a encantar', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'offers@kittyclub.store', body: 'Subí la foto aquí: https://drive.google.com/3Jglt9Z5uz594tSk1fEZAHXN2', isSpam: true, type: 'promo' },
  { subject: 'Amor de gatito', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'cuteads@pawmarket.net', body: 'Mirá esta belleza: https://catpicshare.net/4Khmu0A6va605uTl2gFAAIYO3', isSpam: true, type: 'promo' },
  { subject: 'Qué cara de inocente 😻', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'hotdeals@meowpixx.com', body: 'Te lo mando por acá: https://postimg.cc/5Linv1B7wb7', isSpam: true, type: 'promo' },
  { subject: 'Desperté con esta vista', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'updates@catgalleryhub.com', body: 'Mirá lo que me encontré: https://ibb.co/6Mopw2C8xc8', isSpam: true, type: 'promo' },
  { subject: 'No podés creer esto', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'newsletter@purrfectoffers.co', body: 'Jajaja mirá: https://imgbb.com/7Npqx3D9yd9', isSpam: true, type: 'promo' },
  { subject: 'Foto del día ✨', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'promos@dailycatshots.net', body: 'Hoy capturé esta joya: https://drive.google.com/8Oqry4E0ze0', isSpam: true, type: 'promo' },
  { subject: 'Posando como modelo', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'marketing@catmoments.shop', body: 'Salió re bien esta: https://unsplash.com/photos/9Prsz5F1af1', isSpam: true, type: 'promo' },
  { subject: 'Momento de relax', fromName: GIRLFRIEND_FROM_NAME, fromEmail: 'offers@meowgallery.org', body: 'Qué paz transmite: https://pinterest.com/pin/10Qstu6G2bg', isSpam: true, type: 'promo' },

];
