CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  member_number TEXT,
  member_name TEXT,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('member','trustee')),
  sender_name TEXT NOT NULL,
  body TEXT NOT NULL,
  read_by_trustee BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX chat_messages_conversation_idx ON public.chat_messages (conversation_id, created_at);

GRANT SELECT, INSERT, UPDATE ON public.chat_messages TO anon;
GRANT SELECT, INSERT, UPDATE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "App users can read chat messages" ON public.chat_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "App users can post chat messages" ON public.chat_messages FOR INSERT TO anon, authenticated WITH CHECK (char_length(body) BETWEEN 1 AND 4000);
CREATE POLICY "App users can mark chat messages read" ON public.chat_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;