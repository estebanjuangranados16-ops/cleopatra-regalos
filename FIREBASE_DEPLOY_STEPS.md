# 🔥 **Deploy Firebase - Pasos Exactos**

## ✅ **Estado Actual**
- ✅ Build creado exitosamente
- ✅ Firebase configurado (`firebase.json`)
- ✅ Carpeta `build/` lista para deploy

---

## 🚀 **Pasos para Deploy (Hazlos tú)**

### **Paso 1: Abrir PowerShell como Administrador**
1. Presiona `Windows + X`
2. Selecciona **"Windows PowerShell (Administrador)"**
3. Navega a tu proyecto:
   ```bash
   cd "c:\Users\Usuario 473\OneDrive\Desktop\cleopatra"
   ```

### **Paso 2: Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Paso 3: Login a Firebase**
```bash
firebase login
```
- Se abrirá tu navegador
- Inicia sesión con tu cuenta de Google
- Autoriza Firebase CLI

### **Paso 4: Crear Proyecto en Firebase Console**
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Clic **"Crear proyecto"**
3. Nombre del proyecto: `cleopatra-regalos`
4. **Crear proyecto**

### **Paso 5: Conectar tu Proyecto Local**
```bash
firebase use --add
```
- Selecciona el proyecto `cleopatra-regalos`
- Alias: `default`

### **Paso 6: Deploy**
```bash
firebase deploy --only hosting
```

### **Paso 7: ¡Listo!**
Tu sitio estará en:
```
https://cleopatra-regalos.web.app
```

---

## 🎯 **Alternativa: Deploy Manual (Si hay problemas con CLI)**

### **Opción B: Consola Web**
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto `cleopatra-regalos`
3. Ve a **Hosting** en el menú lateral
4. Clic **"Comenzar"**
5. **Arrastra la carpeta `build` completa** a la zona de upload
6. ¡Deploy automático!

---

## 📋 **Verificar Deploy**

### **Checklist Post-Deploy:**
- [ ] Sitio carga en `https://cleopatra-regalos.web.app`
- [ ] Logo de Cleopatra aparece
- [ ] Carrusel de imágenes funciona
- [ ] Navegación entre páginas funciona
- [ ] Carrito de compras funciona
- [ ] Formularios funcionan
- [ ] PWA se puede instalar en móvil

---

## 🔧 **Si algo no funciona:**

### **Problema: Imágenes no cargan**
- Verificar que las imágenes estén en `build/assets/`
- Rebuild: `npm run build`
- Re-deploy: `firebase deploy --only hosting`

### **Problema: Rutas no funcionan**
- Verificar `firebase.json` tiene:
  ```json
  "rewrites": [{"source": "**", "destination": "/index.html"}]
  ```

### **Problema: Deploy falla**
- Verificar permisos de administrador
- Usar `npx firebase-tools deploy --only hosting`

---

## 💡 **Comandos Útiles**

```bash
# Ver proyectos
firebase projects:list

# Ver estado del hosting
firebase hosting:sites:list

# Ver logs
firebase deploy --only hosting --debug

# Rollback (si algo sale mal)
firebase hosting:clone cleopatra-regalos:live cleopatra-regalos:previous
```

---

## 🎯 **Resultado Esperado**

Después del deploy tendrás:
- ✅ **URL pública**: `https://cleopatra-regalos.web.app`
- ✅ **SSL automático** (HTTPS)
- ✅ **CDN global** de Google
- ✅ **Dominio personalizado** disponible
- ✅ **Hosting gratuito** (10GB incluidos)

---

## 📱 **Compartir tu Demo**

Una vez deployado, puedes compartir:
```
🚀 Cleopatra Regalos - E-commerce Demo
https://cleopatra-regalos.web.app

✨ Funcionalidades:
- E-commerce completo
- PWA instalable
- Carrito persistente
- Panel de administración
- 60+ animaciones
- Responsive design
```

---

**¡Ejecuta los pasos y en 5 minutos tendrás tu sitio en vivo! 🔥**