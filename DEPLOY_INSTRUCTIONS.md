# 🚀 **Instrucciones de Despliegue Paso a Paso**

## ✅ **Pre-requisitos Completados**
- ✅ Código subido a GitHub
- ✅ Build de producción probado
- ✅ Imágenes incluidas
- ✅ Configuraciones de deploy creadas

---

## 🎯 **OPCIÓN 1: VERCEL (Recomendado)**

### **Paso 1: Crear Cuenta en Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Clic en **"Sign Up"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza Vercel para acceder a tus repositorios

### **Paso 2: Importar Proyecto**
1. En el dashboard de Vercel, clic **"New Project"**
2. Busca y selecciona `cleopatra-regalos-ecommerce`
3. Clic **"Import"**

### **Paso 3: Configurar Deploy**
```
Framework Preset: Create React App
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### **Paso 4: Variables de Entorno**
En Vercel Dashboard → Settings → Environment Variables:
```
REACT_APP_ENVIRONMENT = production
REACT_APP_WOMPI_PUBLIC_KEY = pub_test_tu_clave (por ahora test)
REACT_APP_GA_TRACKING_ID = G-TU_TRACKING_ID
```

### **Paso 5: Deploy**
1. Clic **"Deploy"**
2. Esperar 2-3 minutos
3. ¡Tu sitio estará en vivo!

### **URL Final**: `https://cleopatra-regalos-ecommerce.vercel.app`

---

## 🎯 **OPCIÓN 2: NETLIFY**

### **Paso 1: Crear Cuenta**
1. Ve a [netlify.com](https://netlify.com)
2. **Sign up** con GitHub

### **Paso 2: Deploy**
1. **"New site from Git"**
2. Selecciona GitHub → tu repositorio
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
4. **Deploy site**

### **URL Final**: `https://cleopatra-regalos.netlify.app`

---

## 🎯 **OPCIÓN 3: FIREBASE HOSTING**

### **Paso 1: Configurar Firebase**
```bash
# En tu terminal
cd "c:\Users\Usuario 473\OneDrive\Desktop\cleopatra"

# Login a Firebase
firebase login

# Deploy
npm run build
firebase deploy --only hosting
```

---

## 🌐 **Configurar Dominio Personalizado**

### **Comprar Dominio**
Opciones recomendadas:
- **Namecheap**: `cleopatraregalos.com` (~$12/año)
- **GoDaddy**: Similar precio
- **Google Domains**: Fácil integración

### **Configurar en Vercel**
1. Vercel Dashboard → **Settings** → **Domains**
2. **Add Domain**: `cleopatraregalos.com`
3. Configurar DNS según instrucciones:
   ```
   Type: A
   Name: @
   Value: 76.76.19.19
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 📊 **Post-Deploy Checklist**

### **Verificar Funcionalidades:**
- [ ] Página carga correctamente
- [ ] Imágenes del carrusel funcionan
- [ ] Carrito de compras funciona
- [ ] Formularios envían (modo test)
- [ ] PWA se puede instalar
- [ ] Responsive en móvil

### **SEO y Analytics:**
- [ ] Google Analytics funcionando
- [ ] Meta tags correctos
- [ ] Sitemap accesible: `/sitemap.xml`
- [ ] Robots.txt accesible: `/robots.txt`

### **Performance:**
- [ ] Velocidad > 90 en PageSpeed Insights
- [ ] Todas las imágenes cargan
- [ ] Animaciones fluidas

---

## 🔧 **Configuraciones de Producción**

### **1. Wompi (Pagos Reales)**
Cuando tengas las claves reales:
```env
REACT_APP_WOMPI_PUBLIC_KEY=pub_prod_tu_clave_real
REACT_APP_WOMPI_PRIVATE_KEY=prv_prod_tu_clave_real
```

### **2. Google Analytics**
1. Crear cuenta en [analytics.google.com](https://analytics.google.com)
2. Crear propiedad para tu sitio
3. Copiar Tracking ID (G-XXXXXXXXXX)
4. Agregar a variables de entorno

### **3. EmailJS (Formularios)**
1. Crear cuenta en [emailjs.com](https://emailjs.com)
2. Configurar servicio de email
3. Crear template
4. Agregar credenciales a variables de entorno

---

## 💰 **Costos Totales**

### **Hosting: GRATIS**
- Vercel/Netlify: $0/mes
- Firebase: $0/mes (hasta límites)

### **Dominio: ~$12/año**
- cleopatraregalos.com

### **Servicios:**
- Google Analytics: Gratis
- EmailJS: $0-15/mes
- SSL: Incluido gratis

**Total: ~$1-2 USD/mes** 💸

---

## 🎯 **Próximos Pasos Recomendados**

### **Inmediato:**
1. **Deploy en Vercel** (5 minutos)
2. **Probar todas las funciones**
3. **Compartir URL de demo**

### **Esta Semana:**
1. **Comprar dominio personalizado**
2. **Configurar Google Analytics**
3. **Setup EmailJS para formularios**

### **Próximo Mes:**
1. **Configurar Wompi producción**
2. **Optimizar SEO**
3. **Marketing y promoción**

---

## 🚀 **¡Empezar Deploy Ahora!**

**Recomendación**: Empezar con **Vercel** porque es:
- ✅ Más fácil de configurar
- ✅ Deploy automático desde GitHub
- ✅ Performance excelente
- ✅ SSL y CDN incluidos

**¿Listo para hacer el deploy? ¡Vamos! 🎉**