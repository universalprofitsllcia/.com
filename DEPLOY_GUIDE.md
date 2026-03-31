# 🚀 Guía de Despliegue: Universal Profits (Versión Pro)

Sigue estos pasos para activar tu plataforma en Supabase y Vercel.

## Paso 1: Configuración de la Base de Datos (Supabase)
1. Entra a [Supabase.com](https://supabase.com).
2. Crea un nuevo proyecto llamado "Universal Profits".
3. Ve a **SQL Editor** (icon superior izquierda).
4. Pega el contenido de `supabase_setup.sql`.
5. Pulsa **RUN**. Verás "Success: Query returned 0 rows".

## Paso 2: Autenticación (Supabase)
1. Ve a **Authentication** > **URL Configuration**.
2. En **Site URL**, pon la dirección que te dará Vercel al final.
3. Desactiva "Confirm Email" (opcional) si quieres que los usuarios entren directo al registrarse (Authentication -> Providers -> Email -> Confirm email).

## Paso 3: Despliegue del Portal (Vercel)
1. Sube tu código a GitHub.
2. En Vercel, pulsa **Add New** -> **Project**.
3. Importa el repositorio.
4. En **Environment Variables**, añade:
   - `NEXT_PUBLIC_SUPABASE_URL`: (Busca en Settings -> API -> Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Busca en Settings -> API -> `anon public`)
5. Pulsa **Deploy**.

## Paso 4: Probar y Ser Admin
1. Entra a tu nueva web.
2. Regístrate con tu correo y contraseña.
3. Ve a Supabase -> **Table Editor** -> `profiles`.
4. Busca tu usuario y marca `is_admin` como `true`.
5. Recarga la web y ¡listo! Tienes control total.
