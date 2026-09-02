-- Adresse e-mail du notaire sur la commande.
--
-- Sans elle, impossible de prévenir le client à l'expédition : le webhook de
-- l'imprimeur ne transmet que la référence de commande, et remonter jusqu'au
-- profil ne donnerait pas forcément l'adresse utilisée à l'achat.
alter table public.card_orders
  add column if not exists email text;
