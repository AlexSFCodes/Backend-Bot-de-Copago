# 🚀 RESUMEN TÉCNICO: Backend Bot de Copago

## 🎯 Objetivo
Proporcionar una herramienta inteligente que ayude a los pacientes a estimar sus gastos médicos basándose en su seguro y la red de hospitales.

## 🛠️ Tecnologías
- **Runtime**: Node.js
- **Framework**: Express
- **Base de Datos**: SQLite (Better-SQLite3)
- **IA**: Google Gemini API

## 🔑 Funcionalidades Clave
1. **Detección de Especialidad**: Mapeo automático de síntomas a especialidades médicas usando IA.
2. **Cálculo de Cobertura**: Lógica dinámica para calcular copagos.
3. **Optimización de Red**: Sugiere el hospital más económico según el plan del usuario.
4. **Logs Persistentes**: Almacenamiento local de consultas para análisis posterior.

## 🔌 API Quick Reference
- `POST /api/chat`: Corazón del sistema.
- `GET /api/plans`: Lista de seguros.
- `GET /api/history`: Historial de uso.

---
Creado por Antigravity AI.
