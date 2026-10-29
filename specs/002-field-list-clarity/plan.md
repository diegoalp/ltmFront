# Implementation Plan: Clearer field listing

Use five columns: Campo, Cadastro e seção, Tipo, Exibição, Ações. Move drag
handles into the name cell; render type and required status as secondary text.
Use a native modal dialog in a small settings component for accessible focus
trapping, Escape dismissal and focus restoration. Resolve rule values using the
page's existing option lookup and pass display-only data to the component.

Run npm run build; inspect the existing local Firefox session, open a conditional
field's dialog, verify all option names, close and inspect row actions. No writes
to CRM data are required for verification.
