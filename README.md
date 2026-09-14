# Change Leadership Lab v10 — Producción

## Archivos
- `index.html`: interfaz del juego.
- `styles.css`: estilos.
- `app.js`: motor de simulación v10.
- `config.js`: conexión a Supabase.
- `schema.sql`: tabla y políticas para ranking.
- `README.md`: instalación.

## 1. Crear/configurar Supabase
1. Abre tu proyecto de Supabase.
2. Ve a **SQL Editor**.
3. Crea una consulta nueva.
4. Copia todo `schema.sql`.
5. Ejecuta el script.
6. En **Project Settings / API** copia:
   - Project URL
   - Publishable key / anon key
7. Nunca uses `service_role` en el navegador.

## 2. Configurar el juego
Abre `config.js` y completa:

```js
window.CHANGE_LAB_CONFIG = {
  allowLocalFallback: true,
  supabaseUrl: 'TU_PROJECT_URL',
  supabaseAnonKey: 'TU_PUBLISHABLE_O_ANON_KEY',
  classCode: 'LIDERAZGO-CAMBIO'
};
```

El estudiante igualmente escribe el código de su clase al entrar; ese código separa los rankings.

## 3. Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub.
2. Sube los seis archivos de este paquete a la raíz.
3. Ve a **Settings > Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona `main` y `/ (root)`.
6. Guarda.
7. GitHub mostrará la URL pública del juego.

## 4. Probar antes de clase
Abre la URL publicada en dos navegadores/dispositivos:
1. Usa el mismo código de clase.
2. Ingresa dos nombres de equipo diferentes.
3. Ejecuta una ronda en cada uno.
4. Comprueba que ambos aparecen en el ranking.
5. Actualiza la página y confirma que el progreso local se conserva.

## Importante
- Los 120 créditos son una bolsa única para las cuatro rondas.
- Las intervenciones tienen costos diferentes.
- La pertinencia depende del contexto/ronda.
- Existen pérdidas, efectos contraproducentes, sinergias y sobreintervención.
- Apropiación emerge del sistema.
- El índice final va de 0 a 100.
- El ranking debe comparar equipos del mismo código de clase.
