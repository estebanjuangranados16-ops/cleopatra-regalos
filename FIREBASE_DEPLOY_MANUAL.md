# 🔥 **Deploy Manual en Firebase - Cleopatra Regalos**

## 🚀 **Pasos para Desplegar en Firebase**

### **Paso 1: Instalar Firebase CLI**
Abre **PowerShell como Administrador** y ejecuta:
```bash
npm install -g firebase-tools
```

### **Paso 2: Login a Firebase**
```bash
firebase login
```
- Se abrirá el navegador
- Inicia sesión con tu cuenta de Google
- Autoriza Firebase CLI

### **Paso 3: Crear Proyecto en Firebase Console**
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Clic **"Crear proyecto"**
3. Nombre: `cleopatra-regalos`
4. Habilitar Google Analytics (opcional)
5. **Crear proyecto**

### **Paso 4: Inicializar Firebase en tu Proyecto**
En la carpeta del proyecto:
```bash
cd "c:\Users\Usuario 473\OneDrive\Desktop\cleopatra"
firebase init hosting
```

Configuración:
- **¿Usar proyecto existente?** → Sí
- **Seleccionar proyecto** → cleopatra-regalos
- **Directorio público** → `build`
- **¿SPA?** → Sí (rewrite all URLs to /index.html)
- **¿Sobrescribir index.html?** → No

### **Paso 5: Build y Deploy**
```bash
# Crear build de producción
npm run build

# Deploy a Firebase
firebase deploy --only hosting
```

### **Paso 6: ¡Listo!**
Tu sitio estará disponible en:
```
https://cleopatra-regalos.web.app
```

---

## ⚙️ **Configuración Adicional**

### **Variables de Entorno**
Firebase Hosting no maneja variables de entorno automáticamente. Las variables se incluyen en el build.

Para producción, edita `.env.production`:
```env
REACT_APP_ENVIRONMENT=production
REACT_APP_WOMPI_PUBLIC_KEY=pub_test_tu_clave
REACT_APP_GA_TRACKING_ID=G-TU_TRACKING_ID
```

### **Dominio Personalizado**
1. En Firebase Console → Hosting
2. **Agregar dominio personalizado**
3. Seguir instrucciones DNS

---

## 🔧 **Comandos Útiles**

```bash
# Ver proyectos
firebase projects:list

# Deploy solo hosting
firebase deploy --only hosting

# Deploy con mensaje
firebase deploy -m "Deploy Cleopatra Regalos v1.0"

# Ver logs
firebase hosting:channel:list

# Rollback (si algo sale mal)
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

---

## 📊 **Post-Deploy Checklist**

### **Verificar:**
- [ ] Sitio carga en `https://cleopatra-regalos.web.app`
- [ ] Imágenes del carrusel funcionan
- [ ] Carrito de compras funciona
- [ ] Formularios funcionan
- [ ] PWA se puede instalar
- [ ] Responsive en móvil

### **Optimizar:**
- [ ] Configurar Google Analytics
- [ ] Agregar dominio personalizado
- [ ] Configurar SSL (automático)
- [ ] Test de velocidad

---

## 💰 **Costos Firebase**

### **Plan Spark (Gratuito):**
- **Hosting**: 10 GB storage
- **Bandwidth**: 360 MB/día
- **SSL**: Incluido
- **Dominio personalizado**: Gratis

### **Suficiente para:**
- ✅ Sitio de demostración
- ✅ Portfolio personal
- ✅ Pruebas y desarrollo
- ✅ Sitios pequeños/medianos

---

## 🎯 **Alternativa Rápida: Firebase Web App**

Si tienes problemas con CLI, puedes usar la consola web:

1. **Build local**:
   ```bash
   npm run build
   ```

2. **Subir manualmente**:
   - Ve a Firebase Console → Hosting
   - Arrastra la carpeta `build` completa
   - Deploy automático

---

## 🚀 **¡Empezar Deploy Ahora!**

### **Opción A: CLI (Recomendado)**
```bash
# Como administrador
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

### **Opción B: Consola Web**
1. `npm run build`
2. Subir carpeta `build` en Firebase Console

**¡Tu sitio estará en vivo en 5 minutos! 🔥**