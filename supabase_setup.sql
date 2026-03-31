-- 1. TABLA DE PERFILES (Extensión de Auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  firstname TEXT,
  lastname TEXT,
  wallet_address TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  balance DECIMAL(20,2) DEFAULT 0,
  invested DECIMAL(20,2) DEFAULT 0,
  earnings DECIMAL(20,2) DEFAULT 0,
  last_payout_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Seguridad de Nivel de Fila (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil (limitado)" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. TABLA DE INVERSIONES
CREATE TABLE public.investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(20,2) NOT NULL,
  daily_pct DECIMAL(5,4) DEFAULT 0.0125,
  status TEXT CHECK (status IN ('active', 'completed')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_payout_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios ven sus propias inversiones" ON public.investments FOR SELECT USING (auth.uid() = user_id);

-- 3. TABLA DE TRANSACCIONES (Depósitos y Retiros)
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(20,2) NOT NULL,
  type TEXT CHECK (type IN ('deposit', 'withdrawal')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'denied')) DEFAULT 'pending',
  wallet_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios gestionan sus transacciones" ON public.transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin ve todas las transacciones" ON public.transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 4. FUNCIÓN DE AUTOMATIZACIÓN DE GANANCIAS (GRATIS)
-- Esta función calcula cuánto se debe pagar desde la última visita
CREATE OR REPLACE FUNCTION public.apply_auto_profits(target_uid UUID)
RETURNS VOID AS $$
DECLARE
    total_gain DECIMAL(20,2) := 0;
    days_diff INT;
    rec RECORD;
BEGIN
    -- Solo pagamos si es día de semana (Lunes a Viernes) y después de las 6 PM (opcional)
    -- Para simplicidad en el cálculo acumulado, contamos días totales pasados
    FOR rec IN SELECT * FROM investments WHERE user_id = target_uid AND status = 'active'
    LOOP
        days_diff := floor(extract(epoch from (now() - rec.last_payout_at)) / 86400);
        
        IF days_diff > 0 THEN
            total_gain := total_gain + (rec.amount * rec.daily_pct * days_diff);
            UPDATE investments SET last_payout_at = now() WHERE id = rec.id;
        END IF;
    END LOOP;

    IF total_gain > 0 THEN
        UPDATE profiles SET 
            balance = balance + total_gain,
            earnings = earnings + total_gain 
        WHERE id = target_uid;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. TRIGGER: CREAR PERFIL AUTOMÁTICAMENTE AL REGISTRARSE
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, firstname)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
