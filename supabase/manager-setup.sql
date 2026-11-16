-- Run only after the manager has registered through the website.
-- Replace the email below with the manager's actual login email.
update public.profiles
set role = 'manager'
where id = (select id from auth.users where email = 'REPLACE-WITH-MANAGER-EMAIL');
