-- Fix stores schema: rename name→name_th if needed, add missing columns
DO $$
BEGIN
  -- Rename name → name_th only if name exists (local env)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='stores' AND column_name='name'
  ) THEN
    ALTER TABLE stores RENAME COLUMN name TO name_th;
  END IF;

  -- Add missing columns (cloud env may not have them)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='stores' AND column_name='owner_id'
  ) THEN
    ALTER TABLE stores ADD COLUMN owner_id UUID REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='stores' AND column_name='is_deleted'
  ) THEN
    ALTER TABLE stores ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='stores' AND column_name='locale'
  ) THEN
    ALTER TABLE stores ADD COLUMN locale TEXT NOT NULL DEFAULT 'th';
  END IF;
END $$;
