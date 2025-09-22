# 🚀 **Guía de Despliegue - Cleopatra Regalos**

## 🎯 **Opciones de Hosting Recomendadas**

### **1. VERCEL (Recomendado) - GRATIS** ⭐
- ✅ **Gratis** para proyectos personales
- ✅ **Deploy automático** desde GitHub
- ✅ **SSL incluido**
- ✅ **CDN global**
- ✅ **Dominio personalizado gratis**

### **2. NETLIFY - GRATIS** 
- ✅ **Gratis** hasta 100GB bandwidth
- ✅ **Deploy desde GitHub**
- ✅ **SSL automático**
- ✅ **Formularios incluidos**

### **3. FIREBASE HOSTING - GRATIS**
- ✅ **Gratis** hasta 10GB storage
- ✅ **Integración con Functions**
- ✅ **SSL incluido**
- ✅ **Ya tienes configurado**

---

## 🚀 **OPCIÓN 1: VERCEL (Más Fácil)**

### **Paso 1: Preparar el Build**
```bash
# En la carpeta del proyecto
cd "c:\Users\Usuario 473\OneDrive\Desktop\cleopatra"

# Instalar dependencias (si no están)
npm install

# Crear build de producción
npm run build
```

### **Paso 2: Desplegar en Vercel**

#### **Método A: Desde GitHub (Recomendado)**
1. Ve a [vercel.com](https://vercel.com)
2. **Sign up** con GitHub
3. **Import Project** → Selecciona tu repo `cleopatra-regalos-ecommerce`
4. **Deploy** (automático)
5. ¡Listo! Tu URL será: `https://cleopatra-regalos-ecommerce.vercel.app`

#### **Método B: CLI de Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### **Paso 3: Configurar Dominio Personalizado**
1. En Vercel Dashboard → **Settings** → **Domains**
2. Agregar: `cleopatraregalos.com`
3. Configurar DNS según instrucciones

---

## 🚀 **OPCIÓN 2: NETLIFY**

### **Paso 1: Build del Proyecto**
```bash
npm run build
```

### **Paso 2: Deploy en Netlify**
1. Ve a [netlify.com](https://netlify.com)
2. **Sign up** con GitHub
3. **New site from Git** → Selecciona tu repo
4. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
5. **Deploy**

### **URL Final**: `https://cleopatra-regalos.netlify.app`

---

## 🚀 **OPCIÓN 3: FIREBASE HOSTING**

### **Paso 1: Configurar Firebase**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar (ya está hecho)
# firebase init hosting
```

### **Paso 2: Deploy**
```bash
# Build del proyecto
npm run build

# Deploy a Firebase
firebase deploy --only hosting
```

### **URL Final**: `https://tu-proyecto.web.app`

---

## ⚙️ **Configuraciones Importantes**

### **Variables de Entorno (.env.production)**
```env
# Para producción
REACT_APP_WOMPI_PUBLIC_KEY=pub_prod_tu_clave_real
REACT_APP_WOMPI_PRIVATE_KEY=prv_prod_tu_clave_real
REACT_APP_ENVIRONMENT=production
REACT_APP_GA_TRACKING_ID=G-TU_TRACKING_ID
REACT_APP_EMAILJS_SERVICE_ID=tu_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=tu_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=tu_public_key
```

### **Configuración de Build (package.json)**
```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:prod": "REACT_APP_ENVIRONMENT=production npm run build"
  }
}
```

---

## 🔧 **Optimizaciones Pre-Deploy**

### **1. Comprimir Imágenes**
```bash
# Opcional: comprimir imágenes
# Usar herramientas como TinyPNG o ImageOptim
```

### **2. Verificar Performance**
```bash
# Analizar bundle size
npm run build
npx serve -s build
# Abrir http://localhost:3000
```

### **3. Test de Producción**
```bash
# Probar build localmente
npm run build
npx serve -s build -l 3000
```

---

## 🌐 **Configuración de Dominio**

### **Comprar Dominio (Opciones)**
- **Namecheap**: ~$12/año
- **GoDaddy**: ~$15/año  
- **Google Domains**: ~$12/año

### **Configurar DNS**
```
# Para Vercel
CNAME: www → cname.vercel-dns.com
A: @ → 76.76.19.19

# Para Netlify  
CNAME: www → tu-sitio.netlify.app
A: @ → 75.2.60.5
```

---

## 📊 **Monitoreo Post-Deploy**

### **1. Google Analytics**
- Verificar que funcione el tracking
- Configurar objetivos de conversión

### **2. Google Search Console**
- Agregar propiedad
- Subir sitemap: `https://tudominio.com/sitemap.xml`

### **3. Performance**
- **PageSpeed Insights**: Verificar velocidad
- **GTmetrix**: Análisis completo

---

## 🚨 **Checklist Pre-Launch**

### **Funcionalidades:**
- [ ] Carrito funciona correctamente
- [ ] Pagos en modo demo/producción
- [ ] Formularios envían emails
- [ ] PWA se instala en móvil
- [ ] Todas las imágenes cargan
- [ ] Responsive en todos los dispositivos

### **SEO:**
- [ ] Meta tags correctos
- [ ] Sitemap.xml accesible
- [ ] Robots.txt configurado
- [ ] Google Analytics funcionando

### **Performance:**
- [ ] Velocidad > 90 en PageSpeed
- [ ] Imágenes optimizadas
- [ ] Lazy loading activo

---

## 💰 **Costos Estimados**

### **Hosting Gratuito:**
- **Vercel/Netlify**: $0/mes
- **Firebase**: $0/mes (hasta límites)

### **Dominio:**
- **cleopatraregalos.com**: ~$12/año

### **Servicios Adicionales:**
- **EmailJS**: $0-15/mes
- **Google Analytics**: Gratis
- **SSL**: Incluido gratis

**Total mensual: ~$1-2 USD** 💸

---

## 🎯 **Recomendación Final**

### **Para Empezar: VERCEL**
1. **Más fácil** de configurar
2. **Deploy automático** desde GitHub
3. **Performance excelente**
4. **Dominio personalizado gratis**

### **Pasos Inmediatos:**
1. Subir código a GitHub ✅ (Ya hecho)
2. Crear cuenta en Vercel
3. Conectar repositorio
4. Deploy automático
5. Configurar dominio

**¿Empezamos con Vercel? 🚀**