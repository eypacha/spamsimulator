# Spam Simulator

**Spam Simulator** es un juego web donde el jugador debe gestionar su bandeja de entrada luchando contra el spam, virus y otros retos digitales. El objetivo es eliminar correos no deseados, leer mensajes importantes, desbloquear logros y mejorar habilidades mediante upgrades y monedas virtuales.

## ¿Cómo se juega?

- Elimina correos spam para ganar puntos y monedas.
- Lee correos legítimos para desbloquear logros.
- Enfréntate a virus que drenan tus monedas si no los eliminas.
- Compra mejoras para aumentar tu capacidad de gestión, desbloquear habilidades especiales y multiplicadores de puntos.
- Consigue logros por acciones como leer correos, eliminar spam, ver fotos de gatos, jugar en horarios específicos, etc.

## Organización del código

La estructura principal del proyecto es la siguiente:

- **src/store/**  
  Contiene la lógica de estado del juego usando [Pinia](https://pinia.vuejs.org/):
  - `stats.js`: Store principal, gestiona monedas, upgrades, logros y estadísticas.
  - `modules/`: Submódulos para sistemas específicos:
    - `comboManager.js`: Multiplicadores y combos.
    - `abilitiesManager.js`: Habilidades especiales (Spam Frenzy, Antivirus, etc).
    - `statsTracker.js`: Seguimiento de estadísticas y eventos.
    - `turboSpamManager.js`, `scoreManager.js`, etc.
  - `sound.js`: Efectos de sonido y control de audio.

- **src/components/**  
  Componentes visuales del juego:
  - `Hud.vue`: Barra superior con información clave.
  - `Sidebar.vue`: Menú lateral de navegación.
  - `Achievements.vue`: Vista de logros desbloqueados.
  - `Store.vue`: Tienda para comprar upgrades.
  - Otros componentes para gestión de correos, virus, etc.

- **src/views/**  
  Vistas principales del juego, como la pantalla de inicio (`HomeView.vue`).

- **src/utils/**  
  Funciones utilitarias para balanceo de upgrades (`balancing.js`), almacenamiento, etc.

- **public/**  
  Archivos estáticos como sonidos, imágenes y favicon.

- **index.html**  
  Archivo HTML principal con metadatos y enlaces a recursos.

## Principales sistemas del juego

- **Upgrades:** Mejoran capacidades como puntos por spam, capacidad de bandeja, selección múltiple, habilidades especiales.
- **Logros:** Se desbloquean por hitos (spam eliminado, correos leídos, monedas ganadas, rachas, etc).
- **Virus:** Aparecen aleatoriamente y drenan monedas si no se eliminan.
- **Habilidades:** Spam Frenzy, Antivirus, Virus Bomb, etc. Se desbloquean y mejoran en la tienda.
- **Sonidos:** Feedback auditivo para acciones clave.

## Tecnologías usadas

- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) para gestión de estado
- [Howler.js](https://howlerjs.com/) para sonidos
- [Tailwind CSS](https://tailwindcss.com/) para estilos

---

¡Diviértete gestionando tu correo y luchando contra el spam!
