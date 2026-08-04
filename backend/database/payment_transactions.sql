CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id BIGSERIAL PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  package_code VARCHAR(60) NOT NULL,
  package_name VARCHAR(150) NOT NULL,
  gross_amount BIGINT NOT NULL CHECK (gross_amount > 0),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  payment_type VARCHAR(50),
  transaction_id VARCHAR(150),
  snap_token TEXT,
  midtrans_payload JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id
  ON public.payment_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_status
  ON public.payment_transactions(payment_status);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Backend memakai koneksi PostgreSQL server-side. Jangan beri INSERT/UPDATE publik.

