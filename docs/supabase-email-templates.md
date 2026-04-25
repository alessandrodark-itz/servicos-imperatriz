# Templates de E-mail — Supabase

Acesse **Authentication > Email Templates** no painel do Supabase e cole os templates abaixo.

---

## Template: Confirmação de conta

> **Caminho:** Authentication → Email Templates → Confirm signup

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme seu cadastro</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d1a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#16162a;border-radius:16px;overflow:hidden;border:1px solid rgba(127,119,221,0.3);">
          <tr>
            <td style="background:#7F77DD;padding:32px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Serviços Imperatriz</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Conectando Imperatriz</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(127,119,221,0.15);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;">
                <span style="font-size:28px;">✉️</span>
              </div>
              <h2 style="color:#fff;font-size:22px;margin:0 0 12px;">Confirme seu e-mail</h2>
              <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.6;margin:0 0 32px;">
                Olá! Você criou uma conta no Serviços Imperatriz.<br>
                Clique no botão abaixo para ativar sua conta.
              </p>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#7F77DD;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:16px;font-weight:600;">
                Ativar minha conta
              </a>
              <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:24px 0 0;">
                Este link expira em 24 horas. Se você não criou esta conta, ignore este e-mail.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
              <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
                © 2025 Serviços Imperatriz — Imperatriz, Maranhão
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Template: Recuperação de senha

> **Caminho:** Authentication → Email Templates → Reset password

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Recuperar senha</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d1a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#16162a;border-radius:16px;overflow:hidden;border:1px solid rgba(127,119,221,0.3);">
          <tr>
            <td style="background:#7F77DD;padding:32px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Serviços Imperatriz</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(127,119,221,0.15);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;">
                <span style="font-size:28px;">🔐</span>
              </div>
              <h2 style="color:#fff;font-size:22px;margin:0 0 12px;">Redefinir senha</h2>
              <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.6;margin:0 0 32px;">
                Recebemos uma solicitação para redefinir sua senha.<br>
                Clique no botão abaixo para criar uma nova senha.
              </p>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#7F77DD;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:16px;font-weight:600;">
                Redefinir minha senha
              </a>
              <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:24px 0 0;">
                Este link expira em 1 hora. Se você não solicitou a redefinição, ignore este e-mail.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
              <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
                © 2025 Serviços Imperatriz — Imperatriz, Maranhão
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Configuração adicional no Supabase

### URL de redirecionamento (obrigatório)

Em **Authentication → URL Configuration**, adicione nas **Redirect URLs**:

```
http://localhost:3000/auth/confirmar
http://localhost:3000/auth/nova-senha
https://seu-dominio.com/auth/confirmar
https://seu-dominio.com/auth/nova-senha
```

### Site URL

Configure a **Site URL** com a URL de produção do seu projeto:

```
https://seu-dominio.com
```
