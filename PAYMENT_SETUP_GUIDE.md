# 💳 Sistema de Pagos - Guía de Configuración

## 🎯 **Lo que hemos creado:**

### ✅ **Firebase Functions** (Backend)
- Integración con Wompi API
- Procesamiento de pagos seguro
- Webhooks para notificaciones
- Base de datos Firestore

### ✅ **Métodos de Pago Soportados**
- 💳 **Tarjetas de Crédito/Débito**
- 📱 **Nequi**
- 🏦 **PSE** (15 bancos principales)

## 🚀 **Pasos para Activar:**

### **Paso 1: Registrarse en Wompi**
1. Ve a [wompi.co](https://wompi.co)
2. Crea cuenta empresarial
3. Completa verificación KYC
4. Obtén credenciales:
   - **Public Key**: `pub_prod_xxxxx`
   - **Private Key**: `prv_prod_xxxxx`

### **Paso 2: Configurar Firebase**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Configurar proyecto
firebase use --add

# Configurar credenciales de Wompi
firebase functions:config:set wompi.public_key="pub_test_xxxxx"
firebase functions:config:set wompi.private_key="prv_test_xxxxx"
```

### **Paso 3: Deploy Functions**
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### **Paso 4: Configurar Frontend**
Crear `.env`:
```bash
REACT_APP_FIREBASE_FUNCTIONS_URL=https://us-central1-tu-proyecto.cloudfunctions.net
```

## 💰 **Costos Wompi:**
- **Tarjetas**: 2.9% + $900 COP
- **Nequi**: 1.95% + $900 COP  
- **PSE**: 1.95% + $900 COP
- **Sin cuota mensual**

## 🔧 **Próximos Pasos:**

1. **¿Tienes cuenta en Wompi?**
2. **¿Quieres usar modo TEST primero?**
3. **¿Necesitas ayuda con Firebase setup?**

**Responde y continuamos con la implementación del frontend de pagos.**