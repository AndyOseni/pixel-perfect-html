ALTER TABLE public.members ADD COLUMN IF NOT EXISTS payslip_path text;
ALTER TABLE public.loans ADD COLUMN IF NOT EXISTS payslip_path text;