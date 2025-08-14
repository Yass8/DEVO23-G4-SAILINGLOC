

export const confirmationEmailHtml = (username, URL, token) => `
  <!DOCTYPE html>
  <html lang="fr">
    <body style="background-color: #F5F1EB; font-family: 'Open Sans', sans-serif; color: #4B6A88; margin: 20px 0px; padding: 0;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #C1D0C4;">
        <div style="text-align: center; background-color: #AD7C59; color: white; padding: 16px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Bienvenue à bord de SailingLoc !</h1>
        </div>
        <p style="margin-top: 20px;">Bonjour ${username},</p>
        <p>Merci d’avoir rejoint <strong>SailingLoc</strong>, la plateforme dédiée à la location de voiliers et de bateaux entre passionnés de navigation.</p>
        <p>Pour confirmer ton compte, clique sur le bouton ci-dessous :</p>
        <p style="text-align: center;">
          <a href="${URL}/auth/confirmation/${token}"
             style="display: inline-block; padding: 12px 24px; background-color: #4B6A88; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
             Confirmer mon compte
          </a>
        </p>
        <p>Si tu n’es pas à l’origine de cette demande, tu peux simplement ignorer ce message.</p>
            <div style="margin-top: 30px; font-size: 12px; text-align: center; color: #999;">
              &copy; 2025 SailingLoc — Naviguez entre particuliers
            </div>
          </div>
        </body>
      </html>
    `;

export const resetPasswordEmailHtml = (username, URL, token) => `
  <!DOCTYPE html>
  <html lang="fr">
    <body style="background-color: #F5F1EB; font-family: 'Open Sans', sans-serif; color: #4B6A88; margin: 20px 0px; padding: 0;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #C1D0C4;">
        <div style="text-align: center; background-color: #AD7C59; color: white; padding: 16px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Réinitialisation de mot de passe</h1>
        </div>
        <p style="margin-top: 20px;">Bonjour ${username},</p>
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte sur <strong>SailingLoc</strong>.</p>
        <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
        <p style="text-align: center;">
          <a href="${URL}/auth/reset-password/${token}"
             style="display: inline-block; padding: 12px 24px; background-color: #4B6A88; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
             Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.</p>
            <div style="margin-top: 30px; font-size: 12px; text-align: center; color: #999;">
              &copy; 2025 SailingLoc — Naviguez entre particuliers
            </div>
          </div>
        </body>
      </html>
    `;