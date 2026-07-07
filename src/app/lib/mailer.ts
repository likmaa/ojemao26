import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendConfirmationEmailParams {
  to: string;
  nom: string;
  eventName: string;
  details: any;
}

interface SendFocalPointNotificationParams {
  focalPointEmail: string;
  focalPointName: string;
  country: string;
  participant: {
    nom: string;
    email: string;
    telephone?: string;
    whatsapp?: string;
    ville_pays?: string;
    statut?: string;
    organisation?: string;
  };
  eventName: string;
}

export async function sendConfirmationEmail({ to, nom, eventName, details }: SendConfirmationEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY non configurée. Email non envoyé à', to);
    return { success: false, error: 'API Key missing' };
  }

  try {
    let specificContent = '';
    
    if (eventName === 'Débat de Cotonou') {
      const isVIP = ['ong_asso', 'religieux_commu', 'institution_partenaire', 'comite_orga', 'comite_scientifique'].includes(details.type_participant);
      const passInfo = details.numero_chaise 
        ? `<div style="margin: 20px 0; padding: 20px; background: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 8px; text-align: center;">
             <div style="font-size: 0.8rem; color: #64748B; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1rem;">
               D2C26-CIF & Congrès
             </div>
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ojemao26.com/admin/verify?id=${details.id}" alt="QR Code" style="margin: 10px auto; display: block;" />
             <p style="font-size: 1.2rem; color: #10B981; font-weight: bold; margin: 10px 0;">Place N° ${details.numero_chaise} ${isVIP ? '⭐ (VIP)' : ''}</p>
             ${details.immatriculation ? `<p style="font-size: 1rem; color: #475569; margin: 0;">Matricule: <strong>${details.immatriculation}</strong></p>` : ''}
           </div>`
        : '';

      specificContent = `
        <p>Nous avons le plaisir de vous confirmer votre inscription au <strong>Débat de Cotonou (D2C26)</strong>.</p>
        <ul>
          <li><strong>Date :</strong> Samedi 25 Juillet 2026</li>
          <li><strong>Lieu :</strong> Bénin Royal Hôtel, Cotonou</li>
          <li><strong>Organisation :</strong> AIMB & RAI-Bénin</li>
          <li><strong>Téléphone :</strong> +229 0169506246</li>
        </ul>
        <p>L'accès est gratuit. Veuillez vous présenter à l'accueil muni d'une pièce d'identité ou de ce mail.</p>
        <p>Par ailleurs vous recevrez un passe à cause de la limite des places dans la salle de conférences du Bénin Royal Hôtel.</p>
        
        ${passInfo}

        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>Le comité d'organisation au +229 0169506246</p>
      `;
    } else if (eventName === 'Colloque International de Formation (CIF)') {
      specificContent = `
        <p>Nous avons le plaisir de vous confirmer votre pré-inscription au <strong>Colloque International de Formation (CIF)</strong>.</p>
        <ul>
          <li><strong>Dates :</strong> Du 26 au 28 Juillet 2026</li>
          <li><strong>Lieu :</strong> Siège de l'ONG Direct Aid, Cotonou</li>
          <li><strong>Délégation :</strong> ${details.association || 'N/A'}</li>
          <li><strong>Arrivée prévue :</strong> ${details.date_arrivee || 'N/A'}</li>
        </ul>
        <p><strong>Note importante :</strong> Vos frais de participation devront être réglés à votre arrivée sur le site.</p>
        
        <div style="background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0;">
          <div style="font-size: 0.8rem; color: #64748B; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1rem;">
            D2C26-CIF & Congrès
          </div>
          ${details.id ? `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ojemao26.com/admin/verify?id=${details.id}" alt="QR Code CIF" style="margin: 10px auto; display: block;" />` : ''}
          <p style="font-size: 1rem; color: #475569; margin: 10px 0;">Ce QR Code servira à valider votre présence sur le site du CIF.</p>
        </div>
      `;
    } else if (eventName === 'Congrès (Délégué)') {
      specificContent = `
        <p>Nous avons le plaisir de vous informer que votre accréditation en tant que Délégué pour le Congrès a été <strong>validée</strong> par l'administration.</p>
        <ul>
          <li><strong>Structure représentée :</strong> ${details.structure}</li>
          <li><strong>Pays :</strong> ${details.pays}</li>
          <li><strong>Fonction / Mandat :</strong> ${details.mandat}</li>
          <li><strong>Statut de l'accréditation :</strong> Validée</li>
        </ul>
        <p>Vos justificatifs (Ordre de mission et Pièce d'identité) ont été examinés et approuvés.</p>
        <p>Toutes les informations logistiques et le programme détaillé vous seront communiqués ultérieurement par la coordination.</p>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1E293B; background-color: #F8FAFC; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background-color: #38A554; padding: 30px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 30px; }
          .footer { background-color: #F1F5F9; padding: 20px; text-align: center; font-size: 12px; color: #64748B; }
          ul { background: #F8FAFC; padding: 20px 20px 20px 40px; border-radius: 6px; border: 1px solid #E2E8F0; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmation d'inscription</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${nom}</strong>,</p>
            ${specificContent}
            <p style="margin-top: 30px;">
              Si vous avez des questions, n'hésitez pas à nous contacter.<br/>
              L'équipe d'organisation OJEMAO.
            </p>
          </div>
          <div class="footer">
            Cet email a été généré automatiquement. Merci de ne pas y répondre directement.<br/>
            © 2026 OJEMAO - Tous droits réservés.
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'OJEMAO 2026 <inscription@ojemao26.logtech.tech>', 
      to: [to],
      subject: `Confirmation de votre inscription - ${eventName}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception in sendConfirmationEmail:', error);
    return { success: false, error };
  }
}

export async function sendFocalPointNotification({
  focalPointEmail,
  focalPointName,
  country,
  participant,
  eventName,
}: SendFocalPointNotificationParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY non configurée. Notification point focal non envoyée.');
    return { success: false, error: 'API Key missing' };
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1E293B; background-color: #F8FAFC; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .header { background-color: #034389; padding: 30px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
          .header p { margin: 8px 0 0; opacity: 0.85; font-size: 14px; }
          .content { padding: 30px; }
          .info-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; padding: 6px 0; border-bottom: 1px solid #F1F5F9; }
          .info-label { font-weight: 600; color: #475569; min-width: 160px; font-size: 0.9rem; }
          .info-value { color: #1E293B; font-size: 0.9rem; }
          .footer { background-color: #F1F5F9; padding: 20px; text-align: center; font-size: 12px; color: #64748B; }
          .badge { display: inline-block; background: rgba(3,67,137,0.1); color: #034389; border: 1px solid rgba(3,67,137,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Nouvelle Inscription — ${eventName}</h1>
            <p>Un participant de votre pays vient de s'inscrire</p>
          </div>
          <div class="content">
            <span class="badge">Point Focal — ${country}</span>
            <p>Bonjour <strong>${focalPointName}</strong>,</p>
            <p>
              Un participant de votre délégation (<strong>${country}</strong>) vient de s'inscrire à l'événement <strong>${eventName}</strong>.
              Voici ses coordonnées :
            </p>
            <div class="info-card">
              <div class="info-row">
                <span class="info-label">Nom & Prénom</span>
                <span class="info-value">${participant.nom}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value"><a href="mailto:${participant.email}">${participant.email}</a></span>
              </div>
              ${participant.telephone ? `<div class="info-row"><span class="info-label">Téléphone</span><span class="info-value">${participant.telephone}</span></div>` : ''}
              ${participant.whatsapp ? `<div class="info-row"><span class="info-label">WhatsApp</span><span class="info-value">${participant.whatsapp}</span></div>` : ''}
              ${participant.ville_pays ? `<div class="info-row"><span class="info-label">Ville / Pays</span><span class="info-value">${participant.ville_pays}</span></div>` : ''}
              ${participant.statut ? `<div class="info-row"><span class="info-label">Statut / Profil</span><span class="info-value">${participant.statut}</span></div>` : ''}
              ${participant.organisation ? `<div class="info-row"><span class="info-label">Organisation</span><span class="info-value">${participant.organisation}</span></div>` : ''}
            </div>
            <p>
              Veuillez noter cette inscription et prendre contact si nécessaire pour coordonner la délégation de votre pays.
            </p>
            <p style="margin-top: 30px;">
              Le Comité d'Organisation OJEMAO<br/>
              <a href="https://ojemao26.com">ojemao26.com</a>
            </p>
          </div>
          <div class="footer">
            Cet email vous est envoyé en tant que Point Focal officiel pour <strong>${country}</strong>.<br/>
            © 2026 OJEMAO - Tous droits réservés.
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'OJEMAO 2026 <inscription@ojemao26.logtech.tech>',
      to: [focalPointEmail],
      subject: `[Notification] Nouvelle inscription ${country} — ${eventName}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending focal point notification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception in sendFocalPointNotification:', error);
    return { success: false, error };
  }
}
