import type { FeatureModel } from "@/models/feature-model"

// Static list of features and technologies shown in the "Acerca de" page.
// Ordered from most recent to oldest publication date.
export const features: FeatureModel[] = [
  {
    id: "file-upload",
    name: "File Upload",
    description:
      "Módulo de carga de archivos a AWS S3 con soporte para chunks, " +
      "pausa/reanudación y tipificación de archivos. Garantiza subidas " +
      "robustas y seguras de cualquier tamaño. Ver imagen: /file-upload.png",
    publishedAt: "2026-04-09",
  },
  {
    id: "rol-manager",
    name: "Rol Manager",
    description:
      "Módulo de gestión de roles y permisos mediante un árbol jerárquico " +
      "interactivo. Permite crear roles, asignar permisos granulares y " +
      "controlar el acceso por sección. Ver imagen: /admin-rol.png",
    publishedAt: "2026-03-21",
  },
  {
    id: "infinity-scroll",
    name: "Infinity Scroll y React Virtualization",
    description:
      "Optimización del rendimiento en listas extensas mediante la carga " +
      "progresiva de datos y el renderizado eficiente de componentes visibles.",
    publishedAt: "2026-03-19",
  },
  {
    id: "google-oauth2",
    name: "Autenticación con Google OAuth2",
    description:
      "Integración de inicio de sesión social permitiendo a los usuarios " +
      "autenticarse de forma rápida y segura con sus cuentas de Google.",
    publishedAt: "2026-03-16",
  },
  {
    id: "otp-validation",
    name: "Validación OTP (One-Time Password)",
    description:
      "Proceso de verificación de correo electrónico mediante códigos " +
      "temporales de un solo uso, fortaleciendo la seguridad en el registro.",
    publishedAt: "2026-03-12",
  },
  {
    id: "session-timeout",
    name: "Session Timeout Management",
    description:
      "Control proactivo de la expiración de sesiones tanto en el cliente " +
      "como en el servidor para proteger la información sensible.",
    publishedAt: "2026-03-10",
  },
  {
    id: "silent-refresh",
    name: "Silent Refresh con JWT",
    description:
      "Sistema de renovación automática de tokens de acceso utilizando " +
      "Refresh Tokens almacenados en cookies HttpOnly para mejorar la " +
      "seguridad y la experiencia del usuario.",
    publishedAt: "2026-03-08",
  },
  {
    id: "cqrs",
    name: "Patrón CQRS",
    description:
      "Separación de las operaciones de lectura y escritura para optimizar " +
      "el rendimiento y la claridad del código.",
    publishedAt: "2026-02-15",
  },
  {
    id: "repository-unit-of-work",
    name: "Patrones Repository y Unit of Work",
    description:
      "Abstracción de la lógica de acceso a datos y gestión de transacciones " +
      "para asegurar la integridad de la base de datos.",
    publishedAt: "2026-02-10",
  },
  {
    id: "clean-architecture",
    name: "Arquitectura Limpia (Clean Architecture)",
    description:
      "Implementación de una estructura desacoplada en capas (Domain, " +
      "Application, Infrastructure, Presentation) para facilitar el " +
      "mantenimiento y escalabilidad.",
    publishedAt: "2026-02-01",
  },
]
