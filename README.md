# Landing Page Dental Premium (Node.js & Python)

Esta es una Landing Page (página de aterrizaje) de alta gama y minimalista para un consultorio dental, diseñada con un fuerte enfoque en UX/UI, copywriting persuasivo y optimización de conversiones.

La página cuenta con una arquitectura de backend dual. Puedes ejecutar el proyecto utilizando **Node.js** o **Python** indistintamente, ya que ambos backend sirven los mismos archivos del frontend y exponen la misma API de analíticas.

---

## Características de Conversión y Diseño
1.  **Llamado a la Acción (CTA) Unificado:** Todos los botones de conversión apuntan a agendar una cita directa por WhatsApp.
2.  **Botón de WhatsApp Flotante:** Ubicado en la esquina inferior derecha con animación de pulso continuo.
3.  **Higiene Visual (Negativo Space):** Fondos predominantemente blancos (`#FFFFFF`) y off-white (`#F8FAFC`) con un color de acento menta/turquesa (`#0D9488`) para inspirar pulcritud y modernidad.
4.  **Testimonios y Credibilidad:** Copywriting persuasivo estructurado en torno al Dr. Alejandro Ramos y su enfoque en tratamientos estéticos avanzados sin dolor.
5.  **Mapeo de Conversiones:** Cualquier clic en un botón de WhatsApp realiza una llamada en segundo plano a la API `/api/lead` para registrar la conversión antes de abrir WhatsApp.

---

## Estructura del Proyecto

```
d:/MIS DOCUMENTOS/pagina web dentista/
├── public/                 # Recursos estáticos del Frontend
│   ├── index.html          # HTML5 de la Landing Page
│   ├── style.css           # Estilos CSS Vanilla (Premium y Responsivo)
│   ├── app.js              # Controlador Javascript de Frontend (Scroll y API tracking)
│   └── assets/
│       └── images/         # Imágenes del Hero y retrato del dentista
├── server.js               # Servidor Backend en Node.js (Express)
├── package.json            # Configuración de Node.js
├── app.py                  # Servidor Backend en Python (Flask)
├── requirements.txt        # Dependencias de Python
└── README.md               # Este archivo de instrucciones
```

---

## Opción 1: Ejecutar con Node.js (Puerto 3000)

### Requisitos previos
*   Tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior recomendada).

### Pasos para iniciar:
1.  Abre una terminal en la raíz de este proyecto.
2.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```
3.  Inicia el servidor en modo desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre tu navegador y navega a [http://localhost:3000](http://localhost:3000).

---

## Opción 2: Ejecutar con Python (Puerto 5000)

### Requisitos previos
*   Tener instalado [Python 3](https://www.python.org/) (versión 3.8 o superior).

### Pasos para iniciar:
1.  Abre una terminal en la raíz de este proyecto.
2.  (Recomendado) Crea e inicia un entorno virtual:
    ```bash
    python -m venv venv
    # En Windows (PowerShell):
    .\venv\Scripts\Activate.ps1
    # En macOS/Linux:
    source venv/bin/activate
    ```
3.  Instala las dependencias necesarias:
    ```bash
    pip install -r requirements.txt
    ```
4.  Inicia el servidor Flask:
    ```bash
    python app.py
    ```
5.  Abre tu navegador y navega a [http://localhost:5000](http://localhost:5000).

---

## API de Leads (Analíticas)
Ambos servidores implementan los siguientes endpoints API:

*   `POST /api/lead`: Registra un evento de clic en un botón de WhatsApp.
    *   *Payload:*
        ```json
        {
          "source": "Hero Main CTA",
          "timestamp": "2026-06-06T15:00:00.000Z",
          "url": "http://localhost:3000/"
        }
        ```
    *   *Respuesta (201 Created):*
        ```json
        {
          "success": true,
          "message": "Lead registrado exitosamente.",
          "lead": { "id": 1, "source": "Hero Main CTA", "timestamp": "..." }
        }
        ```
*   `GET /api/health`: Comprobación del estado del backend.
