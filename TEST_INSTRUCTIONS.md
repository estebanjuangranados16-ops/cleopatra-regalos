# 🧪 Instrucciones de Prueba - Sistema de Pagos

## ✅ **Sistema Demo Listo**

### 🎯 **Cómo Probar:**

1. **Iniciar la aplicación**
   ```bash
   npm start
   ```

2. **Agregar productos al carrito**
   - Ve a la página principal
   - Agrega algunos productos
   - Ve al carrito

3. **Proceso de checkout**
   - Clic en "Proceder al Pago"
   - Llena información de envío
   - Selecciona "Wompi" como método de pago

4. **Probar métodos de pago**

### 💳 **Tarjetas (Datos de Prueba):**
- **Número**: 4242424242424242
- **Fecha**: 12/25
- **CVC**: 123
- **Titular**: Tu nombre

### 📱 **Nequi:**
- Solo clic en "Pagar"
- Simula redirección a app

### 🏦 **PSE:**
- Seleccionar banco (ej: Bancolombia)
- Tipo: Persona Natural
- Documento: CC
- Número: 12345678

## 🎲 **Resultados Simulados:**

### **Tarjetas**: 90% éxito
### **Nequi**: 95% éxito  
### **PSE**: 80% éxito (puede fallar para demostrar errores)

## 🔍 **Qué Observar:**

1. **Loading states** - Spinner durante procesamiento
2. **Formularios dinámicos** - Cambian según método
3. **Validaciones** - Campos requeridos
4. **Resultados aleatorios** - Éxito/fallo simulado
5. **Redirecciones** - A páginas de éxito/fallo
6. **Notificaciones** - Toasts de confirmación

## 📱 **Responsive:**
- Prueba en móvil
- Formularios adaptativos
- Botones touch-friendly

## 🎨 **Temas:**
- Funciona con tema Regalos (dorado)
- Funciona con tema Tecnología (azul)

## 🚀 **Próximos Pasos:**
Una vez probado el demo, podemos:
1. Configurar Firebase real
2. Integrar Wompi real
3. Deploy a producción

**¡Prueba el sistema y dime qué tal funciona!**